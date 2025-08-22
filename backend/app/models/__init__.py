from app.db.session import Base  # re-export Base for Alembic/metadata access

# User and related models
from .user import User, EducationalDetail, UserRole, EmploymentStatus  # noqa: F401

# Documents
from .document import Document, DocumentStatus, DocumentType  # noqa: F401

# Analytics
from .analytics import UserActivity, AnalyticsEvent  # noqa: F401

# Recommendations / Resources
from .recommendation import (
    Resource,
    UserRecommendation,
    Tag,
    ResourceTagAssociation,
    ResourceType,
)  # noqa: F401

__all__ = [
    "Base",
    "User",
    "EducationalDetail",
    "UserRole",
    "EmploymentStatus",
    "Document",
    "DocumentStatus",
    "DocumentType",
    "UserActivity",
    "AnalyticsEvent",
    "Resource",
    "UserRecommendation",
    "Tag",
    "ResourceTagAssociation",
    "ResourceType",
]


