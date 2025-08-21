from fastapi import APIRouter

from .endpoints import (
    auth,
    users,
    documents,
    resources,
    recommendations,
    analytics
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
