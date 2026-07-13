import enum
from sqlalchemy import Column, String, Integer, Text, Index
from sqlalchemy.orm import relationship

from database import Base


class PickupStatus(str, enum.Enum):
    available = "available"
    requested = "requested"
    accepted = "accepted"
    picked_up = "picked_up"
    cancelled = "cancelled"


class Pickup(Base):
    __tablename__ = "pickups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False)
    device_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)
    condition = Column(String, nullable=False, default="working")
    available_from = Column(String, nullable=False)
    available_to = Column(String, nullable=False)
    time_slot = Column(String, nullable=False)
    address = Column(String, nullable=False)
    notes = Column(Text)
    status = Column(String, nullable=False, default="available")
    requested_by = Column(String, nullable=True, comment="user_id of person who requested this item")
    created_at = Column(String, nullable=False)

    __table_args__ = (
        Index('idx_pickups_user_status', 'user_id', 'status'),
    )
