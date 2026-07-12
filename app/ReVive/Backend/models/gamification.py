from sqlalchemy import Column, String, Integer, Float, ForeignKey, Index
from sqlalchemy.orm import relationship

from database import Base


class UserPoints(Base):
    __tablename__ = "user_points"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, unique=True)
    total_points = Column(Integer, nullable=False, default=0)
    double_points_earned = Column(Integer, nullable=False, default=0)
    referrals_made = Column(Integer, nullable=False, default=0)
    co2_saved_from_referrals = Column(Float, nullable=False, default=0)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)


class ImpactEvent(Base):
    __tablename__ = "impact_events"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, index=True)
    pickup_id = Column(Integer, ForeignKey("pickups.id"))
    type = Column(String, nullable=False)  # donation, referral_bonus, double_impact
    points = Column(Integer, nullable=False)
    co2_saved = Column(Float)
    referral_id = Column(String, ForeignKey("referrals.id"))
    created_at = Column(String, nullable=False)

    __table_args__ = (
        Index('idx_impact_events_referral', 'referral_id'),
    )
