from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.session import Base

class DocumentType(str, enum.Enum):
    ID_PROOF = "id_proof"
    ADDRESS_PROOF = "address_proof"
    EDUCATIONAL_CERTIFICATE = "educational_certificate"
    MARKSHEET = "marksheet"
    OTHER = "other"

class DocumentStatus(str, enum.Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    file_path = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_size = Column(Integer)  # Size in bytes
    mime_type = Column(String)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PENDING, nullable=False)
    rejection_reason = Column(Text, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", foreign_keys=[user_id], back_populates="documents")
    verifier = relationship("User", foreign_keys=[verified_by])
    
    def get_absolute_url(self, request):
        return f"{request.base_url}static/{self.file_path}"
