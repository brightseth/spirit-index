/**
 * ScoreTable Component
 *
 * Full breakdown of all 7 dimension scores with confidence indicators.
 * Raw scores always visible—not hidden behind visualizations.
 */

import { Scores, DIMENSIONS, DimensionKey, Confidence } from '@/lib/types';
import { DimensionBar } from './DimensionBar';

interface ScoreTableProps {
  scores: Scores;
  total: number;
  layout?: 'vertical' | 'horizontal';
}

export function ScoreTable({ scores, total, layout = 'vertical' }: ScoreTableProps) {
  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  if (layout === 'horizontal') {
    return (
      <div className="flex gap-4 items-end">
        {dimensions.map((dim) => (
          <div key={dim} className="text-center">
            <div className="score-value">{scores[dim].value}</div>
            <div className="score-label">{DIMENSIONS[dim].shortLabel}</div>
            <ConfidenceIndicator confidence={scores[dim].confidence} />
          </div>
        ))}
        <div className="text-center border-l border-subtle pl-4 ml-2">
          <div className="score-total">{total}</div>
          <div className="score-label">Total</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dimensions.map((dim) => (
        <DimensionBar
          key={dim}
          dimension={dim}
          value={scores[dim].value}
          confidence={scores[dim].confidence}
        />
      ))}
      <div className="pt-3 border-t border-subtle flex justify-between items-center">
        <span className="score-label">Total Score</span>
        <span className="score-total">{total}/70</span>
      </div>
    </div>
  );
}

interface ConfidenceIndicatorProps {
  confidence: Confidence;
}

function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  const pips = {
    high: [true, true, true],
    medium: [true, true, false],
    low: [true, false, false],
  };

  return (
    <div className="flex gap-0.5 justify-center mt-1">
      {pips[confidence].map((filled, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            filled ? 'bg-[var(--spirit-green)]' : 'bg-[var(--border-default)]'
          }`}
        />
      ))}
    </div>
  );
}

export default ScoreTable;
