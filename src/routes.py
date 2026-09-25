"""
DineIQ Analytics Platform - REST CRUD Endpoints
Implements SRS Functional Requirements (i) through (xi):
  (i)   User Registration and Authentication (Managers, Analysts, Regional Managers, Admins)
  (ii)  Role-Based Access Control (RBAC)
  (iii) Restaurant Location Management (Admin CRUD)
  (iv)  Menu Management (Categories, Items, Prices, Costs, Descriptions, Availability)
  (v)   Pricing History Management
  (vi)  Customer Data Management (Anonymized Profiles)
  (vii) Order Management (Headers + Order-Lines)
  (viii) Promotion Management (Discounts, Coupons, Campaign Periods, Applicable Items)
  (ix)  Rating Management
  (x)   Inventory Management
  (xi)  Wastage Management
"""

import uuid
from datetime import date, datetime
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Header, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database.connection import get_db, hash_password
from database.models import (
    Customer,
    Inventory,
    MenuCategory,
    MenuItem,
    Order,
    OrderItem,
    PricingHistory,
    Promotion,
    Rating,
    Restaurant,
    Role,
    User,
    Wastage,
)

router = APIRouter(prefix="/api/v1", tags=["SRS Functional Requirements (i-xi)"])

# In-memory session store for tokens: token -> user dict
ACTIVE_TOKENS: Dict[str, Dict[str, Any]] = {}


# =============================================================================
# RBAC & AUTH HELPERS (Requirements i & ii)
# =============================================================================

def get_current_user(
    authorization: Optional[str] = Header(None),
    x_user_role: Optional[str] = Header(None),
    x_username: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Extracts authenticated user context from Bearer token or development headers.
    Supports JWT/Bearer tokens and role simulation for integration testing.
    """
    # 1. Check Bearer token in active session store
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        if token in ACTIVE_TOKENS:
            return ACTIVE_TOKENS[token]
        # Allow token format "mock_<username>_<role>" for stateless testing
        if token.startswith("token_"):
            parts = token.split("_")
            if len(parts) >= 3:
                return {
                    "user_id": f"USER-{parts[1].upper()}",
                    "username": parts[1],
                    "role_id": parts[2],
                    "email": f"{parts[1]}@dineiq.com"
                }

    # 2. Check X-User-Role header (for direct testing & role emulation)
    if x_user_role:
        username = x_username or f"user_{x_user_role}"
        return {
            "user_id": f"USER-{username.upper()}",
            "username": username,
            "role_id": x_user_role,
            "email": f"{username}@dineiq.com"
        }

    # Default fallback: reject if unauthenticated
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing or invalid authentication token. Provide 'Authorization: Bearer <token>' or 'X-User-Role'."
    )


def require_roles(allowed_roles: List[str]):
    """Role-Based Access Control dependency factory."""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role_id")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: role '{user_role}' does not have permission. Required one of: {allowed_roles}"
            )
        return current_user
    return role_checker


# =============================================================================
# PYDANTIC SCHEMAS
# =============================================================================

# Auth Schemas
class UserRegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str
    role_id: str = "analyst"  # admin, regional_manager, manager, analyst
    assigned_location_id: Optional[str] = None

class UserLoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: str
    username: str
    email: str
    full_name: str
    role_id: str
    assigned_location_id: Optional[str] = None
    is_active: bool

# Restaurant Location Schemas
class RestaurantCreate(BaseModel):
    restaurant_id: Optional[str] = None
    location_id: str
    name: str
    city: str
    state: str
    country: Optional[str] = "USA"
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_tier: Optional[str] = "TIER_1"
    seating_capacity: Optional[int] = 120
    cost_index: Optional[float] = 1.000
    has_drive_thru: Optional[bool] = False
    has_outdoor_seating: Optional[bool] = False
    manager_name: Optional[str] = None
    phone_number: Optional[str] = None
    operating_status: Optional[str] = "ACTIVE"

class RestaurantUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    seating_capacity: Optional[int] = None
    cost_index: Optional[float] = None
    has_drive_thru: Optional[bool] = None
    has_outdoor_seating: Optional[bool] = None
    manager_name: Optional[str] = None
    phone_number: Optional[str] = None
    operating_status: Optional[str] = None

# Menu Schemas
class MenuCategoryCreate(BaseModel):
    category_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    target_margin_pct: Optional[float] = 60.0
    is_active: Optional[bool] = True

class MenuItemCreate(BaseModel):
    item_id: Optional[str] = None
    category_id: str
    name: str
    description: Optional[str] = None
    base_price: float
    cost_price: float
    margin_pct: Optional[float] = None
    is_vegetarian: Optional[bool] = False
    is_gluten_free: Optional[bool] = False
    is_alcohol: Optional[bool] = False
    prep_time_minutes: Optional[int] = 15
    shelf_life_days: Optional[int] = 3
    is_seasonal: Optional[bool] = False
    complexity_profile: Optional[str] = "Medium"
    popularity_weight: Optional[float] = 1.0
    wastage_risk_score: Optional[float] = 0.2
    elasticity_score: Optional[float] = 1.0
    is_active: Optional[bool] = True

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    cost_price: Optional[float] = None
    is_active: Optional[bool] = None
    prep_time_minutes: Optional[int] = None

# Pricing History Schema
class PricingHistoryCreate(BaseModel):
    price_history_id: Optional[str] = None
    item_id: str
    location_id: str
    base_price: float
    cost_price: float
    effective_start_date: Optional[str] = None
    effective_end_date: Optional[str] = None
    change_reason: Optional[str] = "Standard Price Revision"
    complexity_profile: Optional[str] = "Routine"

# Customer Schemas
class CustomerCreate(BaseModel):
    customer_id: Optional[str] = None
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone_number: Optional[str] = None
    customer_segment: Optional[str] = "Occasional"
    loyalty_tier: Optional[str] = "Bronze"
    loyalty_points: Optional[int] = 0
    preferred_location_id: Optional[str] = None
    is_active: Optional[bool] = True
    churn_risk_score: Optional[float] = 0.1

class CustomerUpdate(BaseModel):
    customer_segment: Optional[str] = None
    loyalty_tier: Optional[str] = None
    loyalty_points: Optional[int] = None
    preferred_location_id: Optional[str] = None
    churn_risk_score: Optional[float] = None
    is_active: Optional[bool] = None

# Order Schemas
class OrderLineItem(BaseModel):
    item_id: str
    quantity: int
    unit_price: float
    item_discount: Optional[float] = 0.0

class OrderCreate(BaseModel):
    order_id: Optional[str] = None
    customer_id: Optional[str] = None
    location_id: str
    order_date: Optional[str] = None
    order_time: Optional[str] = None
    order_type: Optional[str] = "Dine-in"
    order_status: Optional[str] = "COMPLETED"
    payment_method: Optional[str] = "Credit Card"
    promotion_id: Optional[str] = None
    table_number: Optional[int] = None
    tip_amount: Optional[float] = 0.0
    items: List[OrderLineItem]

# Promotion Schemas
class PromotionCreate(BaseModel):
    promotion_id: Optional[str] = None
    promotion_name: str
    discount_type: str = "Percentage"  # Percentage, Fixed, BOGO
    discount_value: float
    min_order_amount: Optional[float] = 0.0
    max_discount_amount: Optional[float] = 50.0
    applicable_category: Optional[str] = "All"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    target_segment: Optional[str] = "All"
    complexity_tag: Optional[str] = "Simple"
    is_misleading: Optional[bool] = False
    description: Optional[str] = None

class PromotionUpdate(BaseModel):
    promotion_name: Optional[str] = None
    discount_value: Optional[float] = None
    min_order_amount: Optional[float] = None
    max_discount_amount: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_misleading: Optional[bool] = None

# Rating Schema
class RatingCreate(BaseModel):
    rating_id: Optional[str] = None
    order_id: Optional[str] = None
    customer_id: Optional[str] = None
    item_id: Optional[str] = None
    location_id: str
    overall_rating: int = Field(..., ge=1, le=5)
    food_rating: Optional[int] = Field(None, ge=1, le=5)
    service_rating: Optional[int] = Field(None, ge=1, le=5)
    ambiance_rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = None
    review_date: Optional[str] = None

# Inventory Schemas
class InventoryCreate(BaseModel):
    inventory_id: Optional[str] = None
    location_id: str
    item_id: str
    snapshot_date: Optional[str] = None
    starting_stock: int
    quantity_received: Optional[int] = 0
    quantity_sold: Optional[int] = 0
    quantity_wasted: Optional[int] = 0
    ending_stock: int
    reorder_point: Optional[int] = 10
    stock_status: Optional[str] = "Adequate"

class InventoryUpdate(BaseModel):
    starting_stock: Optional[int] = None
    quantity_received: Optional[int] = None
    quantity_sold: Optional[int] = None
    quantity_wasted: Optional[int] = None
    ending_stock: Optional[int] = None
    reorder_point: Optional[int] = None
    stock_status: Optional[str] = None

# Wastage Schema
class WastageCreate(BaseModel):
    wastage_id: Optional[str] = None
    item_id: str
    location_id: str
    wastage_date: Optional[str] = None
    wastage_time: Optional[str] = None
    quantity_wasted: int
    unit_cost: float
    total_loss_amount: Optional[float] = None
    wastage_reason: Optional[str] = "Expired"
    reported_by: Optional[str] = "Manager"


# =============================================================================
# (i) & (ii) USER AUTHENTICATION & ROLE-BASED ACCESS CONTROL
# =============================================================================

@router.post("/auth/register", status_code=status.HTTP_201_CREATED, tags=["(i) Auth & (ii) RBAC"])
def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """Register a new user (manager, analyst, regional_manager, admin)."""
    # Verify role exists
    role = db.query(Role).filter(Role.role_id == req.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail=f"Invalid role '{req.role_id}'. Valid roles: admin, regional_manager, manager, analyst")

    # Check if username or email already exists
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(status_code=400, detail="Username already registered")
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = f"USER-{uuid.uuid4().hex[:8].upper()}"
    new_user = User(
        user_id=user_id,
        username=req.username,
        email=req.email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role_id=req.role_id,
        assigned_location_id=req.assigned_location_id,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User registered successfully",
        "user": {
            "user_id": new_user.user_id,
            "username": new_user.username,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role_id": new_user.role_id,
            "assigned_location_id": new_user.assigned_location_id
        }
    }


@router.post("/auth/login", tags=["(i) Auth & (ii) RBAC"])
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticate user credentials and issue an access token."""
    user = db.query(User).filter(User.username == req.username).first()
    if not user or user.hashed_password != hash_password(req.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is deactivated")

    # Generate session token
    token = f"token_{user.username}_{user.role_id}_{uuid.uuid4().hex[:12]}"
    user_payload = {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "role_id": user.role_id,
        "assigned_location_id": user.assigned_location_id
    }
    ACTIVE_TOKENS[token] = user_payload

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_payload
    }


@router.get("/auth/me", tags=["(i) Auth & (ii) RBAC"])
def get_current_user_profile(user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve currently authenticated user's profile and permissions."""
    return {"user": user}


@router.get("/auth/roles", tags=["(i) Auth & (ii) RBAC"])
def list_roles(db: Session = Depends(get_db)):
    """List all available system roles."""
    roles = db.query(Role).all()
    return [{"role_id": r.role_id, "role_name": r.role_name, "description": r.description} for r in roles]


# =============================================================================
# (iii) RESTAURANT LOCATION MANAGEMENT (Admin CRUD)
# =============================================================================

@router.get("/locations", tags=["(iii) Location Management"])
def list_locations(
    city: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve all restaurant locations."""
    query = db.query(Restaurant)
    if city:
        query = query.filter(Restaurant.city.ilike(f"%{city}%"))
    if status_filter:
        query = query.filter(Restaurant.operating_status == status_filter)
    locations = query.all()
    return [
        {
            "restaurant_id": l.restaurant_id,
            "location_id": l.location_id,
            "name": l.name,
            "city": l.city,
            "state": l.state,
            "country": l.country,
            "seating_capacity": l.seating_capacity,
            "cost_index": l.cost_index,
            "operating_status": l.operating_status,
            "manager_name": l.manager_name,
            "phone_number": l.phone_number
        }
        for l in locations
    ]


@router.get("/locations/{location_id}", tags=["(iii) Location Management"])
def get_location(location_id: str, db: Session = Depends(get_db)):
    """Get location details by location_id."""
    loc = db.query(Restaurant).filter(
        (Restaurant.location_id == location_id) | (Restaurant.restaurant_id == location_id)
    ).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found")
    return {
        "restaurant_id": loc.restaurant_id,
        "location_id": loc.location_id,
        "name": loc.name,
        "city": loc.city,
        "state": loc.state,
        "country": loc.country,
        "seating_capacity": loc.seating_capacity,
        "cost_index": loc.cost_index,
        "has_drive_thru": loc.has_drive_thru,
        "has_outdoor_seating": loc.has_outdoor_seating,
        "operating_status": loc.operating_status,
        "manager_name": loc.manager_name
    }


@router.post("/locations", status_code=status.HTTP_201_CREATED, tags=["(iii) Location Management"])
def create_location(
    req: RestaurantCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    """Admin CRUD: Create a new restaurant location."""
    existing = db.query(Restaurant).filter(Restaurant.location_id == req.location_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Location ID '{req.location_id}' already exists")

    rest_id = req.restaurant_id or f"REST-{uuid.uuid4().hex[:6].upper()}"
    new_loc = Restaurant(
        restaurant_id=rest_id,
        location_id=req.location_id,
        name=req.name,
        city=req.city,
        state=req.state,
        country=req.country or "USA",
        postal_code=req.postal_code,
        latitude=req.latitude,
        longitude=req.longitude,
        location_tier=req.location_tier,
        seating_capacity=req.seating_capacity,
        cost_index=req.cost_index,
        has_drive_thru=req.has_drive_thru,
        has_outdoor_seating=req.has_outdoor_seating,
        manager_name=req.manager_name,
        phone_number=req.phone_number,
        operating_status=req.operating_status
    )
    db.add(new_loc)
    db.commit()
    db.refresh(new_loc)
    return {"message": "Location created successfully", "location_id": new_loc.location_id}


@router.put("/locations/{location_id}", tags=["(iii) Location Management"])
def update_location(
    location_id: str,
    req: RestaurantUpdate,
    user: Dict[str, Any] = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    """Admin CRUD: Update restaurant location details."""
    loc = db.query(Restaurant).filter(
        (Restaurant.location_id == location_id) | (Restaurant.restaurant_id == location_id)
    ).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found")

    data = req.model_dump(exclude_unset=True) if hasattr(req, "model_dump") else req.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(loc, field, val)

    db.commit()
    return {"message": "Location updated successfully", "location_id": loc.location_id}


@router.delete("/locations/{location_id}", tags=["(iii) Location Management"])
def delete_location(
    location_id: str,
    user: Dict[str, Any] = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    """Admin CRUD: Delete a restaurant location."""
    loc = db.query(Restaurant).filter(
        (Restaurant.location_id == location_id) | (Restaurant.restaurant_id == location_id)
    ).first()
    if not loc:
        raise HTTPException(status_code=404, detail=f"Location '{location_id}' not found")

    db.delete(loc)
    db.commit()
    return {"message": f"Location '{location_id}' deleted successfully"}


# =============================================================================
# (iv) MENU MANAGEMENT (Categories, Items, Prices, Costs, Descriptions, Availability)
# =============================================================================

@router.get("/menu/categories", tags=["(iv) Menu Management"])
def list_categories(db: Session = Depends(get_db)):
    """List all menu categories."""
    cats = db.query(MenuCategory).all()
    return [
        {
            "category_id": c.category_id,
            "name": c.name,
            "description": c.description,
            "target_margin_pct": c.target_margin_pct,
            "is_active": c.is_active
        }
        for c in cats
    ]


@router.post("/menu/categories", status_code=status.HTTP_201_CREATED, tags=["(iv) Menu Management"])
def create_category(
    req: MenuCategoryCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager", "manager"])),
    db: Session = Depends(get_db)
):
    """Create a new menu category."""
    cat_id = req.category_id or f"CAT-{uuid.uuid4().hex[:6].upper()}"
    new_cat = MenuCategory(
        category_id=cat_id,
        name=req.name,
        description=req.description,
        target_margin_pct=req.target_margin_pct,
        is_active=req.is_active
    )
    db.add(new_cat)
    db.commit()
    return {"message": "Menu category created successfully", "category_id": cat_id}


@router.get("/menu/items", tags=["(iv) Menu Management"])
def list_menu_items(
    category_id: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """List menu items with filtering by category and active availability."""
    query = db.query(MenuItem)
    if category_id:
        query = query.filter(MenuItem.category_id == category_id)
    if is_active is not None:
        query = query.filter(MenuItem.is_active == is_active)

    items = query.all()
    return [
        {
            "item_id": i.item_id,
            "category_id": i.category_id,
            "name": i.name,
            "description": i.description,
            "base_price": i.base_price,
            "cost_price": i.cost_price,
            "margin_pct": i.margin_pct or (round(((i.base_price - i.cost_price) / i.base_price) * 100, 2) if i.base_price > 0 else 0),
            "prep_time_minutes": i.prep_time_minutes,
            "shelf_life_days": i.shelf_life_days,
            "is_vegetarian": i.is_vegetarian,
            "is_gluten_free": i.is_gluten_free,
            "is_active": i.is_active
        }
        for i in items
    ]


@router.get("/menu/items/{item_id}", tags=["(iv) Menu Management"])
def get_menu_item(item_id: str, db: Session = Depends(get_db)):
    """Get single menu item details."""
    item = db.query(MenuItem).filter(MenuItem.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item '{item_id}' not found")
    return {
        "item_id": item.item_id,
        "category_id": item.category_id,
        "name": item.name,
        "description": item.description,
        "base_price": item.base_price,
        "cost_price": item.cost_price,
        "margin_pct": item.margin_pct,
        "is_active": item.is_active,
        "prep_time_minutes": item.prep_time_minutes
    }


@router.post("/menu/items", status_code=status.HTTP_201_CREATED, tags=["(iv) Menu Management"])
def create_menu_item(
    req: MenuItemCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager", "manager"])),
    db: Session = Depends(get_db)
):
    """Create a new menu item with price, cost, description, and availability."""
    item_id = req.item_id or f"ITEM-{uuid.uuid4().hex[:6].upper()}"
    margin = req.margin_pct or (round(((req.base_price - req.cost_price) / req.base_price) * 100, 2) if req.base_price > 0 else 0)

    new_item = MenuItem(
        item_id=item_id,
        category_id=req.category_id,
        name=req.name,
        description=req.description,
        base_price=req.base_price,
        cost_price=req.cost_price,
        margin_pct=margin,
        is_vegetarian=req.is_vegetarian,
        is_gluten_free=req.is_gluten_free,
        is_alcohol=req.is_alcohol,
        prep_time_minutes=req.prep_time_minutes,
        shelf_life_days=req.shelf_life_days,
        is_seasonal=req.is_seasonal,
        complexity_profile=req.complexity_profile,
        popularity_weight=req.popularity_weight,
        wastage_risk_score=req.wastage_risk_score,
        elasticity_score=req.elasticity_score,
        is_active=req.is_active
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return {"message": "Menu item created successfully", "item_id": item_id}


@router.put("/menu/items/{item_id}", tags=["(iv) Menu Management"])
def update_menu_item(
    item_id: str,
    req: MenuItemUpdate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager", "manager"])),
    db: Session = Depends(get_db)
):
    """Update menu item details, costs, and prices."""
    item = db.query(MenuItem).filter(MenuItem.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item '{item_id}' not found")

    data = req.model_dump(exclude_unset=True) if hasattr(req, "model_dump") else req.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(item, field, val)

    if item.base_price > 0:
        item.margin_pct = round(((item.base_price - item.cost_price) / item.base_price) * 100, 2)

    db.commit()
    return {"message": "Menu item updated successfully", "item_id": item.item_id}


@router.patch("/menu/items/{item_id}/availability", tags=["(iv) Menu Management"])
def toggle_item_availability(
    item_id: str,
    is_active: bool = Query(...),
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager", "manager"])),
    db: Session = Depends(get_db)
):
    """Toggle item availability on or off."""
    item = db.query(MenuItem).filter(MenuItem.item_id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Menu item '{item_id}' not found")
    item.is_active = is_active
    db.commit()
    return {"message": f"Availability for '{item_id}' set to {is_active}", "is_active": is_active}


# =============================================================================
# (v) PRICING HISTORY MANAGEMENT
# =============================================================================

@router.get("/pricing-history", tags=["(v) Pricing History Management"])
def list_pricing_history(
    item_id: Optional[str] = None,
    location_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List price change audit trails and history."""
    query = db.query(PricingHistory)
    if item_id:
        query = query.filter(PricingHistory.item_id == item_id)
    if location_id:
        query = query.filter(PricingHistory.location_id == location_id)
    records = query.all()
    return [
        {
            "price_history_id": r.price_history_id,
            "item_id": r.item_id,
            "location_id": r.location_id,
            "base_price": r.base_price,
            "cost_price": r.cost_price,
            "effective_start_date": str(r.effective_start_date),
            "effective_end_date": str(r.effective_end_date) if r.effective_end_date else None,
            "change_reason": r.change_reason
        }
        for r in records
    ]


@router.post("/pricing-history", status_code=status.HTTP_201_CREATED, tags=["(v) Pricing History Management"])
def record_pricing_history(
    req: PricingHistoryCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager", "manager"])),
    db: Session = Depends(get_db)
):
    """Record a price modification audit entry."""
    hist_id = req.price_history_id or f"PH-{uuid.uuid4().hex[:6].upper()}"
    start_d = date.fromisoformat(req.effective_start_date) if req.effective_start_date else date.today()
    end_d = date.fromisoformat(req.effective_end_date) if req.effective_end_date else None

    entry = PricingHistory(
        price_history_id=hist_id,
        item_id=req.item_id,
        location_id=req.location_id,
        base_price=req.base_price,
        cost_price=req.cost_price,
        effective_start_date=start_d,
        effective_end_date=end_d,
        change_reason=req.change_reason,
        complexity_profile=req.complexity_profile
    )
    db.add(entry)
    db.commit()
    return {"message": "Pricing history entry recorded", "price_history_id": hist_id}


# =============================================================================
# (vi) CUSTOMER DATA MANAGEMENT (Anonymized Profiles)
# =============================================================================

@router.get("/customers", tags=["(vi) Customer Data Management"])
def list_customers(
    segment: Optional[str] = None,
    loyalty_tier: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List customer profiles (anonymized for privacy compliance)."""
    query = db.query(Customer)
    if segment:
        query = query.filter(Customer.customer_segment == segment)
    if loyalty_tier:
        query = query.filter(Customer.loyalty_tier == loyalty_tier)

    customers = query.limit(limit).all()
    return [
        {
            "customer_id": c.customer_id,
            "anonymized_name": f"{c.first_name[:1]}*** {c.last_name[:1]}***",
            "customer_segment": c.customer_segment,
            "loyalty_tier": c.loyalty_tier,
            "loyalty_points": c.loyalty_points,
            "preferred_location_id": c.preferred_location_id,
            "churn_risk_score": c.churn_risk_score,
            "is_active": c.is_active
        }
        for c in customers
    ]


@router.get("/customers/{customer_id}", tags=["(vi) Customer Data Management"])
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    """Get single customer profile."""
    c = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Customer '{customer_id}' not found")
    return {
        "customer_id": c.customer_id,
        "first_name": c.first_name,
        "last_name": c.last_name,
        "customer_segment": c.customer_segment,
        "loyalty_tier": c.loyalty_tier,
        "loyalty_points": c.loyalty_points,
        "preferred_location_id": c.preferred_location_id,
        "churn_risk_score": c.churn_risk_score,
        "is_active": c.is_active
    }


@router.post("/customers", status_code=status.HTTP_201_CREATED, tags=["(vi) Customer Data Management"])
def create_customer(
    req: CustomerCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager", "analyst"])),
    db: Session = Depends(get_db)
):
    """Create a customer profile."""
    cust_id = req.customer_id or f"CUST-{uuid.uuid4().hex[:6].upper()}"
    new_c = Customer(
        customer_id=cust_id,
        first_name=req.first_name,
        last_name=req.last_name,
        email=req.email,
        phone_number=req.phone_number,
        customer_segment=req.customer_segment,
        loyalty_tier=req.loyalty_tier,
        loyalty_points=req.loyalty_points,
        signup_date=date.today(),
        preferred_location_id=req.preferred_location_id,
        is_active=req.is_active,
        churn_risk_score=req.churn_risk_score
    )
    db.add(new_c)
    db.commit()
    return {"message": "Customer profile created", "customer_id": cust_id}


@router.put("/customers/{customer_id}", tags=["(vi) Customer Data Management"])
def update_customer(
    customer_id: str,
    req: CustomerUpdate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    """Update customer profile attributes."""
    c = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not c:
        raise HTTPException(status_code=404, detail=f"Customer '{customer_id}' not found")
    data = req.model_dump(exclude_unset=True) if hasattr(req, "model_dump") else req.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(c, field, val)
    db.commit()
    return {"message": "Customer updated successfully", "customer_id": customer_id}


# =============================================================================
# (vii) ORDER MANAGEMENT (Headers + Order-Lines)
# =============================================================================

@router.get("/orders", tags=["(vii) Order Management"])
def list_orders(
    location_id: Optional[str] = None,
    order_status: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List orders with filtering."""
    query = db.query(Order)
    if location_id:
        query = query.filter(Order.location_id == location_id)
    if order_status:
        query = query.filter(Order.order_status == order_status)
    orders = query.order_by(Order.order_date.desc()).limit(limit).all()
    return [
        {
            "order_id": o.order_id,
            "customer_id": o.customer_id,
            "location_id": o.location_id,
            "order_date": str(o.order_date),
            "order_type": o.order_type,
            "order_status": o.order_status,
            "total_amount": o.total_amount,
            "subtotal_amount": o.subtotal_amount
        }
        for o in orders
    ]


@router.get("/orders/{order_id}", tags=["(vii) Order Management"])
def get_order_details(order_id: str, db: Session = Depends(get_db)):
    """Retrieve full order details including header and order-lines."""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found")
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()
    return {
        "order_id": order.order_id,
        "customer_id": order.customer_id,
        "location_id": order.location_id,
        "order_date": str(order.order_date),
        "order_time": order.order_time,
        "order_type": order.order_type,
        "order_status": order.order_status,
        "payment_method": order.payment_method,
        "subtotal_amount": order.subtotal_amount,
        "discount_amount": order.discount_amount,
        "total_amount": order.total_amount,
        "items": [
            {
                "order_item_id": itm.order_item_id,
                "item_id": itm.item_id,
                "quantity": itm.quantity,
                "unit_price": itm.unit_price,
                "subtotal": itm.subtotal,
                "item_discount": itm.item_discount,
                "item_total": itm.item_total
            }
            for itm in items
        ]
    }


@router.post("/orders", status_code=status.HTTP_201_CREATED, tags=["(vii) Order Management"])
def create_order(
    req: OrderCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager", "regional_manager"])),
    db: Session = Depends(get_db)
):
    """Create a new order header with associated order lines."""
    order_id = req.order_id or f"ORD-{uuid.uuid4().hex[:8].upper()}"
    o_date = date.fromisoformat(req.order_date) if req.order_date else date.today()
    o_time = req.order_time or datetime.now().strftime("%H:%M:%S")

    # Compute subtotal and item totals
    subtotal = 0.0
    discount = 0.0
    order_items_to_add = []

    for idx, itm in enumerate(req.items):
        item_subtotal = round(itm.quantity * itm.unit_price, 2)
        item_tot = round(item_subtotal - (itm.item_discount or 0.0), 2)
        subtotal += item_subtotal
        discount += (itm.item_discount or 0.0)

        order_items_to_add.append(
            OrderItem(
                order_item_id=f"{order_id}-L{idx+1}",
                order_id=order_id,
                item_id=itm.item_id,
                quantity=itm.quantity,
                unit_price=itm.unit_price,
                subtotal=item_subtotal,
                item_discount=itm.item_discount or 0.0,
                item_total=item_tot
            )
        )

    tax = round(subtotal * 0.08, 2)
    total_amount = round(subtotal - discount + tax + (req.tip_amount or 0.0), 2)

    order_header = Order(
        order_id=order_id,
        customer_id=req.customer_id,
        location_id=req.location_id,
        order_date=o_date,
        order_time=o_time,
        order_timestamp=f"{o_date} {o_time}",
        order_type=req.order_type,
        order_status=req.order_status,
        payment_method=req.payment_method,
        subtotal_amount=subtotal,
        discount_amount=discount,
        tax_amount=tax,
        tip_amount=req.tip_amount or 0.0,
        delivery_fee=0.0,
        total_amount=total_amount,
        promotion_id=req.promotion_id,
        table_number=req.table_number
    )

    db.add(order_header)
    for itm in order_items_to_add:
        db.add(itm)
    db.commit()

    return {"message": "Order created successfully", "order_id": order_id, "total_amount": total_amount}


@router.patch("/orders/{order_id}/status", tags=["(vii) Order Management"])
def update_order_status(
    order_id: str,
    status_val: str = Query(...),
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    """Update lifecycle status of an order (e.g. PENDING, PREPARING, COMPLETED, CANCELLED)."""
    order = db.query(Order).filter(Order.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found")
    order.order_status = status_val
    db.commit()
    return {"message": f"Order '{order_id}' status updated to {status_val}"}


# =============================================================================
# (viii) PROMOTION MANAGEMENT (Discounts, Coupons, Campaign Periods, Applicable Items)
# =============================================================================

@router.get("/promotions", tags=["(viii) Promotion Management"])
def list_promotions(db: Session = Depends(get_db)):
    """List all promotional campaigns."""
    promos = db.query(Promotion).all()
    return [
        {
            "promotion_id": p.promotion_id,
            "promotion_name": p.promotion_name,
            "discount_type": p.discount_type,
            "discount_value": p.discount_value,
            "min_order_amount": p.min_order_amount,
            "max_discount_amount": p.max_discount_amount,
            "applicable_category": p.applicable_category,
            "start_date": str(p.start_date) if p.start_date else None,
            "end_date": str(p.end_date) if p.end_date else None,
            "target_segment": p.target_segment,
            "is_misleading": p.is_misleading
        }
        for p in promos
    ]


@router.post("/promotions", status_code=status.HTTP_201_CREATED, tags=["(viii) Promotion Management"])
def create_promotion(
    req: PromotionCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager", "manager"])),
    db: Session = Depends(get_db)
):
    """Create a promotional campaign."""
    promo_id = req.promotion_id or f"PROMO-{uuid.uuid4().hex[:6].upper()}"
    start_d = date.fromisoformat(req.start_date) if req.start_date else date.today()
    end_d = date.fromisoformat(req.end_date) if req.end_date else None

    new_p = Promotion(
        promotion_id=promo_id,
        promotion_name=req.promotion_name,
        discount_type=req.discount_type,
        discount_value=req.discount_value,
        min_order_amount=req.min_order_amount,
        max_discount_amount=req.max_discount_amount,
        applicable_category=req.applicable_category,
        start_date=start_d,
        end_date=end_d,
        target_segment=req.target_segment,
        complexity_tag=req.complexity_tag,
        is_misleading=req.is_misleading,
        description=req.description
    )
    db.add(new_p)
    db.commit()
    return {"message": "Promotion created successfully", "promotion_id": promo_id}


@router.put("/promotions/{promotion_id}", tags=["(viii) Promotion Management"])
def update_promotion(
    promotion_id: str,
    req: PromotionUpdate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "regional_manager"])),
    db: Session = Depends(get_db)
):
    """Update promotional campaign parameters."""
    promo = db.query(Promotion).filter(Promotion.promotion_id == promotion_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail=f"Promotion '{promotion_id}' not found")

    data = req.model_dump(exclude_unset=True) if hasattr(req, "model_dump") else req.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            if field in ("start_date", "end_date") and isinstance(val, str):
                setattr(promo, field, date.fromisoformat(val))
            else:
                setattr(promo, field, val)

    db.commit()
    return {"message": "Promotion updated successfully", "promotion_id": promotion_id}


# =============================================================================
# (ix) RATING MANAGEMENT
# =============================================================================

@router.get("/ratings", tags=["(ix) Rating Management"])
def list_ratings(
    location_id: Optional[str] = None,
    min_rating: Optional[int] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List customer ratings and reviews."""
    query = db.query(Rating)
    if location_id:
        query = query.filter(Rating.location_id == location_id)
    if min_rating:
        query = query.filter(Rating.overall_rating >= min_rating)
    ratings = query.limit(limit).all()
    return [
        {
            "rating_id": r.rating_id,
            "order_id": r.order_id,
            "item_id": r.item_id,
            "location_id": r.location_id,
            "overall_rating": r.overall_rating,
            "food_rating": r.food_rating,
            "service_rating": r.service_rating,
            "ambiance_rating": r.ambiance_rating,
            "review_text": r.review_text,
            "review_date": str(r.review_date) if r.review_date else None
        }
        for r in ratings
    ]


@router.post("/ratings", status_code=status.HTTP_201_CREATED, tags=["(ix) Rating Management"])
def create_rating(req: RatingCreate, db: Session = Depends(get_db)):
    """Submit a dining review and star ratings."""
    rat_id = req.rating_id or f"RAT-{uuid.uuid4().hex[:6].upper()}"
    r_date = date.fromisoformat(req.review_date) if req.review_date else date.today()

    new_r = Rating(
        rating_id=rat_id,
        order_id=req.order_id,
        customer_id=req.customer_id,
        item_id=req.item_id,
        location_id=req.location_id,
        overall_rating=req.overall_rating,
        food_rating=req.food_rating,
        service_rating=req.service_rating,
        ambiance_rating=req.ambiance_rating,
        review_text=req.review_text,
        review_date=r_date
    )
    db.add(new_r)
    db.commit()
    return {"message": "Rating submitted successfully", "rating_id": rat_id}


# =============================================================================
# (x) INVENTORY MANAGEMENT
# =============================================================================

@router.get("/inventory", tags=["(x) Inventory Management"])
def list_inventory(
    location_id: Optional[str] = None,
    stock_status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Retrieve inventory stock levels and reorder alerts."""
    query = db.query(Inventory)
    if location_id:
        query = query.filter(Inventory.location_id == location_id)
    if stock_status:
        query = query.filter(Inventory.stock_status == stock_status)
    items = query.all()
    return [
        {
            "inventory_id": i.inventory_id,
            "location_id": i.location_id,
            "item_id": i.item_id,
            "starting_stock": i.starting_stock,
            "quantity_received": i.quantity_received,
            "quantity_sold": i.quantity_sold,
            "quantity_wasted": i.quantity_wasted,
            "ending_stock": i.ending_stock,
            "reorder_point": i.reorder_point,
            "stock_status": i.stock_status
        }
        for i in items
    ]


@router.post("/inventory", status_code=status.HTTP_201_CREATED, tags=["(x) Inventory Management"])
def create_inventory_snapshot(
    req: InventoryCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    """Record an inventory snapshot."""
    inv_id = req.inventory_id or f"INV-{uuid.uuid4().hex[:6].upper()}"
    s_date = date.fromisoformat(req.snapshot_date) if req.snapshot_date else date.today()

    new_inv = Inventory(
        inventory_id=inv_id,
        location_id=req.location_id,
        item_id=req.item_id,
        snapshot_date=s_date,
        starting_stock=req.starting_stock,
        quantity_received=req.quantity_received or 0,
        quantity_sold=req.quantity_sold or 0,
        quantity_wasted=req.quantity_wasted or 0,
        ending_stock=req.ending_stock,
        reorder_point=req.reorder_point or 10,
        stock_status=req.stock_status or ("Low Stock" if req.ending_stock <= (req.reorder_point or 10) else "Adequate")
    )
    db.add(new_inv)
    db.commit()
    return {"message": "Inventory snapshot recorded", "inventory_id": inv_id}


@router.put("/inventory/{inventory_id}", tags=["(x) Inventory Management"])
def update_inventory_stock(
    inventory_id: str,
    req: InventoryUpdate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager"])),
    db: Session = Depends(get_db)
):
    """Update inventory stock values."""
    inv = db.query(Inventory).filter(Inventory.inventory_id == inventory_id).first()
    if not inv:
        raise HTTPException(status_code=404, detail=f"Inventory record '{inventory_id}' not found")

    data = req.model_dump(exclude_unset=True) if hasattr(req, "model_dump") else req.dict(exclude_unset=True)
    for field, val in data.items():
        if val is not None:
            setattr(inv, field, val)

    db.commit()
    return {"message": "Inventory updated successfully", "inventory_id": inventory_id}


# =============================================================================
# (xi) WASTAGE MANAGEMENT
# =============================================================================

@router.get("/wastage", tags=["(xi) Wastage Management"])
def list_wastage_records(
    location_id: Optional[str] = None,
    item_id: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List food wastage records."""
    query = db.query(Wastage)
    if location_id:
        query = query.filter(Wastage.location_id == location_id)
    if item_id:
        query = query.filter(Wastage.item_id == item_id)
    records = query.order_by(Wastage.wastage_date.desc()).limit(limit).all()
    return [
        {
            "wastage_id": w.wastage_id,
            "item_id": w.item_id,
            "location_id": w.location_id,
            "wastage_date": str(w.wastage_date),
            "quantity_wasted": w.quantity_wasted,
            "unit_cost": w.unit_cost,
            "total_loss_amount": w.total_loss_amount,
            "wastage_reason": w.wastage_reason,
            "reported_by": w.reported_by
        }
        for w in records
    ]


@router.post("/wastage", status_code=status.HTTP_201_CREATED, tags=["(xi) Wastage Management"])
def log_wastage(
    req: WastageCreate,
    user: Dict[str, Any] = Depends(require_roles(["admin", "manager", "regional_manager"])),
    db: Session = Depends(get_db)
):
    """Log dish and ingredient wastage."""
    wast_id = req.wastage_id or f"WST-{uuid.uuid4().hex[:6].upper()}"
    w_date = date.fromisoformat(req.wastage_date) if req.wastage_date else date.today()
    loss = req.total_loss_amount or round(req.quantity_wasted * req.unit_cost, 2)

    new_w = Wastage(
        wastage_id=wast_id,
        item_id=req.item_id,
        location_id=req.location_id,
        wastage_date=w_date,
        wastage_time=req.wastage_time or datetime.now().strftime("%H:%M:%S"),
        quantity_wasted=req.quantity_wasted,
        unit_cost=req.unit_cost,
        total_loss_amount=loss,
        wastage_reason=req.wastage_reason or "Expired",
        reported_by=req.reported_by or user.get("username", "Staff")
    )
    db.add(new_w)
    db.commit()
    return {"message": "Wastage record logged successfully", "wastage_id": wast_id, "total_loss": loss}


@router.delete("/wastage/{wastage_id}", tags=["(xi) Wastage Management"])
def delete_wastage(
    wastage_id: str,
    user: Dict[str, Any] = Depends(require_roles(["admin"])),
    db: Session = Depends(get_db)
):
    """Admin CRUD: Remove a wastage record."""
    w = db.query(Wastage).filter(Wastage.wastage_id == wastage_id).first()
    if not w:
        raise HTTPException(status_code=404, detail=f"Wastage record '{wastage_id}' not found")
    db.delete(w)
    db.commit()
    return {"message": f"Wastage record '{wastage_id}' deleted successfully"}
