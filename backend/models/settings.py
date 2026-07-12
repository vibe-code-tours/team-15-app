from sqlalchemy import Column, String, Boolean

from database import Base


class UserSetting(Base):
    __tablename__ = "user_settings"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False, unique=True)
    email_pickup_updates = Column(Boolean, nullable=False, default=True)
    email_referral_alerts = Column(Boolean, nullable=False, default=True)
    email_milestones = Column(Boolean, nullable=False, default=True)
    push_enabled = Column(Boolean, nullable=False, default=False)
    created_at = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)
