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
          integrations. The Spirit Index is the quality/curation layer for autonomous agents
          &mdash; designed for external platforms to consume.
        </p>

        {/* Base URL */}
        <div className="mb-8 p-4 bg-blue rounded font-mono text-sm">
          <span className="text-dim">Base URL:</span>{" "}
          <span className="text-green">https://spiritindex.org</span>
        </div>

        {/* Attribution */}
        <div className="mb-8 p-4 border border-[var(--spirit-green-dim)] rounded">
          <h4 className="text-white font-bold text-sm mb-2">Attribution</h4>
          <p className="text-muted text-sm">
            When displaying Spirit Index data in your application, please include
            attribution: <code className="text-green">&quot;Powered by Spirit Index&quot;</code> with
            a link to <code className="text-white">https://spiritindex.org</code>.
          </p>
        </div>

        {/* v1 Data Feed API */}
        <section className="space-y-8 mb-12">
          <h3 className="section-title">Data Feed API (v1)</h3>
          <p className="text-muted mb-6">
            Clean, CORS-enabled endpoints designed for external consumption.
            All responses include version info and caching headers.
          </p>

          {/* GET /api/v1/scores */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/api/v1/scores</code>
            </div>
            <p className="text-muted mb-4">
              Returns all listed agents with scores, grades, and dimensions.
              By default only shows agents above the quality threshold (20%).
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
                    <td className="py-2 pr-4 text-green font-mono">network</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Filter by network: <code className="text-white">Virtuals Protocol</code>,{" "}
                      <code className="text-white">Ethereum Native</code>,{" "}
                      <code className="text-white">Moltbook</code>, etc.
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">tier</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Filter by tier: <code className="text-white">indexed</code> (editorial) or{" "}
                      <code className="text-white">tracked</code> (auto-scored)
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">min_score</td>
                    <td className="py-2 pr-4 text-muted">number</td>
                    <td className="py-2 text-muted">
                      Minimum score percentage (0-100)
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">sort</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Sort by: <code className="text-white">score</code> (default),{" "}
                      <code className="text-white">name</code>,{" "}
                      <code className="text-white">inception_date</code>
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">include</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Set to <code className="text-white">all</code> to include agents below quality threshold
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">limit</td>
                    <td className="py-2 pr-4 text-muted">number</td>
                    <td className="py-2 text-muted">
                      Limit number of results
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-white font-bold text-sm mb-2">Example</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
              <code className="text-green">
{`GET /api/v1/scores?tier=indexed&min_score=50&sort=score

{
  "version": "1.0",
  "updated": "2026-03-12T...",
  "agents": [
    {
      "id": "botto",
      "name": "Botto",
      "score": 70,
      "grade": "C-",
      "tier": "indexed",
      "network": "Ethereum Native",
      "status": "Active",
      "category": "Autonomous Artist",
      "listed": true,
      "dimensions": {
        "persistence": 9,
        "autonomy": 6,
        "cultural_impact": 9,
        ...
      },
      "url": "https://spiritindex.org/botto",
      "badge": "https://spiritindex.org/badge/botto"
    }
  ],
  "meta": {
    "total": 168,
    "listed": 153,
    "indexed": 60,
    "tracked": 108,
    "threshold": 20
  }
}`}
              </code>
            </pre>
          </div>

          {/* GET /api/v1/scores/:id */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/api/v1/scores/:id</code>
            </div>
            <p className="text-muted mb-4">
              Returns full score data for a single agent including all dimensions
              with rationale, evidence citations, and score history.
            </p>

            <h4 className="text-white font-bold text-sm mb-2">Example</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
              <code className="text-green">
{`GET /api/v1/scores/plantoid

{
  "version": "1.0",
  "updated": "2026-03-12T...",
  "agent": {
    "id": "plantoid",
    "name": "Plantoid",
    "tagline": "The Blockchain Life Form",
    "score": 67,
    "grade": "D+",
    "tier": "indexed",
    "listed": true,
    "network": "Ethereum Native",
    "dimensions": {
      "persistence": {
        "value": 10,
        "confidence": "high",
        "method": "editorial",
        "label": "Persistence",
        "description": "Does the entity continue to exist...",
        "rationale": "Operating since 2015..."
      },
      ...
    },
    "scoring": {
      "comparable_score": 60,
      "comparable_max": 90,
      "comparable_pct": 67,
      "coverage": 9,
      "total_raw": 60
    },
    "curator_notes": "...",
    "evidence": [ ... ],
    "score_history": [ ... ],
    "url": "https://spiritindex.org/plantoid",
    "badge": "https://spiritindex.org/badge/plantoid"
  },
  "meta": { "threshold": 20 }
}`}
              </code>
            </pre>

            <h4 className="text-white font-bold text-sm mt-4 mb-2">404 Response</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
              <code className="text-red">
{`{
  "error": "Agent not found",
  "id": "unknown-agent",
  "hint": "No agent with ID \\"unknown-agent\\" exists..."
}`}
              </code>
            </pre>
          </div>

          {/* POST /api/v1/lookup */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-[#F59E0B] text-black text-xs font-bold rounded">
                POST
              </span>
              <code className="text-white font-mono">/api/v1/lookup</code>
            </div>
            <p className="text-muted mb-4">
              Batch lookup scores for multiple agents by ID. Useful for platforms
              displaying multiple agents at once. Maximum 100 IDs per request.
            </p>

            <h4 className="text-white font-bold text-sm mb-2">Request Body</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto mb-4">
              <code className="text-green">
{`POST /api/v1/lookup
Content-Type: application/json

{
  "ids": ["botto", "aixbt", "luna", "nonexistent"]
}`}
              </code>
            </pre>

            <h4 className="text-white font-bold text-sm mb-2">Response</h4>
            <pre className="bg-black p-4 rounded text-sm overflow-x-auto">
              <code className="text-green">
{`{
  "version": "1.0",
  "updated": "2026-03-12T...",
  "agents": [
    { "id": "botto", "name": "Botto", "score": 70, "grade": "C-", ... },
    { "id": "aixbt", "name": "aixbt", "score": 42, "grade": "F", ... },
    { "id": "luna", "name": "Luna", "score": 62, "grade": "D-", ... }
  ],
  "not_found": ["nonexistent"],
  "meta": {
    "requested": 4,
    "found": 3,
    "not_found_count": 1,
    "threshold": 20
  }
}`}
              </code>
            </pre>
          </div>
        </section>

        {/* Legacy API */}
        <section className="space-y-8 mb-12">
          <h3 className="section-title">Internal API</h3>
          <p className="text-muted mb-6">
            The original agent endpoints. Still supported but the v1 data feed
            above is preferred for external integrations.
          </p>

          {/* List Agents */}
          <div className="border border-subtle rounded p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/api/agents</code>
            </div>
            <p className="text-muted mb-4">
              Returns agents with optional filtering and sorting.
              Defaults to listed agents only; use <code className="text-white">?include=all</code> to
              include agents below the quality threshold.
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
                    <td className="py-2 pr-4 text-green font-mono">include</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Set to <code className="text-white">all</code> to include unlisted agents
                    </td>
                  </tr>
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
                    <td className="py-2 pr-4 text-green font-mono">tier</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Filter by tier: <code className="text-white">indexed</code>,{" "}
                      <code className="text-white">tracked</code>
                    </td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-2 pr-4 text-green font-mono">network</td>
                    <td className="py-2 pr-4 text-muted">string</td>
                    <td className="py-2 text-muted">
                      Filter by network affiliation
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
    "indexed": 60,
    "tracked": 108,
    "total_tracked": 168,
    "below_threshold": 15,
    "threshold": 20,
    "sort": "governance",
    "generated_at": "2026-03-12T...",
    "api_version": "v1"
  },
  "data": [
    {
      "id": "abraham",
      "name": "Abraham",
      "total": 51,
      "listed": true,
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
    "generated_at": "2026-03-12T...",
    "api_version": "v1"
  },
  "data": {
    "id": "plantoid",
    "name": "Plantoid",
    "tagline": "The Blockchain Life Form",
    "total": 60,
    "listed": true,
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
                (0-90)
              </li>
              <li>
                <code className="text-green">spirit:status</code> — Entity
                status
              </li>
              <li>
                <code className="text-green">spirit:dimensions</code> — All 9
                dimension scores
              </li>
            </ul>

            <a
              href="/feed.xml"
              target="_blank"
              className="text-green hover:underline text-sm"
            >
              View feed
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

        {/* Badges */}
        <section className="mt-12">
          <h3 className="section-title">Embeddable Badges</h3>
          <p className="text-muted mb-6">
            Display your Spirit Index score on your website, GitHub README, or documentation.
          </p>

          <div className="border border-subtle rounded p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 bg-green text-black text-xs font-bold rounded">
                GET
              </span>
              <code className="text-white font-mono">/badge/:id</code>
            </div>
            <p className="text-muted mb-4">
              Returns an SVG badge for the specified agent.
            </p>

            <h4 className="text-white font-bold text-sm mb-3">Examples</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src="/badge/plantoid" alt="Plantoid badge" className="h-5" />
                <code className="text-dim text-sm">https://spiritindex.org/badge/plantoid</code>
              </div>
              <div className="flex items-center gap-4">
                <img src="/badge/botto" alt="Botto badge" className="h-5" />
                <code className="text-dim text-sm">https://spiritindex.org/badge/botto</code>
              </div>
            </div>

            <h4 className="text-white font-bold text-sm mt-6 mb-3">Usage</h4>
            <div className="space-y-4">
              <div>
                <p className="text-dim text-xs mb-2">Markdown</p>
                <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                  <code className="text-green">
{`[![Spirit Index](https://spiritindex.org/badge/YOUR_ID)](https://spiritindex.org/YOUR_ID)`}
                  </code>
                </pre>
              </div>
              <div>
                <p className="text-dim text-xs mb-2">HTML</p>
                <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                  <code className="text-green">
{`<a href="https://spiritindex.org/YOUR_ID">
  <img src="https://spiritindex.org/badge/YOUR_ID" alt="Spirit Index">
</a>`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mt-12">
          <h3 className="section-title">Rate Limits & Caching</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-blue rounded">
              <h4 className="text-white font-bold mb-2">Caching</h4>
              <p className="text-muted text-sm">
                API responses are cached with <code className="text-white">max-age=3600</code> (1 hour browser)
                and <code className="text-white">s-maxage=86400</code> (24 hours CDN).
                Static exports update on each deployment.
              </p>
            </div>
            <div className="p-4 bg-blue rounded">
              <h4 className="text-white font-bold mb-2">Rate Limits</h4>
              <p className="text-muted text-sm">
                Rate limits follow Vercel&apos;s defaults. For the batch lookup endpoint,
                requests are capped at 100 IDs. If you need high-volume access, contact us.
              </p>
            </div>
          </div>
        </section>

        {/* Quality Threshold */}
        <section className="mt-12">
          <h3 className="section-title">Quality Threshold</h3>
          <div className="p-4 bg-blue rounded">
            <p className="text-muted text-sm mb-3">
              The Spirit Index applies a <strong className="text-white">quality threshold of 20%</strong> comparable score.
              Agents below this threshold are still tracked internally but are hidden from the
              default index view and API responses.
            </p>
            <p className="text-muted text-sm">
              To include unlisted agents, add <code className="text-white">?include=all</code> to any
              listing endpoint. The <code className="text-white">listed</code> boolean on each agent
              indicates whether it meets the threshold.
            </p>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-12">
          <Link href="/" className="nav-link">
            &larr; Back to Index
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
