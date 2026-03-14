import { getAllAgents, getListedAgents, getAgentById, QUALITY_THRESHOLD } from "@/lib/agents";
import { IndexTable } from "@/app/components/IndexTable";
import { GenesisSection } from "@/app/components/GenesisSection";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";
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
      <Masthead activeLink="index" />

      <main className="container section">
        {/* Genesis Cohort — hidden until showcase date (April 15) */}
        {genesisAgents.length > 0 && genesisSummary && genesisSummary.daysUntilShowcase <= 0 && (
          <GenesisSection
            agents={genesisAgents}
            daysUntilShowcase={genesisSummary.daysUntilShowcase}
            showcaseDate={genesisSummary.showcaseDate}
          />
        )}

        <IndexTable
          agents={agents}
          totalTracked={totalTracked}
          belowThreshold={belowThreshold}
          qualityThreshold={QUALITY_THRESHOLD}
        />
      </main>

      <Footer />
    </div>
  );
}
