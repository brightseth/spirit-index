/**
 * GenesisSection Component
 *
 * Displays a highlight section on the main index page for the
 * Genesis Cohort #1. Shows cohort summary, days until showcase,
 * and links to each Genesis agent's dossier.
 */

import Link from "next/link";
import { Agent } from "@/lib/types";

interface GenesisAgent {
  id: string;
  agent: (Agent & {
    scoring_coverage: number;
    comparable_score: number;
    comparable_max: number;
    comparable_pct: number;
  }) | null;
  artist: string;
  practiceStreak: number;
  onboardingPct: number;
}

interface GenesisSectionProps {
  agents: GenesisAgent[];
  daysUntilShowcase: number;
  showcaseDate: string;
}

export function GenesisSection({
  agents,
  daysUntilShowcase,
  showcaseDate,
}: GenesisSectionProps) {
  const practicing = agents.filter((a) => a.practiceStreak > 0).length;

  return (
    <div
      className="mb-12 p-6 border rounded"
      style={{
        borderColor: "rgba(0, 255, 0, 0.2)",
        backgroundColor: "rgba(0, 255, 0, 0.02)",
      }}
    >
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="section-title mb-0 border-0 pb-0">
          Genesis Cohort #1
        </h3>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-muted">
            {agents.length} agents
          </span>
          <span className="text-muted">
            {practicing} practicing
          </span>
          <span style={{ color: daysUntilShowcase <= 14 ? "#F59E0B" : "var(--text-dim)" }}>
            {daysUntilShowcase > 0
              ? `${daysUntilShowcase}d to showcase`
              : "Showcase live"}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted mb-4 font-mono">
        Ten artists building sovereign AI agents on Spirit Protocol. Showcase: April 15, Paris.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {agents.map((ga) => (
          <Link
            key={ga.id}
            href={`/${ga.id}`}
            className="p-3 border rounded hover:border-[var(--spirit-green-dim)] transition-colors no-underline"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div className="text-sm font-mono text-white mb-1">
              {ga.agent?.name ?? ga.id}
            </div>
            <div className="text-xs font-mono text-dim truncate">
              {ga.artist}
            </div>
            {ga.practiceStreak > 0 && (
              <div className="text-xs font-mono mt-1" style={{ color: "#4ADE80" }}>
                {ga.practiceStreak}d streak
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GenesisSection;
