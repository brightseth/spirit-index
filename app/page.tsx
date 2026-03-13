import Link from "next/link";
import { getAllAgents, getListedAgents, getAgentById, QUALITY_THRESHOLD } from "@/lib/agents";
import { IndexTable } from "@/app/components/IndexTable";
import { GenesisSection } from "@/app/components/GenesisSection";
import {
  GENESIS_AGENT_IDS,
  loadGenesisStatus,
  getOnboardingProgress,
  getGenesisSummary,
} from "@/lib/genesis";

export default async function Home() {
  const allAgents = await getAllAgents();
  const agents = await getListedAgents();
  const totalTracked = allAgents.length;
  const belowThreshold = allAgents.filter(a => !a.listed).length;

  // Load Genesis cohort data
  const genesisStatus = loadGenesisStatus();
  const genesisSummary = getGenesisSummary();

  // Build Genesis agents list for the section
  const genesisAgents = genesisStatus
    ? await Promise.all(
        GENESIS_AGENT_IDS.map(async (id) => {
          const agent = await getAgentById(id);
          const gs = genesisStatus.agents[id];
          return {
            id,
            agent,
            artist: gs?.artist ?? "Unknown",
            practiceStreak: gs?.practiceStreak ?? 0,
            onboardingPct: gs ? getOnboardingProgress(gs.onboarding) : 0,
          };
        })
      )
    : [];

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
        {/* Genesis Cohort Highlight */}
        {genesisAgents.length > 0 && genesisSummary && (
          <GenesisSection
            agents={genesisAgents}
            daysUntilShowcase={genesisSummary.daysUntilShowcase}
            showcaseDate={genesisSummary.showcaseDate}
          />
        )}

        <h2 className="section-title">Indexed Entities</h2>

        <IndexTable
          agents={agents}
          totalTracked={totalTracked}
          belowThreshold={belowThreshold}
          qualityThreshold={QUALITY_THRESHOLD}
        />

        <p className="text-muted text-sm mt-8">
          Click column headers to sort. Last updated: March 2026.
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
