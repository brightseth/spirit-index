/**
 * StatusBadge Component
 *
 * Displays entity status with colored indicator dot.
 * Statuses: Active (green), Dormant (amber), Deceased (gray), Subsumed (blue), Forked (purple)
 */

import { EntityStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: EntityStatus;
}

const statusConfig: Record<EntityStatus, { label: string; className: string }> = {
  Active: { label: 'ACTIVE', className: 'status-active' },
  Dormant: { label: 'DORMANT', className: 'status-dormant' },
  Deceased: { label: 'DECEASED', className: 'status-deceased' },
  Subsumed: { label: 'SUBSUMED', className: 'status-subsumed' },
  Forked: { label: 'FORKED', className: 'status-forked' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`status-badge ${config.className}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}

export default StatusBadge;
