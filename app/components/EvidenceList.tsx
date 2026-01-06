/**
 * EvidenceList Component
 *
 * Displays linked citations supporting score claims.
 * Every score ≥5 requires external evidence.
 */

import { Evidence, DIMENSIONS, DimensionKey } from '@/lib/types';

interface EvidenceListProps {
  evidence: Evidence[];
  showDimension?: boolean;
}

export function EvidenceList({ evidence, showDimension = true }: EvidenceListProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <p className="text-muted text-sm">
        No evidence citations provided.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {evidence.map((item, index) => (
        <EvidenceItem
          key={index}
          evidence={item}
          showDimension={showDimension}
        />
      ))}
    </div>
  );
}

interface EvidenceItemProps {
  evidence: Evidence;
  showDimension?: boolean;
}

function EvidenceItem({ evidence, showDimension = true }: EvidenceItemProps) {
  const dimensionKey = evidence.dimension as DimensionKey;
  const dimensionMeta = DIMENSIONS[dimensionKey];

  return (
    <div className="evidence-item">
      {showDimension && (
        <span className="evidence-dimension">
          {dimensionMeta?.shortLabel || evidence.dimension}
        </span>
      )}
      <span className="evidence-claim">
        {evidence.claim}
      </span>
      <a
        href={evidence.url}
        target="_blank"
        rel="noopener noreferrer"
        className="evidence-link"
        title={evidence.url}
      >
        [source]
      </a>
    </div>
  );
}

export default EvidenceList;
