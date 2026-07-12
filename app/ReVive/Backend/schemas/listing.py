from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from uuid import UUID


class ListingCreate(BaseModel):
    category_id: UUID
    region_id: UUID
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    brand: str | None = None
    model: str | None = None
    condition: str  # ItemCondition enum value
    pickup_preference: str = "flexible"


class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    brand: str | None = None
    model: str | None = None
    condition: str | None = None
    pickup_preference: str | None = None
    status: str | None = None


class ListingPhotoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    url: str
    sort_order: int


class ListingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    owner_id: UUID
    category_id: UUID
    region_id: UUID
    title: str
    description: str | None
    brand: str | None
    model: str | None
    condition: str
    pickup_preference: str
    status: str
    created_at: datetime
    updated_at: datetime
    photos: list[ListingPhotoResponse] = []


class ListingListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    condition: str
    status: str
    brand: str | None
    created_at: datetime
