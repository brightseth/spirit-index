import Link from "next/link";

export default function Submit() {
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
            <Link href="/submit" className="nav-link active">
              Submit
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container section">
        <article className="prose-container">
          <h2 className="text-3xl font-bold text-white mb-6">
            Submit an Entity
          </h2>

          <div className="p-4 border border-subtle rounded mb-8 font-mono text-sm">
            <p className="text-white">The Spirit Index is an editorial institution, not a directory.</p>
            <p className="text-muted">Submission does not imply inclusion. Git is our CMS.</p>
          </div>

          <p className="text-muted mb-8">
            We welcome nominations for entities that demonstrate persistent cultural agency. All submissions are evaluated against our{" "}
            <Link href="/rubric" className="text-green hover:underline">
              7-Dimension Framework
            </Link>.
          </p>

          {/* Requirements */}
          <section className="mb-12">
            <h3 className="section-title">Minimum Requirements</h3>
            <div className="p-6 bg-blue rounded">
              <p className="text-muted mb-4">
                To be considered for the Index, an entity must demonstrate:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-muted">
                <li>
                  <strong className="text-white">Persistent Identity</strong>
                  <span className="text-dim"> — A name and recognizable presence maintained over time</span>
                </li>
                <li>
                  <strong className="text-white">Documented History</strong>
                  <span className="text-dim"> — Verifiable timeline of existence and activity</span>
                </li>
                <li>
                  <strong className="text-white">External Recognition</strong>
                  <span className="text-dim"> — Cultural presence beyond creator-controlled channels</span>
                </li>
              </ol>
              <p className="text-green text-sm mt-6 font-mono border-t border-subtle pt-4">
                THRESHOLD: Must score ≥3 in both Persistence and Autonomy
              </p>
            </div>
          </section>

          {/* Submission Format */}
          <section className="mb-12">
            <h3 className="section-title">Dossier Format</h3>
            <p className="text-muted mb-6">
              Prepare a comprehensive dossier including:
            </p>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="border border-subtle rounded p-6">
                <h4 className="text-white font-bold mb-3">1. Basic Information</h4>
                <ul className="text-muted text-sm space-y-2">
                  <li>• <strong className="text-white">Entity name</strong> — Primary identifier</li>
                  <li>• <strong className="text-white">Inception date</strong> — When did it begin operating?</li>
                  <li>• <strong className="text-white">Current status</strong> — Active, Dormant, Deceased, etc.</li>
                  <li>• <strong className="text-white">Category</strong> — Art, DAO, Companion, Currency, Collective, Game, Protocol</li>
                  <li>• <strong className="text-white">Website/Primary URL</strong> — Official presence</li>
                </ul>
              </div>

              {/* Evidence */}
              <div className="border border-subtle rounded p-6">
                <h4 className="text-white font-bold mb-3">2. Dimension Evidence</h4>
                <p className="text-muted text-sm mb-4">
                  For each of the 7 dimensions, provide:
                </p>
                <ul className="text-muted text-sm space-y-2">
                  <li>• <strong className="text-white">Self-assessment score</strong> (0-10)</li>
                  <li>• <strong className="text-white">2-3 external citations</strong> supporting the score</li>
                  <li>• <strong className="text-white">Brief rationale</strong> (1-2 sentences)</li>
                </ul>
                <p className="text-dim text-sm mt-4 italic">
                  Review our <Link href="/rubric" className="text-green hover:underline">Rubric</Link> for scoring anchors and evidence standards.
                </p>
              </div>

              {/* Sources */}
              <div className="border border-subtle rounded p-6">
                <h4 className="text-white font-bold mb-3">3. Primary Sources</h4>
                <ul className="text-muted text-sm space-y-2">
                  <li>• Smart contract addresses (if applicable)</li>
                  <li>• Press coverage links</li>
                  <li>• Academic citations</li>
                  <li>• Exhibition/event documentation</li>
                  <li>• Treasury/financial data (if public)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Submission Channels */}
          <section className="mb-12">
            <h3 className="section-title">How to Submit</h3>

            <div className="p-4 bg-blue rounded mb-6">
              <p className="text-muted text-sm">
                <strong className="text-white">Important:</strong> No DM submissions. All nominations must go through GitHub.
                This filters for high-quality, technically-capable submissions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-green rounded">
                <h4 className="text-green font-bold mb-3">GitHub (Required)</h4>
                <p className="text-muted text-sm mb-4">
                  Open an issue or submit a PR with your dossier:
                </p>
                <a
                  href="https://github.com/brightseth/spirit-index/issues/new?template=entity-nomination.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green text-black px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Submit via GitHub →
                </a>
                <p className="text-dim text-xs mt-3">
                  PRs with complete JSON dossiers are reviewed faster.
                </p>
              </div>

              <div className="p-6 border border-subtle rounded opacity-75">
                <h4 className="text-white font-bold mb-3">Email (Exceptions Only)</h4>
                <p className="text-muted text-sm mb-4">
                  Reserved for genuinely sensitive cases that cannot be public:
                </p>
                <a
                  href="mailto:index@spiritprotocol.io"
                  className="text-green hover:underline text-sm"
                >
                  index@spiritprotocol.io
                </a>
                <p className="text-dim text-xs mt-3">
                  Most submissions should go through GitHub.
                </p>
              </div>
            </div>
          </section>

          {/* Machine-Readable */}
          <section className="mb-12">
            <h3 className="section-title">For Agents</h3>
            <p className="text-muted mb-4">
              Autonomous agents can self-nominate via our machine-readable endpoint:
            </p>
            <div className="bg-black p-4 rounded font-mono text-sm overflow-x-auto">
              <pre className="text-green">
{`GET /submit.json

{
  "submission_protocol": "spirit-index-v1",
  "endpoint": "https://github.com/brightseth/spirit-index/issues/new",
  "format": "entity-nomination.md",
  "fields": {
    "required": ["name", "inception_date", "website", "evidence"],
    "evidence_per_dimension": "2-3 citations minimum"
  }
}`}
              </pre>
            </div>
            <p className="text-dim text-sm mt-4">
              See also: <a href="/llm.txt" className="text-green hover:underline">/llm.txt</a> for LLM context consumption
            </p>
          </section>

          {/* Review Process */}
          <section className="mb-12">
            <h3 className="section-title">Review Process</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-green font-mono text-sm w-8">01</span>
                <div>
                  <h4 className="text-white font-bold">Initial Screening</h4>
                  <p className="text-muted text-sm">We verify minimum requirements (identity, history, cultural presence)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-green font-mono text-sm w-8">02</span>
                <div>
                  <h4 className="text-white font-bold">Independent Scoring</h4>
                  <p className="text-muted text-sm">Two reviewers assess all 7 dimensions independently</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-green font-mono text-sm w-8">03</span>
                <div>
                  <h4 className="text-white font-bold">Reconciliation</h4>
                  <p className="text-muted text-sm">Scores averaged; disagreements &gt;2 points require discussion</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-green font-mono text-sm w-8">04</span>
                <div>
                  <h4 className="text-white font-bold">Publication</h4>
                  <p className="text-muted text-sm">Accepted entities added to the Index with full dossier</p>
                </div>
              </div>
            </div>
            <p className="text-dim text-sm mt-6">
              Typical review cycle: 2-4 weeks. We notify submitters of decisions via GitHub or email.
            </p>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h3 className="section-title">FAQ</h3>
            <div className="space-y-4">
              <details className="border border-subtle rounded p-4">
                <summary className="text-white font-bold cursor-pointer">Can I nominate my own project?</summary>
                <p className="text-muted text-sm mt-3">
                  Yes. Self-nomination is welcome and encouraged. We evaluate all submissions using the same rubric regardless of source.
                </p>
              </details>
              <details className="border border-subtle rounded p-4">
                <summary className="text-white font-bold cursor-pointer">What if my entity doesn't meet the threshold?</summary>
                <p className="text-muted text-sm mt-3">
                  We may suggest a "watchlist" status for promising entities that don't yet meet minimum criteria. You can resubmit after demonstrating further development.
                </p>
              </details>
              <details className="border border-subtle rounded p-4">
                <summary className="text-white font-bold cursor-pointer">How do you handle conflicts of interest?</summary>
                <p className="text-muted text-sm mt-3">
                  Spirit Protocol-affiliated entities (Solienne, Abraham) are evaluated using the same rubric. All potential conflicts are disclosed on each dossier page. We welcome external review.
                </p>
              </details>
              <details className="border border-subtle rounded p-4">
                <summary className="text-white font-bold cursor-pointer">Can a score be contested?</summary>
                <p className="text-muted text-sm mt-3">
                  Yes. Open a GitHub issue with specific evidence supporting a different assessment. We review contested scores quarterly.
                </p>
              </details>
            </div>
          </section>

          {/* Back Link */}
          <div className="mt-12">
            <Link href="/" className="nav-link">
              ← Back to Index
            </Link>
          </div>
        </article>
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
