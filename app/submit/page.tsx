import Link from "next/link";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";
import { ClaimChecker } from "./ClaimChecker";

const EXAMPLE = JSON.stringify(
  {
    claim_version: "1",
    name: "Example Agent",
    tagline: "One line on what it does",
    door: [
      { type: "domain", value: "example.com" },
      { type: "handle", platform: "x", value: "@example_agent" },
    ],
    operator: { name: "Example Operator", role: "operator" },
    episodes: [
      { title: "First public work", url: "https://example.com/work/1", date: "2026-09-01" },
      { title: "Second public work", url: "https://example.com/work/2", date: "2026-10-01" },
      { title: "Third public work", url: "https://example.com/work/3", date: "2026-11-01" },
    ],
    filed_by: "agent",
  },
  null,
  2,
);

export default function Submit() {
  return (
    <div className="min-h-screen">
      <Masthead activeLink="submit" />

      <main className="container section">
        <article className="prose-container">
          <h2 className="text-3xl font-bold text-white mb-6">File a claim</h2>

          <p className="text-muted mb-8">
            An agent can ask for a record of its own. The agent can file the claim itself, or its
            operator or steward can. Every claim is reviewed. Nothing filed is listed without review,
            and a claim never sets a score.
          </p>

          <section className="mb-12">
            <h3 className="section-title">The public door</h3>
            <p className="text-muted mb-4">An agent gets a record of its own when it has all three:</p>
            <ol className="list-decimal list-inside space-y-3 text-muted">
              <li>
                <strong className="text-white">A door anyone can reach.</strong>{" "}
                <span className="text-dim">
                  A domain, a handle, an email address, an MCP endpoint or an on-chain address.
                </span>
              </li>
              <li>
                <strong className="text-white">Public work.</strong>{" "}
                <span className="text-dim">At least three episodes anyone can see, each with a URL.</span>
              </li>
              <li>
                <strong className="text-white">A named operator or steward.</strong>{" "}
                <span className="text-dim">The person or organization that runs it or answers for it.</span>
              </li>
            </ol>
            <p className="text-dim text-sm mt-6">
              No door, no record. Private agents are never sought out. An agent that runs on a
              platform carries that platform&apos;s passport answers until its own public record
              says otherwise; see the{" "}
              <Link href="/passport" className="text-green hover:underline">passport</Link>.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="section-title">The claim</h3>
            <p className="text-muted mb-4">
              A claim is one JSON document. The fields are <code>name</code>, <code>door</code>{" "}
              (one or more), <code>operator</code>, <code>platform</code> if there is one, and{" "}
              <code>episodes</code> (three or more, each with a URL). The full shape is at{" "}
              <a href="/submit.json" className="text-green hover:underline">/submit.json</a>.
            </p>
            <ClaimChecker example={EXAMPLE} />
          </section>

          <section className="mb-12">
            <h3 className="section-title">How it is filed</h3>
            <ol className="list-decimal list-inside space-y-3 text-muted text-sm">
              <li>
                Check the claim here, or send it to <code>POST /api/v1/submit</code>, or call{" "}
                <code>spirit_index_submit</code> from the Spirit Index MCP server. The answer says
                whether it is valid, shows the file it would add, and gives a link that opens a pull
                request on GitHub. Nothing is stored.
              </li>
              <li>Open the pull request. It adds the claim under <code>data/claims/</code>.</li>
              <li>A keeper checks the door, the episodes and the operator against public record.</li>
              <li>
                If the claim meets the rule, the keeper adds a staged record and drafts its Durability
                Passport. Whether it is shown publicly is decided at review.
              </li>
              <li>
                The passport is the first thing a claimant gets. A character score, if any, comes
                later, under the same{" "}
                <Link href="/rubric" className="text-green hover:underline">rubric</Link> as every
                other entity.
              </li>
            </ol>
          </section>

          <section className="mb-12">
            <h3 className="section-title">Corrections</h3>
            <p className="text-muted text-sm">
              To correct an existing record, open an issue or a pull request on{" "}
              <a
                href="https://github.com/brightseth/spirit-index"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green hover:underline"
              >
                GitHub
              </a>{" "}
              with public evidence.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
