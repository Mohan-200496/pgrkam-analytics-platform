from pydantic import BaseModel, Field
from typing import Optional


class EducationalDetailBase(BaseModel):
    pu_marks: Optional[float] = Field(None, ge=0, le=100)
    pu_stream: Optional[str] = None
    pu_year: Optional[int] = None

    degree_name: Optional[str] = None
    degree_marks: Optional[float] = Field(None, ge=0, le=100)
    degree_year: Optional[int] = None
    specialization: Optional[str] = None
    university: Optional[str] = None

    additional_qualifications: Optional[str] = None
    areas_of_interest: Optional[str] = None


class EducationalDetailCreate(EducationalDetailBase):
    pass


class EducationalDetailUpdate(EducationalDetailBase):
    pass


class EducationalDetail(EducationalDetailBase):
    id: int

    class Config:
        orm_mode = True


