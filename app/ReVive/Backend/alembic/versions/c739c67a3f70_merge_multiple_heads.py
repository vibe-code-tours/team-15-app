"""Merge multiple heads

Revision ID: c739c67a3f70
Revises: 006, cca182b7975d
Create Date: 2026-07-16 01:12:13.999781

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c739c67a3f70'
down_revision: Union[str, None] = ('006', 'cca182b7975d')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
