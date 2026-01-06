import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentsSortedBy } from "@/lib/agents";
import { DIMENSIONS, DimensionKey } from "@/lib/types";

interface Props {
  params: Promise<{ dimension: string }>;
}

const validDimensions = Object.keys(DIMENSIONS) as DimensionKey[];

// Generate static params for all dimensions
export async function generateStaticParams() {
  return validDimensions.map((dimension) => ({ dimension }));
}

// Generate metadata for each dimension
export async function generateMetadata({ params }: Props) {
  const { dimension } = await params;
  const meta = DIMENSIONS[dimension as DimensionKey];

  if (!meta) return { title: "Leaderboard | Spirit Index" };

  return {
    title: `${meta.label} Leaderboard | Spirit Index`,
    description: `Entities ranked by ${meta.label}: ${meta.description}`,
  };
}

export default async function DimensionLeaderboard({ params }: Props) {
  const { dimension } = await params;

  // Validate dimension
  if (!validDimensions.includes(dimension as DimensionKey)) {
    notFound();
  }

  const dimKey = dimension as DimensionKey;
  const meta = DIMENSIONS[dimKey];
  const agents = await getAgentsSortedBy(dimKey);

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
            <Link href="/compare" className="nav-link">
              Compare
            </Link>
            <Link href="/submit" className="nav-link">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container section">
        {/* Breadcrumb */}
        <div className="text-dim text-sm mb-4 font-mono">
          <Link href="/" className="hover:text-green">Index</Link>
          {" → "}
          <span className="text-muted">Leaderboard</span>
          {" → "}
          <span className="text-white">{meta.label}</span>
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">
          {meta.label} Leaderboard
        </h2>
        <p className="text-muted mb-8">
          {meta.description}
        </p>

        {/* Dimension Selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {validDimensions.map((dim) => {
            const isActive = dim === dimKey;
            return (
              <Link
                key={dim}
                href={`/leaderboard/${dim}`}
                className={`px-3 py-1 rounded text-sm font-mono transition-colors ${
                  isActive
                    ? "bg-green text-black"
                    : "bg-blue border border-subtle text-muted hover:border-green hover:text-white"
                }`}
              >
                {DIMENSIONS[dim].shortLabel}
              </Link>
            );
          })}
          <Link
            href="/"
            className="px-3 py-1 rounded text-sm font-mono bg-blue border border-subtle text-muted hover:border-green hover:text-white"
          >
            TOTAL
          </Link>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-subtle">
                <th className="text-left py-3 pr-4 text-dim font-mono w-12">#</th>
                <th className="text-left py-3 pr-4 text-dim font-mono">Entity</th>
                <th className="text-left py-3 pr-4 text-dim font-mono">Category</th>
                <th className="text-center py-3 px-4 text-green font-mono">{meta.shortLabel}</th>
                <th className="text-center py-3 px-4 text-dim font-mono">Total</th>
                <th className="text-left py-3 text-dim font-mono">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent, index) => {
                const score = agent.scores[dimKey];
                const rationale = agent.score_rationale?.[dimKey];

                return (
                  <tr
                    key={agent.id}
                    className="border-b border-subtle/50 hover:bg-blue/30 transition-colors"
                  >
                    <td className="py-4 pr-4 text-dim font-mono">
                      {index + 1}
                    </td>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/${agent.id}`}
                        className="text-white hover:text-green font-medium"
                      >
                        {agent.name}
                      </Link>
                      <div className="text-dim text-xs mt-1">{agent.tagline}</div>
                    </td>
                    <td className="py-4 pr-4 text-muted text-xs">
                      {agent.category}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green font-bold text-lg">
                        {score.value}
                      </span>
                      <span
                        className={`ml-2 inline-block w-2 h-2 rounded-full confidence-${score.confidence}`}
                        title={`Confidence: ${score.confidence}`}
                      />
                    </td>
                    <td className="py-4 px-4 text-center text-muted">
                      {agent.total}/70
                    </td>
                    <td className="py-4 text-dim text-xs max-w-[300px]">
                      {rationale ? (
                        <span className="line-clamp-2">{rationale}</span>
                      ) : (
                        <span className="italic">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Anchor Definitions */}
        <div className="mt-12 p-6 bg-blue rounded">
          <h3 className="text-white font-bold mb-4">
            {meta.label} Anchors
          </h3>
          <Link
            href={`/rubric#${dimKey}`}
            className="text-green text-sm hover:underline"
          >
            View full rubric definition →
          </Link>
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
          <a
            href="https://spiritprotocol.io"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spirit Protocol
          </a>
        </div>
      </footer>
    </div>
  );
}
