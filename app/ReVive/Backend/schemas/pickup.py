from pydantic import BaseModel, Field, ConfigDict


class PickupCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category: str = Field(min_length=1, max_length=100)
    device_name: str = Field(min_length=1, max_length=200, alias="deviceName")
    quantity: int = Field(default=1, ge=1, le=100)
    condition: str = "working"
    available_from: str = Field(alias="availableFrom")
    available_to: str = Field(alias="availableTo")
    time_slot: str = Field(alias="timeSlot")
    address: str = Field(min_length=1, max_length=500)
    notes: str | None = None
    images: list[str] | None = None


class PickupUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    category: str | None = None
    device_name: str | None = Field(None, alias="deviceName")
    quantity: int | None = None
    condition: str | None = None
    available_from: str | None = Field(None, alias="availableFrom")
    available_to: str | None = Field(None, alias="availableTo")
    time_slot: str | None = Field(None, alias="timeSlot")
    address: str | None = None
    notes: str | None = None
    status: str | None = None


class PickupResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: str = Field(alias="userId")
    category: str
    device_name: str = Field(alias="deviceName")
    quantity: int
    condition: str
    available_from: str = Field(alias="availableFrom")
    available_to: str = Field(alias="availableTo")
    time_slot: str = Field(alias="timeSlot")
    address: str
    notes: str | None
    status: str
    created_at: str = Field(alias="createdAt")


class PickupAction(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    action: str  # complete, cancel, request, accept, reject
    pickup_from: str | None = Field(None, alias="pickupFrom")
    pickup_to: str | None = Field(None, alias="pickupTo")
    time_slot: str | None = Field(None, alias="timeSlot")
    request_id: int | None = Field(None, alias="requestId")
