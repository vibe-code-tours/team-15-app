"""add requester pickup preference columns

Revision ID: 004
Revises: 003
Create Date: 2026-07-13

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "pickups",
        sa.Column("requested_pickup_from", sa.String, nullable=True),
    )
    op.add_column(
        "pickups",
        sa.Column("requested_pickup_to", sa.String, nullable=True),
    )
    op.add_column(
        "pickups",
        sa.Column("requested_time_slot", sa.String, nullable=True),
    )


def downgrade() -> None:
    op.drop_column("pickups", "requested_pickup_from")
    op.drop_column("pickups", "requested_pickup_to")
    op.drop_column("pickups", "requested_time_slot")
