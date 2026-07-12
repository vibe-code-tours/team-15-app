import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class NotificationChannel(str, enum.Enum):
    email = "email"
    sms = "sms"
    push = "push"


class NotificationType(str, enum.Enum):
    otp = "otp"
    new_request = "new_request"
    new_message = "new_message"
    request_accepted = "request_accepted"
    item_claimed = "item_claimed"
    moderation_warning = "moderation_warning"
    report_update = "report_update"


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    type = Column(SQLEnum(NotificationType), nullable=False)
    channel = Column(SQLEnum(NotificationChannel), nullable=False)
    payload = Column(JSON)
    sent_at = Column(DateTime(timezone=True))
    read_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        Index('idx_notifications_unread', 'user_id', 'read_at'),
    )
