from pydantic import BaseModel, Field


class ReferralApply(BaseModel):
    code: str = Field(min_length=8, max_length=8)


class ReferralStatsResponse(BaseModel):
    total_points: int
    double_points_earned: int
    referrals_made: int
    co2_saved_from_referrals: float
    pending_referrals: int


class ReferralResponse(BaseModel):
    code: str
    stats: ReferralStatsResponse
    referral_url: str
