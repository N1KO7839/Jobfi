"""add notification_frequency

Revision ID: affd3cb14d7a
Revises: 58495d248965
Create Date: 2026-06-02 08:36:15.466922

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'affd3cb14d7a'
down_revision: Union[str, Sequence[str], None] = '58495d248965'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('userpreference', sa.Column('notification_frequency', sa.String(), server_default='none', nullable=False))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('userpreference', 'notification_frequency')
