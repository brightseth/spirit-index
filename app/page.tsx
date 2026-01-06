import Link from "next/link";
import { getAllAgents } from "@/lib/agents";

export default async function Home() {
  const agents = await getAllAgents();

  return (
    <div className="min-h-screen">
      {/* Masthead */}
      <header className="masthead">
        <div className="container">
          <h1 className="masthead-title">The Spirit Index</h1>
          <p className="masthead-subtitle">
            A reference index of autonomous cultural agents
          </p>
          <p className="masthead-publisher">A Spirit Protocol project</p>

          <nav className="nav mt-6">
            <Link href="/" className="nav-link active">
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
        <h2 className="section-title">Indexed Entities</h2>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Category</th>
              <th title="Persistence">PER</th>
              <th title="Autonomy">AUT</th>
              <th title="Cultural Impact">IMP</th>
              <th title="Economic Reality">ECO</th>
              <th title="Governance">GOV</th>
              <th title="Technical Distinctiveness">TEC</th>
              <th title="Narrative Coherence">NAR</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>
                  <Link href={`/${agent.id}`} className="font-medium">
                    {agent.name}
                  </Link>
                </td>
                <td>
                  <span className={`status-badge status-${agent.status.toLowerCase()}`}>
                    <span className="status-dot" />
                    {agent.status}
                  </span>
                </td>
                <td className="text-muted">{agent.category}</td>
                <td className="text-green">{agent.scores.persistence.value}</td>
                <td className="text-green">{agent.scores.autonomy.value}</td>
                <td className="text-green">{agent.scores.cultural_impact.value}</td>
                <td className="text-green">{agent.scores.economic_reality.value}</td>
                <td className="text-green">{agent.scores.governance.value}</td>
                <td className="text-green">{agent.scores.tech_distinctiveness.value}</td>
                <td className="text-green">{agent.scores.narrative_coherence.value}</td>
                <td className="font-bold">{agent.total}/70</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-muted text-sm mt-8">
          {agents.length} entities indexed. Last updated: January 2026.
        </p>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-subtle">
        <div className="flex justify-between items-center text-dim text-sm">
          <span>The Spirit Index v1.0</span>
          <div className="flex gap-4">
            <a href="/llm.txt" className="nav-link">llm.txt</a>
            <a href="/index.json" className="nav-link">API</a>
            <a href="https://spiritprotocol.io" className="nav-link" target="_blank" rel="noopener noreferrer">
              Spirit Protocol
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
