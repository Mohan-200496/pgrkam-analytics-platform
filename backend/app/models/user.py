from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Enum, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.session import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    VERIFIER = "verifier"

class EmploymentStatus(str, enum.Enum):
    EMPLOYED = "employed"
    UNEMPLOYED = "unemployed"
    SEEKING = "seeking"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, index=True)
    phone_number = Column(String, unique=True, index=True)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    employment_status = Column(Enum(EmploymentStatus), nullable=True)
    is_active = Column(Boolean(), default=True)
    is_verified = Column(Boolean(), default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    documents = relationship("Document", back_populates="owner")
    educational_details = relationship("EducationalDetail", back_populates="user", uselist=False)
    user_activities = relationship("UserActivity", back_populates="user")
    recommendations = relationship("UserRecommendation", back_populates="user")

class EducationalDetail(Base):
    __tablename__ = "educational_details"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Pre-University (10+2) Details
    pu_marks = Column(Float, nullable=True)  # Percentage
    pu_stream = Column(String, nullable=True)  # Science, Commerce, Arts, etc.
    pu_year = Column(Integer, nullable=True)
    
    # Degree Details
    degree_name = Column(String, nullable=True)
    degree_marks = Column(Float, nullable=True)  # CGPA/Percentage
    degree_year = Column(Integer, nullable=True)
    specialization = Column(String, nullable=True)
    university = Column(String, nullable=True)
    
    # Additional Qualifications
    additional_qualifications = Column(Text, nullable=True)
    
    # Areas of Interest (comma-separated values)
    areas_of_interest = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="educational_details")
