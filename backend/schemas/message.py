from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID


class MessageCreate(BaseModel):
    body: str


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    request_id: UUID
    sender_id: UUID
    body: str
    sent_at: datetime
    read_at: datetime | None
