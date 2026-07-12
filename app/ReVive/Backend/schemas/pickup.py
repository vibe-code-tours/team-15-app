from pydantic import BaseModel, Field
from datetime import datetime


class PickupCreate(BaseModel):
    category: str = Field(min_length=1, max_length=100)
    device_name: str = Field(min_length=1, max_length=200)
    quantity: int = Field(default=1, ge=1, le=100)
    condition: str = "working"
    pickup_date: str
    time_slot: str
    address: str = Field(min_length=1, max_length=500)
    notes: str | None = None


class PickupUpdate(BaseModel):
    category: str | None = None
    device_name: str | None = None
    quantity: int | None = None
    condition: str | None = None
    pickup_date: str | None = None
    time_slot: str | None = None
    address: str | None = None
    notes: str | None = None
    status: str | None = None


class PickupResponse(BaseModel):
    id: int
    user_id: str
    category: str
    device_name: str
    quantity: int
    condition: str
    pickup_date: str
    time_slot: str
    address: str
    notes: str | None
    status: str
    created_at: str


class PickupAction(BaseModel):
    action: str  # complete, cancel
