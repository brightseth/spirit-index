import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";
import { PassportFieldList } from "@/app/components/PassportSection";
import { getAgentById } from "@/lib/agents";
import {
  getPassport,
  getPassportIds,
  getPlatformIds,
  getPlatformPassport,
  lastChecked,
  PASSPORT_FIELD_ORDER,
  PLATFORM_QUESTIONS,
} from "@/lib/passport";
import { extractDomain } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getPlatformIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const platform = getPlatformPassport(id);
  if (!platform) return { title: "Platform Not Found" };
  return {
    title: `${platform.name}: platform passport`,
    description: `Durability Passport for ${platform.name}: where an agent's memory lives, its door, persistence, economic rails, governance and recovery, from the platform's own documentation.`,
    alternates: { canonical: `https://spiritindex.org/passport/platform/${platform.id}` },
  };
}

export default async function PlatformPassportPage({ params }: Props) {
  const { id } = await params;
  const platform = getPlatformPassport(id);
  if (!platform) notFound();

  const agents = (
    await Promise.all(
      getPassportIds()
        .filter((agentId) => getPassport(agentId)?.platform === platform.id)
        .map((agentId) => getAgentById(agentId)),
    )
  ).filter((a) => a !== null);

  const rows = PASSPORT_FIELD_ORDER.map((key) => ({
    key,
    question: PLATFORM_QUESTIONS[key],
    field: platform.fields[key],
  }));

  return (
    <div className="min-h-screen">
      <Masthead />

      <main className="container section">
        <div className="text-dim text-xs font-mono mb-12 tracking-wider">
          <Link href="/passport" className="text-dim hover:text-muted">Passport</Link>
          <span className="mx-2">/</span>
          <span className="text-muted">Platforms</span>
          <span className="mx-2">/</span>
          <span className="text-muted">{platform.name}</span>
        </div>

        <div className="mb-12">
          <h2 className="agent-name">{platform.name}</h2>
          <p className="agent-tagline">Platform passport</p>
          <p className="text-dim text-xs font-mono">
            Run by {platform.operator} &middot;{" "}
            <a href={platform.website} target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white">
              {extractDomain(platform.website)}
            </a>{" "}
            &middot; Last checked {lastChecked(platform)}
          </p>
        </div>

        <div className="mb-12">
          <h3 className="section-title">Durability Passport</h3>
          <p className="text-dim text-xs font-mono mb-8">
            The six passport questions, answered from the platform&apos;s own documentation. An agent
            that runs here inherits these answers for any field its own public record leaves
            unanswered. Not a score.
          </p>
          <PassportFieldList rows={rows} />
        </div>

        {agents.length > 0 && (
          <div className="mb-12">
            <h3 className="section-title">Agents in the Index on {platform.name}</h3>
            <ul className="space-y-1 text-sm font-mono">
              {agents.map((a) => (
                <li key={a.id}>
                  <Link href={`/${a.id}#passport`} className="text-muted hover:text-white">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12">
          <Link href="/passport" className="nav-link text-xs">
            &larr; All passports
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
