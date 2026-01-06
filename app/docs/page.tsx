import Link from "next/link";

export const metadata = {
  title: "API Documentation | Spirit Index",
  description: "Programmatic access to Spirit Index data via REST API",
};

export default function APIDocs() {
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
        <h2 className="text-3xl font-bold text-white mb-2">API Documentation</h2>
        <p className="text-muted mb-8">
          Programmatic access to Spirit Index data for agents, dashboards, and
          integrations.
        </p>

        {/* Base URL */}
        <div className="mb-8 p-4 bg-blue rounded font-mono text-sm">
          <span className="text-dim">Base URL:</span>{" "}
          <span className="text-green">https://spiritindex.org</span>
        </div>

        {/* Endpoints */}
        <section className="space-y-8">
          {/* List Agents */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/api/agents</code>
            </div>
            <p className="text-muted mb-4">
              Returns all indexed agents with optional filtering and sorting.
            </p>

            <h4 className="text-white font-bold text-sm mb-2">
              Query Parameters
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-left py-2 pr-4 text-dim">Parameter</th>
                    <th className="text-left py-2 pr-4 text-dim">Type</th>
                    <th className="text-left py-2 text-dim">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">sort</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Sort by: <code className="text-white">total</code>,{" "}
                      <code className="text-white">persistence</code>,{" "}
                      <code className="text-white">autonomy</code>,{" "}
                      <code className="text-white">cultural_impact</code>,{" "}
                      <code className="text-white">economic_reality</code>,{" "}
                      <code className="text-white">governance</code>,{" "}
                      <code className="text-white">tech_distinctiveness</code>,{" "}
                      <code className="text-white">narrative_coherence</code>,{" "}
                      <code className="text-white">name</code>,{" "}
                      <code className="text-white">inception_date</code>
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">status</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Filter by status:{" "}
                      <code className="text-white">Active</code>,{" "}
                      <code className="text-white">Dormant</code>,{" "}
                      <code className="text-white">Deceased</code>
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">category</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Filter by category (partial match)
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">limit</td>
                    <td className="py-2 pr-4 text-muted">number</td>
                    <td className="py-2 text-muted">
                      Limit number of results
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">fields</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Comma-separated list of fields to include
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-white font-bold text-sm mb-2">Example</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
              <code className="text-green">
{`GET /api/agents?sort=governance&status=Active&limit=5

{
  "meta": {
    "total": 5,
    "sort": "governance",
    "generated_at": "2026-01-06T...",
    "api_version": "v1"
  },
  "data": [
    {
      "id": "abraham",
      "name": "Abraham",
      "total": 51,
      "scores": { ... }
    },
    ...
  ]
}`}
              </code>
            </pre>
          </div>

          {/* Single Agent */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/api/agents/:id</code>
            </div>
            <p className="text-muted mb-4">
              Returns a single agent by ID with full dossier data.
            </p>

            <h4 className="text-white font-bold text-sm mb-2">Example</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
              <code className="text-green">
{`GET /api/agents/plantoid

{
  "meta": {
    "generated_at": "2026-01-06T...",
    "api_version": "v1"
  },
  "data": {
    "id": "plantoid",
    "name": "Plantoid",
    "tagline": "The Blockchain Life Form",
    "total": 60,
    "scores": {
      "persistence": { "value": 10, "confidence": "high" },
      ...
    },
    "score_rationale": {
      "persistence": "Operating since 2015...",
      ...
    },
    "evidence": [ ... ],
    "score_history": [ ... ]
  }
}`}
              </code>
            </pre>
          </div>

          {/* RSS Feed */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/feed.xml</code>
            </div>
            <p className="text-muted mb-4">
              RSS 2.0 feed of all indexed agents, sorted by most recent score
              update. Includes custom <code className="text-white">spirit:</code>{" "}
              namespace with score data.
            </p>

            <h4 className="text-white font-bold text-sm mb-2">
              Custom Elements
            </h4>
            <ul className="text-muted text-sm space-y-1 mb-4">
              <li>
                <code className="text-green">spirit:total</code> — Total score
                (0-70)
              </li>
              <li>
                <code className="text-green">spirit:status</code> — Entity
                status
              </li>
              <li>
                <code className="text-green">spirit:dimensions</code> — All 7
                dimension scores
              </li>
            </ul>

            <a
              href="/feed.xml"
              target="_blank"
              className="text-green hover:underline text-sm"
            >
              View feed →
            </a>
          </div>

          {/* Static Exports */}
          <div className="border border-subtle rounded p-6">
            <h3 className="text-white font-bold mb-4">Static Exports</h3>
            <p className="text-muted mb-4">
              Pre-generated files for LLM consumption and static integrations:
            </p>

            <ul className="space-y-3">
              <li>
                <a
                  href="/llm.txt"
                  target="_blank"
                  className="text-green hover:underline font-mono"
                >
                  /llm.txt
                </a>
                <span className="text-dim"> — </span>
                <span className="text-muted">
                  Plain text summary for LLM context windows
                </span>
              </li>
              <li>
                <a
                  href="/index.json"
                  target="_blank"
                  className="text-green hover:underline font-mono"
                >
                  /index.json
                </a>
                <span className="text-dim"> — </span>
                <span className="text-muted">
                  Full index data as static JSON
                </span>
              </li>
              <li>
                <a
                  href="/rubric.json"
                  target="_blank"
                  className="text-green hover:underline font-mono"
                >
                  /rubric.json
                </a>
                <span className="text-dim"> — </span>
                <span className="text-muted">
                  Evaluation framework as JSON
                </span>
              </li>
              <li>
                <a
                  href="/submit.json"
                  target="_blank"
                  className="text-green hover:underline font-mono"
                >
                  /submit.json
                </a>
                <span className="text-dim"> — </span>
                <span className="text-muted">
                  Submission protocol for agents
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mt-12">
          <h3 className="section-title">Rate Limits & Caching</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue rounded">
              <h4 className="text-white font-bold mb-2">Caching</h4>
              <p className="text-muted text-sm">
                API responses are cached for 1 hour with stale-while-revalidate.
                Static exports update on each deployment.
              </p>
            </div>
            <div className="p-4 bg-blue rounded">
              <h4 className="text-white font-bold mb-2">Rate Limits</h4>
              <p className="text-muted text-sm">
                No rate limits currently. Please be respectful. If you need
                high-volume access, contact us.
              </p>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-12">
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
