import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentById, getAllAgentIds } from "@/lib/agents";
import { DIMENSIONS, DimensionKey, Agent } from "@/lib/types";
import { RadarChart } from "@/app/components/RadarChart";

// Helper to format the last reviewed date
function getLastReviewed(agent: Agent): string {
  const lastEntry = agent.score_history[agent.score_history.length - 1];
  if (!lastEntry) return "N/A";
  const date = new Date(lastEntry.date);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Helper to format archival status for display
function formatArchivalStatus(status: string): string {
  return status.split("_").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
}

interface Props {
  params: Promise<{ id: string }>;
}

// Generate static params for all agents
export async function generateStaticParams() {
  const ids = await getAllAgentIds();
  return ids.map((id) => ({ id }));
}

export default async function AgentDossier({ params }: Props) {
  const { id } = await params;
  const agent = await getAgentById(id);

  if (!agent) {
    notFound();
  }

  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  return (
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="masthead">
        <div className="container">
          <Link href="/" className="no-underline">
            <h1 className="masthead-title">The Spirit Index</h1>
          </Link>
          <p className="masthead-subtitle">
            A reference index of autonomous cultural agents
          </p>

          <nav className="nav mt-6">
            <Link href="/" className="nav-link">
              Index
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/rubric" className="nav-link">
              Rubric
            </Link>
            <Link href="/submit" className="nav-link">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container section">
        {/* Last Reviewed Banner */}
        <div className="text-dim text-sm mb-4 font-mono">
          Last reviewed: {getLastReviewed(agent)}
        </div>

        {/* Archival Badge (if applicable) */}
        {agent.archival_status && (
          <div className="archival-badge mb-6">
            <span className="archival-icon">&#x2020;</span>
            <span className="archival-text">
              ARCHIVAL • {formatArchivalStatus(agent.archival_status).toUpperCase()}
            </span>
          </div>
        )}

        {/* Agent Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{agent.name}</h2>
            <p className="text-muted text-lg mb-3">{agent.tagline}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`status-badge status-${agent.status.toLowerCase()}`}>
                <span className="status-dot" />
                {agent.status}
              </span>
              <span className="text-dim">{agent.category}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="score-total">{agent.total}</div>
            <div className="score-label">/70 Total</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Radar Chart */}
          <div>
            <h3 className="section-title">Score Profile</h3>
            <RadarChart scores={agent.scores} size="lg" />
          </div>

          {/* Right Column: Score Breakdown */}
          <div>
            <h3 className="section-title">Dimension Scores</h3>
            <div className="space-y-4">
              {dimensions.map((dim) => {
                const score = agent.scores[dim];
                const meta = DIMENSIONS[dim];
                const percentage = (score.value / 10) * 100;

                return (
                  <div key={dim} className="dimension-bar">
                    <span className="dimension-bar-label" title={meta.description}>
                      {meta.shortLabel}
                    </span>
                    <div className="dimension-bar-track">
                      <div
                        className="dimension-bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="dimension-bar-value">{score.value}</span>
                    <span className={`confidence-pip confidence-${score.confidence}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Curator Notes */}
        <div className="mt-12">
          <h3 className="section-title">Curator Notes</h3>
          <div className="curator-notes">
            <p>{agent.curator_notes}</p>
          </div>
        </div>

        {/* Evidence */}
        <div className="mt-12">
          <h3 className="section-title">Evidence Archive</h3>
          <div className="space-y-0">
            {agent.evidence.map((item, index) => (
              <div key={index} className="evidence-item">
                <span className="evidence-dimension">
                  {DIMENSIONS[item.dimension as DimensionKey]?.shortLabel || item.dimension}
                </span>
                <span className="evidence-claim">{item.claim}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="evidence-link"
                >
                  [source]
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-12 p-6 bg-blue rounded">
          <h3 className="section-title">Metadata</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-dim block">Inception</span>
              <span className="text-white">{agent.inception_date}</span>
            </div>
            <div>
              <span className="text-dim block">Classification</span>
              <span className="text-white">{agent.classification}</span>
            </div>
            <div>
              <span className="text-dim block">Website</span>
              <a href={agent.website} target="_blank" rel="noopener noreferrer">
                {new URL(agent.website).hostname}
              </a>
            </div>
            <div>
              <span className="text-dim block">Last Updated</span>
              <span className="text-white">
                {agent.score_history[agent.score_history.length - 1]?.date || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link href="/" className="nav-link">
            ← Back to Index
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-subtle">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-dim text-sm">
          <span>Published by the Spirit initiative</span>
          <a href="https://spiritprotocol.io" className="nav-link" target="_blank" rel="noopener noreferrer">
            Spirit Protocol
          </a>
        </div>
      </footer>
    </div>
  );
}
