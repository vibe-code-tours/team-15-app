import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON, Enum as SQLEnum, Index, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base
from models.base import UserStatus, AuthProvider


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, index=True)
    password_hash = Column(String, comment="null if user only uses OAuth")
    auth_provider = Column(SQLEnum(AuthProvider), nullable=False, server_default='email')
    profile_picture_url = Column(String)
    region_id = Column(UUID(as_uuid=True), ForeignKey("regions.id"))
    status = Column(SQLEnum(UserStatus), nullable=False, server_default='active', index=True)
    notification_prefs = Column(JSON, comment="per-channel opt in/out")
    items_donated_count = Column(Integer, nullable=False, default=0)
    items_received_count = Column(Integer, nullable=False, default=0)
    is_admin = Column(Boolean, nullable=False, default=False, server_default='false')
    banned_ip = Column(String, comment="set when status = banned")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    region = relationship("Region", back_populates="users")
    otp_codes = relationship("OTPCode", back_populates="user")
    listings = relationship("Listing", back_populates="owner")
    watchlist_items = relationship("WatchlistItem", back_populates="user")
    requests_made = relationship("Request", back_populates="requester", foreign_keys="Request.requester_id")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")
    notifications = relationship("Notification", back_populates="user")


class OTPCode(Base):
    __tablename__ = "otp_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    destination = Column(String, nullable=False, comment="email or phone the OTP was sent to")
    code_hash = Column(String, nullable=False)
    purpose = Column(String, nullable=False, comment="registration | password_reset | phone_verify")
    expires_at = Column(DateTime(timezone=True), nullable=False)
    consumed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="otp_codes")

    __table_args__ = (
        Index('idx_otp_user_purpose', 'user_id', 'purpose'),
    )
