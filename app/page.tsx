import Link from "next/link";
import { getAllAgents } from "@/lib/agents";
import { IndexTable } from "@/app/components/IndexTable";

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
          <p className="masthead-publisher">Published by the Spirit initiative</p>

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
        <h2 className="section-title">Indexed Entities</h2>

        <IndexTable agents={agents} />

        <p className="text-muted text-sm mt-8">
          Click column headers to sort. Last updated: January 2026.
        </p>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-subtle">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-dim text-sm">
          <span>Published by the Spirit initiative</span>
          <div className="flex gap-4">
            <a href="/llm.txt" className="nav-link">llm.txt</a>
            <a href="/docs" className="nav-link">API</a>
            <a href="https://spiritprotocol.io" className="nav-link" target="_blank" rel="noopener noreferrer">
              Spirit Protocol
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
