from typing import List
import os
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User

from app.api import deps
from app.core.config import settings
from app import models
from app.models.document import Document, DocumentStatus, DocumentType
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("/upload", response_model=dict)
async def upload_document(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    file: UploadFile = File(...),
):
    if file.content_type not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_location = os.path.join(settings.UPLOAD_DIR, file.filename)
    content = await file.read()
    with open(file_location, "wb") as f:
        f.write(content)

    # Persist metadata
    doc = Document(
        user_id=current_user.id,
        document_type=DocumentType.OTHER,
        file_path=os.path.basename(file_location),
        file_name=file.filename,
        file_size=len(content),
        mime_type=file.content_type,
        status=DocumentStatus.PENDING,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "filename": doc.file_name, "status": doc.status}


@router.get("/me", response_model=List[dict])
def list_my_documents(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    return [
        {
            "id": d.id,
            "file_name": d.file_name,
            "status": d.status,
            "uploaded_at": d.created_at,
            "mime_type": d.mime_type,
        }
        for d in docs
    ]


@router.get("/admin", response_model=List[dict])
def list_documents_admin(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
    status_filter: str | None = None,
):
    q = db.query(Document, User).join(User, Document.user_id == User.id)
    if status_filter:
        try:
            status_enum = DocumentStatus(status_filter)
            q = q.filter(Document.status == status_enum)
        except Exception:
            pass
    rows = q.order_by(Document.created_at.desc()).limit(200).all()
    return [
        {
            "id": doc.id,
            "userId": user.id,
            "userName": user.full_name,
            "userEmail": user.email,
            "type": doc.document_type,
            "status": doc.status,
            "uploadedAt": doc.created_at,
            "fileUrl": f"/static/{doc.file_path}",
            "fileType": (doc.mime_type or "").split("/")[1] if doc.mime_type else "pdf",
            "fileSize": str(doc.file_size or 0),
            "reviewedBy": doc.verified_by,
            "rejectionReason": doc.rejection_reason,
        }
        for (doc, user) in rows
    ]


@router.post("/{doc_id}/verify", response_model=dict)
def verify_document(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
    doc_id: int,
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.status = DocumentStatus.VERIFIED
    doc.verified_by = current_user.id
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "status": doc.status}


@router.post("/{doc_id}/reject", response_model=dict)
def reject_document(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
    doc_id: int,
    reason: str = "",
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.status = DocumentStatus.REJECTED
    doc.rejection_reason = reason
    doc.verified_by = current_user.id
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return {"id": doc.id, "status": doc.status, "rejection_reason": doc.rejection_reason}

