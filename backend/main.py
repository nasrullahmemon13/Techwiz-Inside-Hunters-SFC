"""
DineIQ Analytics - Enterprise FastAPI Backend
Serving REST APIs for DineIQ Executive & Analytical Dashboards (SRS Steps 42-47).
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routers.executive import router as executive_router

app = FastAPI(
    title="DineIQ Analytics Platform API",
    description="Backend API powering the DineIQ Analytics Dashboard Suite (SRS Steps 42-47)",
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


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "DineIQ Analytics API",
        "active_dashboards": ["Executive Dashboard (Step 42)"]
    }


# Mount frontend static distribution if built
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
