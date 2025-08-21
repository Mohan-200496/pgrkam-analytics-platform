import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Generator

from app.core.config import settings
from app.db.session import SessionLocal, engine
from app.db.init_db import init_db
from app.api.v1.api import api_router

# Create database tables
from app import models  # noqa: F401
models.Base.metadata.create_all(bind=engine)

# Initialize the database with default data
init_db(SessionLocal())

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    PGRKAM Analytics Platform API - Backend service for managing user data, 
    documents, and providing personalized recommendations.
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount(
    "/static", 
    StaticFiles(directory=settings.UPLOAD_DIR), 
    name="static"
)

# Database dependency
def get_db() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
