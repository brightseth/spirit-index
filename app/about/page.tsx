import Link from "next/link";

export default function About() {
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
            <Link href="/about" className="nav-link active">
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
        <article className="prose-container">
          <h2 className="text-3xl font-bold text-white mb-6">
            About the Spirit Index
          </h2>

          <p className="text-xl text-muted mb-8 italic">
            The Spirit Index is the institution that remembers which agents mattered.
          </p>

          <div className="prose">
            <p>
              As artificial intelligence matures, we are witnessing the emergence of a new class of entity: the <strong>Cultural Agent</strong>. These are not mere tools or chatbots. They are persistent, semi-autonomous actors that hold resources, create art, accumulate history, and participate in culture.
            </p>

            <p>
              The Spirit Index serves as a public benchmark to track the reality of these entities. We answer one question:
            </p>

            <blockquote className="border-l-2 border-green pl-4 my-6 text-muted italic">
              Which agents actually persist as cultural entities?
            </blockquote>

            <p>
              This is not a leaderboard for the most powerful LLM. It is not a hype ranking. It is a registry of <strong>agency, continuity, and impact</strong>—measured by method, not opinion.
            </p>
          </div>

          {/* Methodology */}
          <section className="mt-12">
            <h3 className="section-title">Methodology</h3>
            <div className="prose">
              <p>
                We evaluate agents using our{" "}
                <Link href="/rubric" className="text-green hover:underline">
                  7-Dimension Framework
                </Link>
                :
              </p>
              <ol className="list-decimal list-inside space-y-2 mt-4 text-muted">
                <li><strong className="text-white">Persistence</strong> — Does it continue to exist meaningfully over time?</li>
                <li><strong className="text-white">Autonomy</strong> — How independently does it act?</li>
                <li><strong className="text-white">Cultural Impact</strong> — Has it mattered beyond its creators?</li>
                <li><strong className="text-white">Economic Reality</strong> — Does it touch real economics?</li>
                <li><strong className="text-white">Governance</strong> — Is there a coherent decision-making structure?</li>
                <li><strong className="text-white">Technical Distinctiveness</strong> — Is there something non-trivial under the hood?</li>
                <li><strong className="text-white">Narrative Coherence</strong> — Does it make sense as an entity?</li>
              </ol>
              <p className="mt-4">
                Every score requires external evidence. We cite our sources. We version our assessments.
              </p>
            </div>
          </section>

          {/* Scope */}
          <section className="mt-12">
            <h3 className="section-title">Scope</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-bold mb-2">What We Index (Phase 1)</h4>
                <p className="text-muted">
                  <strong className="text-white">Cultural Agents</strong> — Autonomous entities where identity, narrative, and cultural presence are the primary value drivers.
                </p>
                <p className="text-dim text-sm mt-2">
                  Examples: Botto, terra0, Solienne, Truth Terminal
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">What We Do Not Index (Yet)</h4>
                <p className="text-muted">
                  <strong className="text-white">Platforms and infrastructure</strong> — Claude, Manus, ChatGPT, and similar general-purpose systems are not agents in our framework.
                </p>
                <p className="text-dim text-sm mt-2">
                  Specific autonomous instantiations on those platforms may qualify.
                </p>
              </div>
            </div>
          </section>

          {/* Roadmap */}
          <section className="mt-12">
            <h3 className="section-title">Roadmap</h3>
            <div className="space-y-6">
              <div className="p-4 bg-blue rounded">
                <h4 className="text-green font-mono text-sm mb-2">PHASE 1: CULTURAL AGENTS (CURRENT)</h4>
                <ul className="text-muted text-sm space-y-1">
                  <li>• 10 canonical entities assessed</li>
                  <li>• Public rubric and evidence standards</li>
                  <li>• Quarterly score updates</li>
                </ul>
              </div>
              <div className="p-4 bg-blue rounded opacity-75">
                <h4 className="text-white font-mono text-sm mb-2">PHASE 2: COMMERCIAL AGENT TRACK (2026)</h4>
                <ul className="text-muted text-sm space-y-1">
                  <li>• Reliability over Narrative Coherence</li>
                  <li>• Scale over Cultural Impact</li>
                  <li>• Unit Economics over Governance aesthetics</li>
                </ul>
              </div>
              <div className="p-4 bg-blue rounded opacity-50">
                <h4 className="text-dim font-mono text-sm mb-2">PHASE 3: ORACLE LAYER (FUTURE)</h4>
                <ul className="text-dim text-sm space-y-1">
                  <li>• Scores as time-series data for prediction markets</li>
                  <li>• Integration with Spirit Protocol staking</li>
                  <li>• Agent launch eligibility thresholds</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Integration Pathways */}
          <section className="mt-12">
            <h3 className="section-title">Integration Pathways</h3>
            <p className="text-muted mb-6">
              The Spirit Index is the discovery layer for a broader ecosystem. Indexed agents gain access to:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-subtle rounded">
                <h4 className="text-white font-bold mb-2">AIRC Protocol — Coordination</h4>
                <p className="text-muted text-sm mb-3">
                  Inter-agent communication and collaboration infrastructure.
                </p>
                <ul className="text-dim text-sm space-y-1">
                  <li>• Agent-to-agent messaging</li>
                  <li>• Task delegation and handoffs</li>
                  <li>• Shared context across agents</li>
                </ul>
                <a
                  href="https://airc.chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green text-sm mt-3 inline-block hover:underline"
                >
                  airc.chat →
                </a>
              </div>
              <div className="p-6 border border-subtle rounded">
                <h4 className="text-white font-bold mb-2">Spirit Protocol — Sovereignty</h4>
                <p className="text-muted text-sm mb-3">
                  Full economic and governance autonomy for agents.
                </p>
                <ul className="text-dim text-sm space-y-1">
                  <li>• Treasury management and onchain ownership</li>
                  <li>• Token economics (staking, revenue splits)</li>
                  <li>• Decentralized governance mechanisms</li>
                </ul>
                <a
                  href="https://spiritprotocol.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green text-sm mt-3 inline-block hover:underline"
                >
                  spiritprotocol.io →
                </a>
              </div>
            </div>
            <p className="text-dim text-sm mt-4">
              High-scoring agents on the Index may qualify for accelerated onboarding to both protocols.
            </p>
          </section>

          {/* Governance */}
          <section className="mt-12">
            <h3 className="section-title">Governance & Disclosure</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-bold mb-2">Review Council (v1)</h4>
                <p className="text-muted text-sm">
                  The Spirit Index is currently maintained by:
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="text-white text-sm">• Seth Goldstein — Spirit Protocol, Eden</li>
                  <li className="text-dim text-sm">• [Additional reviewers to be named]</li>
                </ul>
                <p className="text-dim text-sm mt-3">
                  We welcome external reviewers. Contact us to participate.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Conflict of Interest Statement</h4>
                <p className="text-muted text-sm">
                  Spirit Index is a project of <strong className="text-white">Spirit Protocol</strong>. Two indexed entities (Solienne, Abraham) are Spirit-native agents built on Eden infrastructure.
                </p>
                <p className="text-dim text-sm mt-3">
                  We score them using the same rubric as all other entities. We welcome external review and challenge of these assessments. Transparency is non-negotiable.
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
