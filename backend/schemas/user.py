from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    profile_picture_url: str | None = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    auth_provider: str
    status: str
    items_donated_count: int
    items_received_count: int
    created_at: datetime


class UserUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    profile_picture_url: str | None = None
    notification_prefs: dict | None = None
