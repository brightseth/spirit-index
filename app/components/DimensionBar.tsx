/**
 * DimensionBar Component
 *
 * Horizontal bar showing score for a single dimension.
 * Includes label, visual bar, value, and confidence indicator.
 */

import { Confidence, DIMENSIONS, DimensionKey } from '@/lib/types';

interface DimensionBarProps {
  dimension: DimensionKey;
  value: number;
  confidence: Confidence;
  showLabel?: boolean;
}

export function DimensionBar({
  dimension,
  value,
  confidence,
  showLabel = true,
}: DimensionBarProps) {
  const meta = DIMENSIONS[dimension];
  const percentage = (value / 10) * 100;

  return (
    <div className="dimension-bar">
      {showLabel && (
        <span className="dimension-bar-label" title={meta.description}>
          {meta.shortLabel}
        </span>
      )}
      <div className="dimension-bar-track">
        <div
          className="dimension-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="dimension-bar-value">{value}</span>
      <ConfidencePip confidence={confidence} />
    </div>
  );
}

interface ConfidencePipProps {
  confidence: Confidence;
}

function ConfidencePip({ confidence }: ConfidencePipProps) {
  return (
    <span
      className={`confidence-pip confidence-${confidence}`}
      title={`Confidence: ${confidence}`}
    />
  );
}

export default DimensionBar;
