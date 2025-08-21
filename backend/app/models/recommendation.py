from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.db.session import Base

class ResourceType(str, enum.Enum):
    JOB = "job"
    COURSE = "course"
    SCHOLARSHIP = "scholarship"
    WORKSHOP = "workshop"
    GOVERNMENT_SCHEME = "government_scheme"
    OTHER = "other"

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    resource_type = Column(Enum(ResourceType), nullable=False)
    
    # Metadata
    source = Column(String(100), nullable=True)  # Which government department/portal this is from
    url = Column(String(500), nullable=False)
    image_url = Column(String(500), nullable=True)
    
    # Eligibility criteria (for filtering)
    min_education_level = Column(String(100), nullable=True)
    required_skills = Column(JSON, nullable=True)  # List of skills/competencies
    eligibility_criteria = Column(Text, nullable=True)
    
    # Additional metadata
    start_date = Column(DateTime(timezone=True), nullable=True)
    end_date = Column(DateTime(timezone=True), nullable=True)
    location = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    recommendations = relationship("UserRecommendation", back_populates="resource")
    tags = relationship("ResourceTagAssociation", back_populates="resource")

class UserRecommendation(Base):
    __tablename__ = "user_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=False)
    
    # Recommendation metadata
    score = Column(Float, nullable=False)  # How relevant is this recommendation (0-1)
    model_version = Column(String(50), nullable=True)  # Which model version generated this
    
    # User interaction tracking
    is_viewed = Column(Boolean, default=False)
    is_applied = Column(Boolean, default=False)
    is_saved = Column(Boolean, default=False)
    feedback_score = Column(Integer, nullable=True)  # 1-5 rating from user
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="recommendations")
    resource = relationship("Resource", back_populates="recommendations")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)  # e.g., 'skill', 'industry', 'location'
    
    # Relationships
    resources = relationship("ResourceTagAssociation", back_populates="tag")

class ResourceTagAssociation(Base):
    __tablename__ = "resource_tags"
    
    resource_id = Column(Integer, ForeignKey("resources.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id"), primary_key=True)
    
    # Additional metadata about the relationship
    relevance_score = Column(Float, nullable=True)
    
    # Relationships
    resource = relationship("Resource", back_populates="tags")
    tag = relationship("Tag", back_populates="resources")
