from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Text, Float, Boolean, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.session import Base

class ActivityType(str, enum.Enum):
    PAGE_VIEW = "page_view"
    RESOURCE_VIEW = "resource_view"
    DOCUMENT_UPLOAD = "document_upload"
    DOCUMENT_VERIFIED = "document_verified"
    LOGIN = "login"
    LOGOUT = "logout"
    SEARCH = "search"
    DOWNLOAD = "download"
    SHARE = "share"

class UserActivity(Base):
    __tablename__ = "user_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_type = Column(Enum(ActivityType), nullable=False)
    entity_type = Column(String, nullable=True)  # e.g., 'page', 'document', 'resource'
    entity_id = Column(Integer, nullable=True)   # ID of the entity being interacted with
    
    # Additional metadata
    ip_address = Column(String(45), nullable=True)  # IPv6 can be up to 45 chars
    user_agent = Column(Text, nullable=True)
    referrer = Column(Text, nullable=True)
    metadata = Column(JSON, nullable=True)  # Additional JSON data
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="user_activities")

class UserSession(Base):
    __tablename__ = "user_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String(255), unique=True, nullable=False)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    device_info = Column(JSON, nullable=True)
    
    # Session timestamps
    login_at = Column(DateTime(timezone=True), server_default=func.now())
    last_activity = Column(DateTime(timezone=True), onupdate=func.now())
    logout_at = Column(DateTime(timezone=True), nullable=True)
    
    # Session status
    is_active = Column(Boolean, default=True)
    
    # Relationships
    user = relationship("User")

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(100), nullable=False)
    event_data = Column(JSON, nullable=True)
    
    # User context (if available)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    anonymous_id = Column(String(100), nullable=True, index=True)
    
    # Technical context
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    url = Column(Text, nullable=True)
    referrer = Column(Text, nullable=True)
    
    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
