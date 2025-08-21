from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.models.recommendation import Resource, ResourceType
from app.core.config import settings
from app.db import base_class as base   # noqa: F401

def init_db(db: Session) -> None:
    # Create tables
    models.Base.metadata.create_all(bind=db.get_bind())
    
    # Create first superuser
    user = crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER_EMAIL)
    if not user:
        user_in = schemas.UserCreate(
            email=settings.FIRST_SUPERUSER_EMAIL,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            full_name="Admin",
            phone_number="1234567890",
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841
        # Update role to admin
        db_user = crud.user.get(db, id=user.id)
        db_user.role = "admin"
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    # Seed a few resources if none
    if not db.query(Resource).first():
        samples = [
            Resource(title="Punjab Govt Scholarship - STEM", description="Scholarship for STEM students", resource_type=ResourceType.SCHOLARSHIP, source="Education Dept", url="https://example.com/scholarship"),
            Resource(title="React Developer Internship", description="Internship for CS students with React/JS", resource_type=ResourceType.JOB, source="IT Dept", url="https://example.com/job"),
            Resource(title="Digital Marketing Workshop", description="Workshop for marketing specialization", resource_type=ResourceType.WORKSHOP, source="Skill Dev", url="https://example.com/workshop"),
        ]
        for r in samples:
            db.add(r)
        db.commit()
