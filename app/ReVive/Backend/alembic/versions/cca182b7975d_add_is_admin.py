"""add_is_admin

Revision ID: cca182b7975d
Revises: 005
Create Date: 2026-07-15 23:09:02.151076

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cca182b7975d'
down_revision: Union[str, None] = '005'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), server_default='false', nullable=False))


def downgrade() -> None:
    op.drop_column('users', 'is_admin')
