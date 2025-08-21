from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api import deps
from app import schemas, models, crud
from app.models.user import EducationalDetail
from app.schemas.education import EducationalDetailCreate, EducationalDetailUpdate, EducationalDetail as EducationalDetailSchema

router = APIRouter()


@router.get("/me", response_model=schemas.User)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    user_in: schemas.UserUpdate,
) -> Any:
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me/education", response_model=EducationalDetailSchema)
def get_my_education(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    edu = db.query(EducationalDetail).filter(EducationalDetail.user_id == current_user.id).first()
    if not edu:
        # Return empty payload with default values
        return EducationalDetailSchema.from_orm(EducationalDetail(id=0, user_id=current_user.id))
    return edu


@router.put("/me/education", response_model=EducationalDetailSchema)
def upsert_my_education(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    body: EducationalDetailUpdate,
) -> Any:
    edu = db.query(EducationalDetail).filter(EducationalDetail.user_id == current_user.id).first()
    if not edu:
        edu = EducationalDetail(user_id=current_user.id)
        db.add(edu)
        db.flush()
    for field, value in body.dict(exclude_unset=True).items():
        setattr(edu, field, value)
    db.add(edu)
    db.commit()
    db.refresh(edu)
    return edu

