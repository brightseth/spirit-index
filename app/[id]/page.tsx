import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getAgentById, getAllAgentIds } from "@/lib/agents";
import { DIMENSIONS, DimensionKey, Agent, ScoreRationale } from "@/lib/types";
import { RadarChart } from "@/app/components/RadarChart";
import { ScoreHistoryChart } from "@/app/components/ScoreHistoryChart";
import { checkRegistration, RegistrationStatus } from "@/lib/chain";
import { getRegistration } from "@/lib/registry";
import { GenesisBadge } from "@/app/components/GenesisBadge";
import { EmbedSection } from "@/app/components/EmbedSection";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";

const siteUrl = "https://spiritindex.org";

// Generate dynamic metadata for each agent
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agent = await getAgentById(id);

  if (!agent) {
    return {
      title: "Agent Not Found",
    };
  }

  const title = `${agent.name} — ${agent.total}/90`;
  const description = `${agent.tagline}. ${agent.curator_notes.substring(0, 150)}...`;

  // Extract string-only review flags for keywords
  const stringFlags = (agent._review_flags || [])
    .filter((f) => typeof f === "string") as string[];

  return {
    title,
    description,
    keywords: [
      agent.name,
      agent.category,
      agent.classification,
      "autonomous agent",
      "AI agent",
      "Spirit Index",
      ...stringFlags,
    ],
    openGraph: {
      title: `${agent.name} | Spirit Index`,
      description,
      url: `${siteUrl}/${agent.id}`,
      siteName: "The Spirit Index",
      type: "article",
      images: [
        {
          url: `${siteUrl}/og-image?id=${agent.id}`,
          width: 1200,
          height: 630,
          alt: `${agent.name} - ${agent.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.name} — ${agent.total}/90`,
      description,
      images: [`${siteUrl}/og-image?id=${agent.id}`],
    },
    alternates: {
      canonical: `${siteUrl}/${agent.id}`,
    },
  };
}

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

// Helper to extract domain from URL
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'source';
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

// Generate static params for all agents
export async function generateStaticParams() {
  const ids = await getAllAgentIds();
  return ids.map((id) => ({ id }));
}

// JSON-LD structured data for search engines
function AgentJsonLd({ agent }: { agent: Agent }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Thing",
    "@id": `${siteUrl}/${agent.id}`,
    name: agent.name,
    description: agent.curator_notes,
    url: agent.website,
    alternateName: agent.tagline,
    additionalType: "https://spiritprotocol.io/ontology/AutonomousAgent",
    identifier: {
      "@type": "PropertyValue",
      propertyID: "spirit-index-id",
      value: agent.id,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: agent.total,
      bestRating: 90,
      worstRating: 0,
      ratingCount: agent.score_history.length,
    },
    dateCreated: agent.inception_date,
    dateModified: agent.score_history[agent.score_history.length - 1]?.date,
    category: agent.category,
    keywords: [agent.classification, agent.category, ...((agent._review_flags || []).filter((f) => typeof f === "string") as string[])].join(", "),
    isPartOf: {
      "@type": "Dataset",
      name: "The Spirit Index",
      url: siteUrl,
      description: "A reference index of autonomous cultural agents",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Breadcrumb JSON-LD
function BreadcrumbJsonLd({ agent }: { agent: Agent }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Spirit Index",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: agent.category,
        item: `${siteUrl}/leaderboard/total`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: agent.name,
        item: `${siteUrl}/${agent.id}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ERC-8004 registration inline tag
function RegistrationTag({ registration }: { registration: RegistrationStatus }) {
  if (!registration.registered) return null;
  return (
    <span
      className="text-xs uppercase tracking-wider font-mono px-2 py-0.5 border rounded"
      style={{ color: '#4ADE80', borderColor: '#4ADE80' }}
      title={`ERC-8004 Agent #${registration.agentId}`}
    >
      ERC-8004 #{registration.agentId}
    </span>
  );
}

// Registration CTA for unregistered agents
function RegistrationCTA({ agent, registration }: { agent: Agent; registration: RegistrationStatus }) {
  if (registration.registered) {
    const regInfo = getRegistration(agent.id);
    return (
      <div className="flex items-center gap-3 flex-wrap text-xs font-mono text-dim">
        <span style={{ color: '#4ADE80' }}>&#x2713; On-chain registered</span>
        {regInfo?.registeredAt && <span>since {regInfo.registeredAt}</span>}
        <a
          href="https://basescan.org/address/0xF2709ceF1Cf4893ed78D3220864428b32b12dFb9"
          target="_blank"
          rel="noopener noreferrer"
          className="text-dim hover:text-muted"
        >
          BaseScan
        </a>
      </div>
    );
  }

  const registerUrl = `https://spiritprotocol.io/register/?spiritId=${encodeURIComponent(agent.id)}&name=${encodeURIComponent(agent.name)}&tagline=${encodeURIComponent(agent.tagline.slice(0, 140))}`;

  return (
    <a
      href={registerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-mono text-dim hover:text-muted transition-colors"
    >
      Register on-chain &rarr;
    </a>
  );
}

export default async function AgentDossier({ params }: Props) {
  const { id } = await params;
  const agent = await getAgentById(id);

  if (!agent) {
    notFound();
  }

  // Check on-chain registration
  let registration: RegistrationStatus = { registered: false };
  try {
    registration = await checkRegistration(agent.id);
  } catch {
    // Silently fall back to unregistered
  }

  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  return (
    <div className="min-h-screen">
      <AgentJsonLd agent={agent} />
      <BreadcrumbJsonLd agent={agent} />

      <Masthead />

      <main className="container section">
        {/* Breadcrumb */}
        <div className="text-dim text-xs font-mono mb-12 tracking-wider">
          <Link href="/" className="text-dim hover:text-muted">Index</Link>
          <span className="mx-2">/</span>
          <span className="text-muted">{agent.name}</span>
        </div>

        {/* Archival Badge */}
        {agent.archival_status && (
          <div className="archival-badge mb-8">
            <span className="archival-icon">&#x2020;</span>
            <span className="archival-text">
              ARCHIVAL &middot; {formatArchivalStatus(agent.archival_status).toUpperCase()}
            </span>
          </div>
        )}

        {/* Genesis Cohort Badge */}
        <GenesisBadge agentId={agent.id} />

        {/* === HERO === */}
        <div className="mb-16">
          <div className="flex justify-between items-start gap-8">
            <div className="flex-1">
              <h2 className="agent-name">{agent.name}</h2>
              <p className="agent-tagline">{agent.tagline}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <span className={`status-badge status-${agent.status.toLowerCase()}`}>
                  <span className="status-dot" />
                  {agent.status}
                </span>
                <span className="text-dim text-xs font-mono uppercase tracking-wider">{agent.category}</span>
                <RegistrationTag registration={registration} />
              </div>
            </div>
            <div className="agent-score-badge hidden sm:block text-center">
              <span className="score-number">{agent.total}</span>
              /90
            </div>
          </div>
        </div>

        {/* === CURATOR NOTES — Editorial voice leads === */}
        <div className="mb-16">
          <h3 className="section-title">Curator Notes</h3>
          <div className="curator-notes">
            <p>{agent.curator_notes}</p>
          </div>
        </div>

        {/* === Disclosure (if applicable) === */}
        {agent.disclosure && (
          <div className="mb-16 py-3 border-t border-b" style={{ borderColor: 'var(--confidence-medium)' }}>
            <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--confidence-medium)' }}>
              Disclosure &mdash;{' '}
            </span>
            <span className="text-xs font-mono text-muted">{agent.disclosure}</span>
          </div>
        )}

        {/* === SCORE PROFILE === */}
        <div className="section-divider" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Radar Chart */}
          <div>
            <h3 className="section-title">Score Profile</h3>
            <RadarChart scores={agent.scores} size="lg" />
          </div>

          {/* Right: Dimension Scores */}
          <div>
            <h3 className="section-title">Dimension Scores</h3>
            <div className="space-y-4">
              {dimensions.map((dim) => {
                const score = agent.scores[dim];
                const meta = DIMENSIONS[dim];
                const percentage = score.value !== null ? (score.value / 10) * 100 : 0;
                const isUnscored = score.value === null;

                return (
                  <div key={dim} className={`dimension-bar ${isUnscored ? 'opacity-40' : ''}`}>
                    <span className="dimension-bar-label" title={meta.description}>
                      {meta.shortLabel}
                    </span>
                    <div className="dimension-bar-track">
                      <div
                        className="dimension-bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="dimension-bar-value">{isUnscored ? '--' : score.value}</span>
                    <span className={`confidence-pip confidence-${score.confidence}`} />
                  </div>
                );
              })}
            </div>

            {/* Score Rationale */}
            {agent.score_rationale && (
              <details className="mt-8 border border-subtle rounded">
                <summary className="p-4 cursor-pointer text-white font-bold hover:bg-blue/50 transition-colors">
                  Score Rationale
                </summary>
                <div className="p-4 pt-0 space-y-3">
                  {dimensions.map((dim) => {
                    const rationale = agent.score_rationale?.[dim];
                    if (!rationale) return null;
                    const meta = DIMENSIONS[dim];
                    return (
                      <div key={dim} className="text-sm">
                        <Link
                          href={`/rubric#${dim}`}
                          className="text-green hover:underline font-medium"
                        >
                          {meta.label}
                        </Link>
                        <span className="text-dim"> &mdash; </span>
                        <span className="text-muted">{rationale}</span>
                      </div>
                    );
                  })}
                </div>
              </details>
            )}
          </div>
        </div>

        {/* === EVIDENCE ARCHIVE === */}
        <div className="section-divider" />

        <div className="mb-16">
          <h3 className="section-title">Evidence Archive</h3>
          {agent.evidence.length > 0 ? (
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
                    {extractDomain(item.url)} &nearr;
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-dim text-sm font-mono">No evidence citations recorded.</p>
          )}
        </div>

        {/* === SCORE HISTORY === */}
        <div className="section-divider" />

        <div className="mb-16">
          <h3 className="section-title">Score History</h3>
          <div className="border border-subtle rounded p-4">
            <ScoreHistoryChart
              history={agent.score_history}
              currentTotal={agent.total}
            />
          </div>
        </div>

        {/* === ON-CHAIN STATUS === */}
        <div className="mb-16">
          <RegistrationCTA agent={agent} registration={registration} />
        </div>

        {/* === METADATA COLOPHON === */}
        <div className="metadata-colophon">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <dt>Inception</dt>
              <dd>{agent.inception_date}</dd>
            </div>
            <div>
              <dt>Classification</dt>
              <dd>{agent.classification}</dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>
                <a href={agent.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white">
                  {extractDomain(agent.website)}
                </a>
              </dd>
            </div>
            <div>
              <dt>Last Reviewed</dt>
              <dd>{getLastReviewed(agent)}</dd>
            </div>
          </dl>
        </div>

        {/* Embed Badge */}
        <EmbedSection agentId={agent.id} agentName={agent.name} />

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/" className="nav-link text-xs">
            &larr; Back to Index
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
