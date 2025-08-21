from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app import models
from app.models.user import EducationalDetail
from app.models.recommendation import Resource, UserRecommendation

router = APIRouter()


@router.get("/me", response_model=List[dict])
def get_my_recommendations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    # Simple content-based filter using education fields and resource metadata
    edu = db.query(EducationalDetail).filter(EducationalDetail.user_id == current_user.id).first()
    q = db.query(Resource).filter(Resource.is_active == True)
    resources = q.limit(50).all()

    def score(res: Resource) -> float:
        s = 0.0
        if edu:
            if edu.specialization and edu.specialization.lower() in (res.description or '').lower():
                s += 0.4
            if edu.degree_name and edu.degree_name.lower() in (res.title or '').lower():
                s += 0.3
            if edu.areas_of_interest:
                for tag in [t.strip().lower() for t in edu.areas_of_interest.split(',') if t.strip()]:
                    if tag in (res.description or '').lower() or tag in (res.title or '').lower():
                        s += 0.1
        return s

    ranked = sorted(resources, key=score, reverse=True)[:10]
    return [
        {
            "id": r.id,
            "title": r.title,
            "description": r.description,
            "url": r.url,
            "score": score(r),
            "resource_type": r.resource_type,
            "source": r.source,
        }
        for r in ranked
    ]

