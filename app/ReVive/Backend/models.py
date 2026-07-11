import enum
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Text, DateTime, ForeignKey, 
    JSON, Enum as SQLEnum, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base

# ==========================================
# Enums
# ==========================================

class UserStatus(str, enum.Enum):
    active = "active"
    suspended = "suspended"
    banned = "banned"

class AuthProvider(str, enum.Enum):
    email = "email"
    google = "google"
    facebook = "facebook"
    apple = "apple"

class ItemCondition(str, enum.Enum):
    working = "working"
    minor_repair_needed = "minor_repair_needed"
    for_parts_scrap = "for_parts_scrap"

class ListingStatus(str, enum.Enum):
    available = "available"
    reserved = "reserved"
    donated = "donated"
    archived = "archived"

class PickupPreference(str, enum.Enum):
    self_pickup_only = "self_pickup_only"
    needs_truck = "needs_truck"
    weekends_only = "weekends_only"
    flexible = "flexible"

class RequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"
    withdrawn = "withdrawn"

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

# ==========================================
# Models
# ==========================================

class Region(Base):
    __tablename__ = "regions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    city = Column(String, nullable=False)
    postal_code = Column(String)
    country = Column(String, nullable=False, server_default='N/A')
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    users = relationship("User", back_populates="region")
    listings = relationship("Listing", back_populates="region")

    __table_args__ = (
        Index('idx_regions_city_postal', 'city', 'postal_code'),
    )


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


class Category(Base):
    __tablename__ = "categories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True, index=True)
    parent_category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), comment="optional, for subcategories")

    # Relationships
    subcategories = relationship("Category", back_populates="parent_category", remote_side=[id])
    parent_category = relationship("Category", back_populates="subcategories", remote_side=[parent_category_id])
    listings = relationship("Listing", back_populates="category")


class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=False, index=True)
    region_id = Column(UUID(as_uuid=True), ForeignKey("regions.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    brand = Column(String)
    model = Column(String)
    condition = Column(SQLEnum(ItemCondition), nullable=False)
    pickup_preference = Column(SQLEnum(PickupPreference), nullable=False, server_default='flexible')
    status = Column(SQLEnum(ListingStatus), nullable=False, server_default='available')
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    archived_at = Column(DateTime(timezone=True))

    # Relationships
    owner = relationship("User", back_populates="listings")
    category = relationship("Category", back_populates="listings")
    region = relationship("Region", back_populates="listings")
    photos = relationship("ListingPhoto", back_populates="listing")
    watchlist_entries = relationship("WatchlistItem", back_populates="listing")
    requests = relationship("Request", back_populates="listing")

    __table_args__ = (
        Index('idx_listings_region_status', 'region_id', 'status'),
        Index('idx_listings_title_search', 'title'),
    )


class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False, index=True)
    url = Column(String, nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    listing = relationship("Listing", back_populates="photos")


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    listing_id = Column(UUID(as_uuid=True), ForeignKey("listings.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="watchlist_items")
    listing = relationship("Listing", back_populates="watchlist_entries")

    __table_args__ = (
        UniqueConstraint('user_id', 'listing_id', name='uq_watchlist_user_listing'),
    )


class Request(Base):
    __tablename__ = "requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
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
