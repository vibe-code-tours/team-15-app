import enum
from sqlalchemy import Column, String, Integer, Index, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class PickupRequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"


class PickupRequest(Base):
    __tablename__ = "pickup_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    pickup_id = Column(Integer, ForeignKey("pickups.id"), nullable=False, index=True)
    requester_id = Column(String, nullable=False, index=True)
    pickup_from = Column(String, nullable=True, comment="Requester preferred pickup start date")
    pickup_to = Column(String, nullable=True, comment="Requester preferred pickup end date")
    time_slot = Column(String, nullable=True, comment="Requester preferred pickup time slot")
    status = Column(String, nullable=False, default="pending")
    created_at = Column(String, nullable=False)

    __table_args__ = (
        Index('idx_pickup_requests_unique', 'pickup_id', 'requester_id', unique=True),
    )
