from pydantic import BaseModel

# Re-export user schemas
from .user import (
    User,
    UserCreate,
    UserUpdate,
    UserInDB,
    UserWithStats,
    UserRole,
)

# Re-export token schemas
from .token import Token, TokenData, TokenPayload

# Re-export education schemas
from .education import (
    EducationalDetail,
    EducationalDetailCreate,
    EducationalDetailUpdate,
)


class Msg(BaseModel):
    msg: str

__all__ = [
    "User",
    "UserCreate",
    "UserUpdate",
    "UserInDB",
    "UserWithStats",
    "UserRole",
    "Token",
    "TokenData",
    "TokenPayload",
    "EducationalDetail",
    "EducationalDetailCreate",
    "EducationalDetailUpdate",
    "Msg",
]


