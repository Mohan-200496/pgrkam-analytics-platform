from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app import models

router = APIRouter()


@router.get("/", response_model=List[dict])
def list_resources(db: Session = Depends(deps.get_db)):
    # Placeholder - return empty list to unblock frontend
    return []

