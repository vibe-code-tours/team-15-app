from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID


class ReportCreate(BaseModel):
    target_type: str  # listing or user
    target_listing_id: UUID | None = None
    target_user_id: UUID | None = None
    reason: str
    details: str | None = None


class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    reporter_id: UUID
    target_type: str
    target_listing_id: UUID | None
    target_user_id: UUID | None
    reason: str
    details: str | None
    status: str
    created_at: datetime
