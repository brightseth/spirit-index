import { getAllAgents } from "@/lib/agents";
import { IndexTable } from "@/app/components/IndexTable";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";

export default async function Home() {
  const allAgents = await getAllAgents();
  const agents = allAgents.filter(a => a.listed);

  return (
    <div className="min-h-screen">
      <Masthead activeLink="index" />

      <main className="container section">
        <IndexTable
          agents={agents}
          totalTracked={allAgents.length}
        />
      </main>

      <Footer />
    </div>
  );
}
