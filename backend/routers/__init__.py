"""
DineIQ Analytics - Backend Routers
"""
from backend.routers.executive import router as executive_router
from backend.routers.search_filter import router as search_filter_router
from backend.routers.reports import router as reports_router
from backend.routers.exports import router as exports_router

__all__ = [
    "executive_router",
    "search_filter_router",
    "reports_router",
    "exports_router"
]
