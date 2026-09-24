"""
DineIQ Analytics - Executive Dashboard Router (SRS Step 42)
Provides API endpoints for:
- total revenue
- total profit
- total orders
- average order value
- active customers
- repeat customers
- wastage
- forecast demand
- critical recommendations
- anomalies
"""

from fastapi import APIRouter
from backend.services.dashboard_service import DashboardService

router = APIRouter(prefix="/api/v1/dashboard/executive", tags=["Executive Dashboard"])


@router.get("")
def get_executive_dashboard():
    """
    Returns complete Executive Dashboard payload implementing SRS Step 42.
    """
    service = DashboardService()
    return service.get_executive_dashboard_data()
