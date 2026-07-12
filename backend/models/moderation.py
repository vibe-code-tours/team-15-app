import enum
import uuid
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class ReportTargetType(str, enum.Enum):
    listing = "listing"
    user = "user"


class ReportStatus(str, enum.Enum):
    open = "open"
    reviewing = "reviewing"
    resolved = "resolved"
    dismissed = "dismissed"


class AdminActionType(str, enum.Enum):
    dismiss = "dismiss"
    warning = "warning"
    takedown = "takedown"
    suspend = "suspend"
    ban = "ban"


class Report(Base):
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    target_type = Column(SQLEnum(ReportTargetType), nullable=False)
    target_listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), index=True, comment="set when target_type = listing")
    target_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, comment="set when target_type = user")
    reason = Column(String, nullable=False)
    details = Column(Text)
    status = Column(SQLEnum(ReportStatus), nullable=False, server_default='open', index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    reporter = relationship("User", foreign_keys=[reporter_id])
    target_listing = relationship("Listing", foreign_keys=[target_listing_id])
    target_user = relationship("User", foreign_keys=[target_user_id])


class AdminAction(Base):
    __tablename__ = "admin_actions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id"), index=True)
    action = Column(SQLEnum(AdminActionType), nullable=False)
    target_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    target_listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"))
    reason = Column(Text)
    suspension_ends_at = Column(DateTime(timezone=True), comment="set when action = suspend")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    admin = relationship("User", foreign_keys=[admin_id])
    report = relationship("Report", foreign_keys=[report_id])
    target_user = relationship("User", foreign_keys=[target_user_id])
    target_listing = relationship("Listing", foreign_keys=[target_listing_id])
