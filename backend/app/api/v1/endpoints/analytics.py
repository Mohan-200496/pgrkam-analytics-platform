from typing import Any, Dict
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.api import deps
from app import models
from sqlalchemy import func
from app.models.user import EmploymentStatus, User

router = APIRouter()


@router.post("/track", response_model=dict)
async def track_event(
    request: Request,
    current_user: models.User = Depends(deps.get_current_user),
) -> Dict[str, Any]:
    payload = await request.json()
    # TODO: persist to analytics_events
    return {"ok": True, "received": payload}


@router.get("/summary", response_model=dict)
def analytics_summary(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Dict[str, Any]:
    # Basic summary aggregations
    db = deps.get_db()
    session = next(db)
    try:
        total_users = session.query(func.count(User.id)).scalar() or 0
        employed = session.query(func.count(User.id)).filter(User.employment_status == EmploymentStatus.EMPLOYED).scalar() or 0
        unemployed = session.query(func.count(User.id)).filter(User.employment_status == EmploymentStatus.UNEMPLOYED).scalar() or 0
    finally:
        session.close()

    return {
        "total_users": total_users,
        "employed": employed,
        "unemployed": unemployed,
    }

