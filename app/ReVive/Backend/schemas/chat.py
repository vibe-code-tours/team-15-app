from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    receiver_id: uuid.UUID

class ChatMessageResponse(ChatMessageBase):
    id: uuid.UUID
    sender_id: uuid.UUID
    receiver_id: uuid.UUID
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class WebSocketMessage(BaseModel):
    type: str  # "message", "typing", "read_receipt"
    content: Optional[str] = None
    receiver_id: Optional[uuid.UUID] = None
    message_id: Optional[uuid.UUID] = None
