/**
 * AgentCard Component
 *
 * Compact card view of an agent for grid layouts.
 * Shows: name, status, category, total score, mini radar shape.
 */

import Link from 'next/link';
import { Agent } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

interface AgentCardProps {
  agent: Agent;
  showRadar?: boolean;
}

export function AgentCard({ agent, showRadar = false }: AgentCardProps) {
  return (
    <Link href={`/${agent.id}`} className="block no-underline">
      <div className="agent-card">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-medium text-white mb-1">
              {agent.name}
            </h3>
            <StatusBadge status={agent.status} />
          </div>
          <div className="text-right">
            <div className="score-total">{agent.total}</div>
            <div className="score-label">/70</div>
          </div>
        </div>

        <p className="text-sm text-muted mb-3">
          {agent.tagline}
        </p>

        <div className="flex justify-between items-center text-xs">
          <span className="text-dim uppercase tracking-wide">
            {agent.category}
          </span>
          <span className="text-dim">
            Since {new Date(agent.inception_date).getFullYear()}
          </span>
        </div>

        {showRadar && (
          <div className="mt-4 pt-4 border-t border-subtle">
            {/* Mini radar preview would go here */}
            <MiniScorePreview scores={agent.scores} />
          </div>
        )}
      </div>
    </Link>
  );
}

interface MiniScorePreviewProps {
  scores: Agent['scores'];
}

function MiniScorePreview({ scores }: MiniScorePreviewProps) {
  const dimensions = [
    { key: 'persistence', label: 'P' },
    { key: 'autonomy', label: 'A' },
    { key: 'cultural_impact', label: 'I' },
    { key: 'economic_reality', label: 'E' },
    { key: 'governance', label: 'G' },
    { key: 'tech_distinctiveness', label: 'T' },
    { key: 'narrative_coherence', label: 'N' },
  ] as const;

  return (
    <div className="flex justify-between gap-1">
      {dimensions.map(({ key, label }) => (
        <div key={key} className="text-center">
          <div className="text-xs text-green font-mono">
            {scores[key].value}
          </div>
          <div className="text-[10px] text-dim">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default AgentCard;
