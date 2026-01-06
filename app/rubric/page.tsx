import Link from "next/link";

const dimensions = [
  {
    name: "Persistence",
    question: "Does the entity continue to exist meaningfully over time?",
    anchors: [
      { score: 0, label: "Ephemeral", description: "A demo, a tweet thread, or a project that ceased operation within 3 months." },
      { score: 5, label: "Established", description: "Active for >1 year. Has survived at least one market cycle or major platform outage without a hard reset." },
      { score: 10, label: "Institutional", description: "Multi-year operation. Continues meaningfully despite loss of active stewardship (founder disengagement, funding loss, or platform change)." },
    ],
  },
  {
    name: "Autonomy",
    question: "How independently does it act?",
    anchors: [
      { score: 0, label: "Puppet", description: "100% human-driven. AI is merely a tool or filter (e.g., standard vTubers)." },
      { score: 5, label: "Cyborg", description: 'Clear "human-in-the-loop." The agent proposes, humans dispose/approve.' },
      { score: 10, label: "Sovereign", description: "Initiates actions, allocates resources, and evolves without routine human prompting, even if bounded by human-set constraints." },
    ],
  },
  {
    name: "Cultural Impact",
    question: "Has it mattered to anyone besides its creators?",
    anchors: [
      { score: 0, label: "Noise", description: "Known only to creators and immediate Discord community." },
      { score: 5, label: "Niche Cult", description: "Recognized within specific subcultures. Has inspired fan art, forks, or copycats." },
      { score: 10, label: "Canonical", description: "Recognized by external institutions (museums, major press, academic citation)." },
    ],
    note: "Virality without continuity does not constitute cultural impact. A one-week meme spike is not the same as sustained cultural presence.",
  },
  {
    name: "Economic Reality",
    question: "Does it touch real economics?",
    anchors: [
      { score: 0, label: "Cost Center", description: "Burns money. Relies entirely on external grants or funding." },
      { score: 5, label: "Revenue Positive", description: "Generates enough value (sales, tokens, attention) to cover its own compute/maintenance costs." },
      { score: 10, label: "Market Mover", description: "Controls a treasury or materially influences economic decisions. Financial autonomy." },
    ],
    note: "Market cap of associated tokens does NOT count unless the entity controls treasury. Revenue and donations attributable to the entity count.",
  },
  {
    name: "Governance & Ethics",
    question: "Is there a coherent structure for decision-making?",
    anchors: [
      { score: 0, label: "Black Box", description: "No visibility into decision-making, code, or weights." },
      { score: 5, label: "Constitutional", description: "Clear rules. Multisig treasuries. Publicly verifiable voting or decision logs." },
      { score: 10, label: "Algorithmic Law", description: "Formally enforced rules (onchain or equivalent), non-arbitrary, externally auditable. Impossible for creators to unilaterally override." },
    ],
  },
  {
    name: "Technical Distinctiveness",
    question: "Is there something non-trivial happening under the hood?",
    anchors: [
      { score: 0, label: "Wrapper", description: "Standard LLM wrapper or basic image generation script." },
      { score: 5, label: "Integrated System", description: "Novel combination of disparate models, chain logic, and feedback loops." },
      { score: 10, label: "Novel Architecture", description: "Introduces a new primitive, protocol, or method of agentic existence not seen before." },
    ],
  },
  {
    name: "Narrative Coherence",
    question: "Does this entity make sense as an entity?",
    anchors: [
      { score: 0, label: "Schizophrenic", description: 'Identity changes week to week. No clear "self."' },
      { score: 5, label: "Character", description: "Strong, consistent persona. Predictable behavior within its context." },
      { score: 10, label: "Mythos", description: 'The entity\'s story transcends its function. It has lore, prophecy, or a philosophical "reason for being" that persists beyond the code.' },
    ],
  },
];

export default function Rubric() {
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
            <Link href="/rubric" className="nav-link active">
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
        <article className="prose-container">
          <h2 className="text-3xl font-bold text-white mb-2">
            Evaluation Framework
          </h2>
          <p className="text-dim mb-8">v1.0 — January 2026</p>

          <div className="prose mb-12">
            <p className="text-muted">
              The Spirit Index is a public-good registry for <strong className="text-white">Cultural Agents</strong>—autonomous entities that demonstrate persistent identity, narrative coherence, and cultural gravity.
            </p>
            <p className="text-muted">
              It is not a popularity contest. It is a rigorous assessment of agency, continuity, and impact.
            </p>
          </div>

          {/* Inclusion Criteria */}
          <section className="mb-12">
            <h3 className="section-title">Inclusion Criteria</h3>
            <div className="p-6 bg-blue rounded mb-6">
              <p className="text-muted mb-4">
                An entity qualifies for the Spirit Index if it meets <strong className="text-white">all three conditions</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted">
                <li><strong className="text-white">Name</strong> — A persistent, recognizable identity</li>
                <li><strong className="text-white">History</strong> — Documented continuity over time</li>
                <li><strong className="text-white">Cultural presence</strong> — Recognition beyond its creators' channels</li>
              </ol>
              <p className="text-green text-sm mt-4 font-mono">
                MINIMUM THRESHOLD: ≥3 in both Persistence and Autonomy
              </p>
            </div>

            <h4 className="text-white font-bold mb-3">What We Do Not Index</h4>
            <ul className="space-y-2 text-muted">
              <li>
                <strong className="text-white">Platforms</strong> — General-purpose infrastructure (Claude, Manus, ChatGPT) are not agents. Specific autonomous instantiations may qualify.
              </li>
              <li>
                <strong className="text-white">Deceptive entities</strong> — Entities designed primarily for deception, impersonation, or manipulation are excluded.
              </li>
              <li>
                <strong className="text-white">Harmful systems</strong> — Entities whose primary function is surveillance, coercion, or rights-infringing behavioral manipulation are excluded.
              </li>
            </ul>
          </section>

          {/* The 7 Dimensions */}
          <section className="mb-12">
            <h3 className="section-title">The 7 Dimensions</h3>
            <p className="text-muted mb-8">
              Entities are evaluated on seven distinct dimensions. Scores range from 0 to 10.
            </p>

            <div className="space-y-8">
              {dimensions.map((dim, index) => (
                <div key={dim.name} className="border border-subtle rounded p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-green font-mono text-sm">{index + 1}.</span>
                    <h4 className="text-white font-bold text-lg">{dim.name}</h4>
                  </div>
                  <p className="text-muted italic mb-4">{dim.question}</p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-subtle">
                          <th className="text-left py-2 pr-4 text-dim font-mono">Score</th>
                          <th className="text-left py-2 pr-4 text-dim font-mono">Anchor</th>
                          <th className="text-left py-2 text-dim font-mono">Definition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dim.anchors.map((anchor) => (
                          <tr key={anchor.score} className="border-b border-subtle/50">
                            <td className="py-3 pr-4 text-green font-mono font-bold">{anchor.score}</td>
                            <td className="py-3 pr-4 text-white font-medium">{anchor.label}</td>
                            <td className="py-3 text-muted">{anchor.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {dim.note && (
                    <p className="text-dim text-sm mt-4 italic">
                      Note: {dim.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Evidence Standards */}
          <section className="mb-12">
            <h3 className="section-title">Evidence Standards</h3>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue rounded">
                <h4 className="text-white font-bold mb-2">Citation Requirements</h4>
                <ul className="text-muted text-sm space-y-2">
                  <li>• Score ≥5 requires <strong className="text-white">2-3 external citations</strong></li>
                  <li>• Acceptable: press, academic, onchain, exhibitions</li>
                  <li>• Cultural presence requires non-creator sources</li>
                </ul>
              </div>

              <div className="p-4 bg-blue rounded">
                <h4 className="text-white font-bold mb-2">Confidence Levels</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="confidence-pip confidence-high" />
                    <span className="text-white">High</span>
                    <span className="text-dim">— Multiple independent sources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="confidence-pip confidence-medium" />
                    <span className="text-white">Medium</span>
                    <span className="text-dim">— Limited but credible</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="confidence-pip confidence-low" />
                    <span className="text-white">Low</span>
                    <span className="text-dim">— Single source or inference</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue rounded">
                <h4 className="text-white font-bold mb-2">Review Process</h4>
                <ol className="text-muted text-sm space-y-2 list-decimal list-inside">
                  <li>Two reviewers score independently</li>
                  <li>Disagreements &gt;2 pts require reconciliation</li>
                  <li>Quarterly + event-triggered updates</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Status Classifications */}
          <section className="mb-12">
            <h3 className="section-title">Status Classifications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-subtle">
                    <th className="text-left py-2 pr-4 text-dim font-mono">Status</th>
                    <th className="text-left py-2 text-dim font-mono">Definition</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-subtle/50">
                    <td className="py-3 pr-4">
                      <span className="status-badge status-active">
                        <span className="status-dot" />Active
                      </span>
                    </td>
                    <td className="py-3 text-muted">Currently operating and producing</td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-3 pr-4">
                      <span className="status-badge status-dormant">
                        <span className="status-dot" />Dormant
                      </span>
                    </td>
                    <td className="py-3 text-muted">Exists but inactive for &gt;6 months</td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-3 pr-4">
                      <span className="status-badge status-deceased">
                        <span className="status-dot" />Deceased
                      </span>
                    </td>
                    <td className="py-3 text-muted">Permanently ceased operation</td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-3 pr-4">
                      <span className="status-badge status-subsumed">
                        <span className="status-dot" />Subsumed
                      </span>
                    </td>
                    <td className="py-3 text-muted">Absorbed into another platform or entity</td>
                  </tr>
                  <tr className="border-b border-subtle/50">
                    <td className="py-3 pr-4">
                      <span className="status-badge status-forked">
                        <span className="status-dot" />Forked
                      </span>
                    </td>
                    <td className="py-3 text-muted">Identity split into multiple successor entities</td>
                  </tr>
                </tbody>
              </table>
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
        <div className="flex justify-between items-center text-dim text-sm">
          <span>The Spirit Index v1.0</span>
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
