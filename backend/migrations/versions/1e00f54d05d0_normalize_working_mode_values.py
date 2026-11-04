"""normalize working mode values

Revision ID: 1e00f54d05d0
Revises: e60966a9ec32
Create Date: 2026-11-04 19:21:07.418236

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "1e00f54d05d0"
down_revision: Union[str, Sequence[str], None] = "e60966a9ec32"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE job_offers SET working_mode = CASE
            WHEN working_mode ILIKE '%hybr%' THEN 'Hybrid'
            WHEN working_mode ILIKE '%remote%' OR working_mode ILIKE '%zdaln%' THEN 'Remote'
            WHEN working_mode ILIKE '%office%' OR working_mode ILIKE '%stacjonar%' THEN 'Office'
            ELSE 'Unknown'
        END
        """
    )


def downgrade() -> None:
    pass
