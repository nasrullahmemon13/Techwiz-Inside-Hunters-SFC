"""
DineIQ Analytics - Enterprise FastAPI Backend
Serving REST APIs for DineIQ Executive & Analytical Dashboards (SRS Steps 42-47).
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routers.executive import router as executive_router
from backend.routers.menu_intelligence import router as menu_intelligence_router
from backend.routers.customer_intelligence import router as customer_intelligence_router
from backend.routers.wastage import router as wastage_router
from backend.routers.search_filter import router as search_filter_router
from backend.routers.reports import router as reports_router
from backend.routers.exports import router as exports_router

app = FastAPI(
    title="DineIQ Analytics Platform API",
    description="Backend API powering the DineIQ Analytics Dashboard Suite (SRS Steps 42-50)",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite default port 5173, 3000, 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(executive_router)
app.include_router(menu_intelligence_router)
app.include_router(customer_intelligence_router)
app.include_router(wastage_router)
app.include_router(search_filter_router)
app.include_router(reports_router)
app.include_router(exports_router)


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "DineIQ Analytics API",
        "active_dashboards": [
            "Executive Dashboard (Step 42)",
            "Menu Intelligence Dashboard (Step 43)",
            "Customer Intelligence Dashboard (Step 44)",
            "Wastage Dashboard (Step 45)"
        ]
    }


# Mount frontend static distribution if built
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
