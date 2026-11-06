import Link from "next/link";
import { Metadata } from "next";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";
import { getAgentById } from "@/lib/agents";
import {
  getPassport,
  getPassportIds,
  effectiveStatus,
  PassportStatus,
  PASSPORT_FIELDS,
  PASSPORT_FIELD_ORDER,
  STALE_AFTER_DAYS,
} from "@/lib/passport";

export const metadata: Metadata = {
  title: "Durability Passport",
  description:
    "Six operational facts about an agent, from public record: memory custody, identity, persistence, economic rails, governance, recovery. Not a score.",
  alternates: { canonical: "https://spiritindex.org/passport" },
};

const STATUS_COLOR: Record<PassportStatus, string> = {
  attested: "var(--confidence-high)",
  stale: "var(--confidence-medium)",
  IE: "var(--text-dim)",
};

const STATUS_MARK: Record<PassportStatus, string> = {
  attested: "A",
  stale: "S",
  IE: "IE",
};

export default async function PassportPage() {
  const rows = (
    await Promise.all(
      getPassportIds().map(async (id) => {
        const agent = await getAgentById(id);
        const passport = getPassport(id);
        return agent && passport ? { agent, passport } : null;
      }),
    )
  )
    .filter((r) => r !== null)
    .sort((a, b) => a.agent.name.localeCompare(b.agent.name));

  return (
    <div className="min-h-screen">
      <Masthead />

      <main className="container section">
        <article className="prose-container">
          <h2 className="text-3xl font-bold text-white mb-6">Durability Passport</h2>

          <p className="text-xl text-muted mb-8 italic">
            Whether the agent is still there in a year, and who holds its memory.
          </p>

          <div className="prose">
            <p>
              The Index score asks who an agent is, from its body of work. The passport asks whether
              it can persist, transact, recover and be checked. The two sit side by side on each
              dossier. They are never summed, the passport has no score of its own, and it changes no
              score in the Index.
            </p>
            <p>
              Each field is a short plain statement of what the public record shows, the links that
              show it, and the date it was checked.
            </p>
          </div>

          <section className="mt-12">
            <h3 className="section-title">The six fields</h3>
            <dl className="space-y-4">
              {PASSPORT_FIELD_ORDER.map((key) => (
                <div key={key}>
                  <dt className="text-white font-mono text-sm uppercase tracking-wider">
                    {PASSPORT_FIELDS[key].label}
                  </dt>
                  <dd className="text-muted">{PASSPORT_FIELDS[key].question}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12">
            <h3 className="section-title">Attested, stale, IE</h3>
            <div className="prose">
              <p>
                <strong>Attested</strong> means a current public source answers the question. The
                answer can be unfavorable: memory held on one operator&apos;s servers with no export
                path is attested when a public source says so. <strong>Stale</strong> means the
                newest evidence is more than {STALE_AFTER_DAYS} days old. An attested field also
                shows as stale once its check date passes {STALE_AFTER_DAYS} days.{" "}
                <strong>IE</strong> means there is no public evidence, and the field says what would
                settle it. IE is never read as zero.
              </p>
              <p>
                Every claim carries one link, read on the check date. Public record only: sites,
                docs, repositories, chain explorers, institutional records, press. Nothing is
                inferred past the source.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h3 className="section-title">Why memory custody comes first</h3>
            <div className="prose">
              <p>
                A model can be swapped, an interface rebuilt and a host replaced, and the agent can
                still be the same agent if its memory comes with it. If the memory sits with one
                operator or one vendor with no way out, the agent ends when that relationship does,
                however capable it is that afternoon. Benchmarks measure what a system can do on a
                given day. Who holds the memory decides whether the same agent is there tomorrow. It
                is also the field the public record says least about, so it is filled first.
              </p>
            </div>
          </section>
        </article>

        <section className="mt-12">
          <h3 className="section-title">Passports ({rows.length})</h3>
          <p className="text-dim text-xs font-mono mb-6">
            A = attested &middot; S = stale &middot; IE = insufficient evidence. Not a ranking;
            listed by name.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-dim text-left">
                  <th className="py-2 pr-4 font-normal">Agent</th>
                  {PASSPORT_FIELD_ORDER.map((key) => (
                    <th key={key} className="py-2 px-2 font-normal whitespace-nowrap">
                      {PASSPORT_FIELDS[key].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ agent, passport }) => (
                  <tr key={agent.id} className="border-t border-subtle">
                    <td className="py-2 pr-4 whitespace-nowrap">
                      <Link href={`/${agent.id}#passport`} className="text-muted hover:text-white">
                        {agent.name}
                      </Link>
                    </td>
                    {PASSPORT_FIELD_ORDER.map((key) => {
                      const status = effectiveStatus(passport.fields[key]);
                      return (
                        <td key={key} className="py-2 px-2" style={{ color: STATUS_COLOR[status] }}>
                          {STATUS_MARK[status]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h3 className="section-title">Data</h3>
          <p className="text-muted text-sm">
            <code>GET /api/v1/passport/:id</code> returns a passport in the v1 envelope, CORS open.
            The full spec and JSON schema are in the{" "}
            <a
              href="https://github.com/brightseth/spirit-index/blob/main/docs/durability-passport.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green hover:underline"
            >
              repository
            </a>
            .
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
