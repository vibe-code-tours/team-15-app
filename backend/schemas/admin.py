from pydantic import BaseModel


class AdminPickupRecent(BaseModel):
    id: int
    device_name: str
    category: str
    status: str
    created_at: str
    user_name: str | None


class AdminStatsResponse(BaseModel):
    total_pickups: int
    completed_pickups: int
    active_users: int
    total_items: int
    total_co2_saved: str
    recent_pickups: list[AdminPickupRecent]


class AdminPickupResponse(BaseModel):
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
    user_name: str | None
    user_email: str | None


class AdminUserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: str
    pickup_count: int
    total_points: int


class BreakdownItem(BaseModel):
    label: str
    count: int
