"""add available_from and available_to to pickups

Revision ID: 003
Revises: 002
Create Date: 2026-07-13

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add new columns
    op.add_column(
        "pickups",
        sa.Column("available_from", sa.String, nullable=True),
    )
    op.add_column(
        "pickups",
        sa.Column("available_to", sa.String, nullable=True),
    )

    # Copy data from pickup_date to both new columns
    op.execute(
        "UPDATE pickups SET available_from = pickup_date, available_to = pickup_date"
    )

    # Make columns non-nullable
    op.alter_column("pickups", "available_from", nullable=False)
    op.alter_column("pickups", "available_to", nullable=False)

    # Drop old column
    op.drop_column("pickups", "pickup_date")


def downgrade() -> None:
    # Add back pickup_date column
    op.add_column(
        "pickups",
        sa.Column("pickup_date", sa.String, nullable=True),
    )

    # Copy data from available_from to pickup_date
    op.execute(
        "UPDATE pickups SET pickup_date = available_from"
    )

    # Make column non-nullable
    op.alter_column("pickups", "pickup_date", nullable=False)

    # Drop new columns
    op.drop_column("pickups", "available_from")
    op.drop_column("pickups", "available_to")
