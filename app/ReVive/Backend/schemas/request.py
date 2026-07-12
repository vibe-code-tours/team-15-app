from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID


class RequestCreate(BaseModel):
    listing_id: UUID
    note: str | None = None


class RequestUpdate(BaseModel):
    status: str  # accepted, declined, withdrawn
    note: str | None = None


class RequestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    listing_id: UUID
    requester_id: UUID
    note: str | None
    status: str
    created_at: datetime
    responded_at: datetime | None
    confirmed_at: datetime | None
