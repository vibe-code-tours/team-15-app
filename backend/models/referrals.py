import enum
from sqlalchemy import Column, String, DateTime, Index
from sqlalchemy.orm import relationship

from database import Base


class ReferralStatus(str, enum.Enum):
    pending = "pending"
    completed = "completed"
    expired = "expired"


class Referral(Base):
    __tablename__ = "referrals"

    id = Column(String, primary_key=True)
    referrer_id = Column(String, nullable=False, index=True)
    referred_id = Column(String, index=True)
    referral_code = Column(String, nullable=False, unique=True)
    status = Column(String, nullable=False, default="pending")
    created_at = Column(String, nullable=False)
    completed_at = Column(String)

    __table_args__ = (
        Index('idx_referrals_status', 'status'),
    )
