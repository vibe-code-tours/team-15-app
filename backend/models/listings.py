import enum
import uuid
from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum as SQLEnum, Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


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
