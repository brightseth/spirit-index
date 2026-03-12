/**
 * GenesisBadge Component
 *
 * Displays a Genesis Cohort #1 badge on dossier pages for agents
 * that are part of the Genesis program. Shows onboarding progress
 * for cohort agents and role designation for core agents.
 */

import {
  isGenesisAgent,
  isGenesisCoreAgent,
  getGenesisStatus,
  getOnboardingProgress,
  type GenesisOnboarding,
} from "@/lib/genesis";

interface GenesisBadgeProps {
  agentId: string;
}

function OnboardingProgress({ onboarding }: { onboarding: GenesisOnboarding }) {
  const steps = [
    { key: "soulMd", label: "soul.md", done: onboarding.soulMd },
    { key: "walletAndGrant", label: "Wallet", done: onboarding.walletAndGrant },
    { key: "communityJoined", label: "Community", done: onboarding.communityJoined },
    { key: "firstOutput", label: "First Output", done: onboarding.firstOutput },
  ];

  const progress = getOnboardingProgress(onboarding);
  const allDone = progress === 100;

  if (allDone) return null;

  return (
    <div className="mt-3 pt-3 border-t" style={{ borderColor: "rgba(0, 255, 0, 0.15)" }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-dim">
          Onboarding
        </span>
        <span className="text-xs font-mono" style={{ color: "#F59E0B" }}>
          {progress}%
        </span>
      </div>
      <div className="flex gap-3">
        {steps.map((step) => (
          <span
            key={step.key}
            className="text-xs font-mono"
            style={{ color: step.done ? "#4ADE80" : "var(--text-dim)" }}
          >
            {step.done ? "\u2713" : "\u25CB"} {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function GenesisBadge({ agentId }: GenesisBadgeProps) {
  const isCohort = isGenesisAgent(agentId);
  const isCore = isGenesisCoreAgent(agentId);

  if (!isCohort && !isCore) return null;

  const genesisStatus = isCohort ? getGenesisStatus(agentId) : null;

  return (
    <div
      className="mb-6 p-4 border rounded"
      style={{
        borderColor: "rgba(0, 255, 0, 0.3)",
        backgroundColor: "rgba(0, 255, 0, 0.03)",
      }}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-2 py-1 border rounded"
          style={{
            color: "#00FF00",
            borderColor: "#00FF00",
          }}
        >
          Genesis Cohort #1
        </span>

        {isCohort && genesisStatus && (
          <span className="text-xs font-mono text-muted">
            Artist: {genesisStatus.artist}
          </span>
        )}

        {isCore && (
          <span className="text-xs font-mono text-muted">
            Core Agent
          </span>
        )}

        <span className="text-xs font-mono text-dim">
          Showcase: April 15, 2026
        </span>
      </div>

      {isCohort && genesisStatus && genesisStatus.practiceStreak > 0 && (
        <div className="mt-2 text-xs font-mono text-muted">
          Practice streak: {genesisStatus.practiceStreak} days
          {genesisStatus.lastPractice && (
            <span className="text-dim"> (last: {genesisStatus.lastPractice})</span>
          )}
        </div>
      )}

      {isCohort && genesisStatus && (
        <OnboardingProgress onboarding={genesisStatus.onboarding} />
      )}
    </div>
  );
}

export default GenesisBadge;
