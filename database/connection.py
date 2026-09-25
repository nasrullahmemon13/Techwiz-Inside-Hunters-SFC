"""
DineIQ Analytics - Relational Database Session & Connection Manager
Provides SQLAlchemy engine, session maker, and get_db dependency for FastAPI routes.
"""
import os
import hashlib
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
load_dotenv(os.path.join(PROJECT_ROOT, ".env"))

def get_engine():
    """Create SQLAlchemy engine using DATABASE_URL if available, else local SQLite."""
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        db_path = os.path.join(CURRENT_DIR, "dineiq.db")
        db_url = f"sqlite:///{db_path}"
    
    # SQLite requires check_same_thread=False for multithreaded FastAPI requests
    connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}
    return create_engine(db_url, connect_args=connect_args, echo=False)

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database session with automatic commit/rollback."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    """Standard SHA-256 password hasher with static salt for security."""
    salt = "dineiq_enterprise_salt_2026"
    return hashlib.sha256(f"{salt}{password}".encode("utf-8")).hexdigest()

def seed_default_auth():
    """Ensures roles and sample users exist for all 4 SRS roles."""
    from database.models import Base, Role, User
    Base.metadata.create_all(engine)

    with SessionLocal() as db:
        roles_data = [
            ("admin", "Administrator", "Full system access and location/user CRUD operations"),
            ("regional_manager", "Regional Manager", "Multi-location operations and regional approval access"),
            ("manager", "Store Manager", "Local restaurant location and shift management"),
            ("analyst", "Data Analyst", "Analytical reporting, what-if simulations, data exports")
        ]
        for role_id, role_name, desc in roles_data:
            existing_role = db.query(Role).filter(Role.role_id == role_id).first()
            if not existing_role:
                db.add(Role(role_id=role_id, role_name=role_name, description=desc))
        db.commit()

        # Seed default users if table is empty
        if db.query(User).count() == 0:
            seed_users = [
                ("admin_user", "admin@dineiq.com", "admin123", "Chief Administrator", "admin", "LOC-001"),
                ("regional_mgr", "regional@dineiq.com", "regional123", "Northeast Regional Lead", "regional_manager", "LOC-001"),
                ("store_mgr", "manager@dineiq.com", "manager123", "Downtown Store Manager", "manager", "LOC-001"),
                ("data_analyst", "analyst@dineiq.com", "analyst123", "Senior Big Data Analyst", "analyst", None)
            ]
            for username, email, pwd, full_name, role_id, loc_id in seed_users:
                db.add(User(
                    user_id=f"USER-{username.upper()}",
                    username=username,
                    email=email,
                    hashed_password=hash_password(pwd),
                    full_name=full_name,
                    role_id=role_id,
                    assigned_location_id=loc_id,
                    is_active=True
                ))
            db.commit()

seed_default_auth()
