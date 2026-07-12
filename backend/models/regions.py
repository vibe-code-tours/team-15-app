import uuid
from sqlalchemy import Column, String, DateTime, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


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
