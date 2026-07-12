import enum
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class RequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"
    withdrawn = "withdrawn"


class Request(Base):
    __tablename__ = "requests"

    id = Column(UUID(as_uuid=True), primary_key=True)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False, index=True)
    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    note = Column(Text, comment="why they want it / pickup availability")
    status = Column(SQLEnum(RequestStatus), nullable=False, server_default='pending')

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    responded_at = Column(DateTime(timezone=True))
    confirmed_at = Column(DateTime(timezone=True), comment="set when donor confirms the gift")

    # Relationships
    listing = relationship("Listing", back_populates="requests")
    requester = relationship("User", back_populates="requests_made", foreign_keys=[requester_id])
    messages = relationship("Message", back_populates="request")

    __table_args__ = (
        UniqueConstraint('listing_id', 'requester_id', name='uq_request_listing_requester'),
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True)
    request_id = Column(UUID(as_uuid=True), ForeignKey("requests.id"), nullable=False, index=True)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    body = Column(Text, nullable=False)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    read_at = Column(DateTime(timezone=True))

    # Relationships
    request = relationship("Request", back_populates="messages")
    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])

    __table_args__ = (
        Index('idx_messages_thread_order', 'request_id', 'sent_at'),
    )
