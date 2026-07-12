from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID


class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    type: str
    channel: str
    payload: dict | None
    sent_at: datetime | None
    read_at: datetime | None
    created_at: datetime
