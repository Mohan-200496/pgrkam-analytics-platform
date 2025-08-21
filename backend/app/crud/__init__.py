# This file makes the crud directory a Python package
from .base import CRUDBase
from .user import user

__all__ = ["CRUDBase", "user"]
