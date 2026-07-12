import enum


# ==========================================
# Shared Enums
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
