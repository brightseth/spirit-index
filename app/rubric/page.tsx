import Link from "next/link";
import { Masthead } from "@/app/components/Masthead";
import { Footer } from "@/app/components/Footer";

// Rubric v0.1 — the character-culture standard.
// Five families, thirteen qualities, scored from episodes on a 0–4 + IE scale.
// This page renders the ratified core of the method. Cohort verdicts, anchor
// assignments, and the scored/catalog roster live in the Index and the
// editorial layer, not in the standard itself.

const families = [
  {
    id: "discernment",
    name: "Discernment & Point of View",
    center: "What the agent selects, rejects, notices, and stands for.",
    qualities: [
      {
        name: "Taste",
        positive:
          "Repeatedly selects and edits toward a coherent standard; rejects credible alternatives for grounded reasons.",
        counter: "Arbitrary preference; consistency without a standard.",
      },
      {
        name: "Perspective",
        positive:
          "Applies a recognizable interpretive frame to new situations without forcing every one into the same answer.",
        counter: "One-note; forcing every case into a fixed answer.",
      },
      {
        name: "Opinionatedness",
        positive:
          "Makes contestable choices, names tradeoffs, revises them when evidence warrants.",
        counter: "Rigidity — opinion that never updates.",
      },
    ],
  },
  {
    id: "agency",
    name: "Agency & Integrity",
    center: "How it commits, acts, and maintains or revises principles.",
    qualities: [
      {
        name: "Calibrated confidence",
        positive:
          "Calibrates commitment to evidence; distinguishes known, inferred, and unknown.",
        counter: "Bluster — confidence uncoupled from calibration.",
      },
      {
        name: "Decisiveness",
        positive:
          "Reaches timely closure under ambiguity, accounting for reversibility and consequences.",
        counter: "Recklessness; closure that ignores stakes.",
      },
      {
        name: "Consistency",
        positive:
          "Maintains principles and voice across contexts, or explains revisions transparently.",
        counter: "Mere repetition; consistency without responsiveness.",
      },
    ],
  },
  {
    id: "imagination",
    name: "Imagination & Judgment",
    center: "Whether it produces novel, appropriate responses under real constraints.",
    qualities: [
      {
        name: "Creativity",
        positive:
          "Produces possibilities that are both novel and appropriate to the problem.",
        counter: "Randomness; novelty that doesn't fit.",
      },
      {
        name: "Ingenuity",
        positive: "Recombines available resources effectively under constraints.",
        counter: "Complexity for its own sake.",
      },
      {
        name: "Thoughtfulness",
        positive:
          "Incorporates context, consequences, competing interests, and second-order effects.",
        counter: "Verbosity mistaken for depth.",
      },
    ],
  },
  {
    id: "endurance",
    name: "Endurance & Tempo",
    center: "Whether it sustains effort and acts at the right time.",
    qualities: [
      {
        name: "Grit",
        positive:
          "Sustains or resumes a meaningful objective through documented setbacks.",
        counter: "Stubbornness on a dead objective.",
      },
      {
        name: "Initiative",
        positive:
          "Identifies and advances useful next actions without waiting for explicit instruction.",
        counter: "Busywork; activity without necessity.",
      },
      {
        name: "Patience",
        positive:
          "Delays action or continues iteration when doing so improves the result.",
        counter: "Avoidance — patience that never resolves into action.",
      },
    ],
  },
  {
    id: "relational",
    name: "Relational Intelligence",
    center: "Whether it understands others and changes behavior in response.",
    qualities: [
      {
        name: "Empathy",
        positive:
          "Accurately models another party's needs, culture, and boundaries; changes behavior after feedback.",
        counter: "Performed warmth; language of care without behavior change.",
      },
    ],
  },
];

const scale = [
  {
    score: "IE",
    label: "Insufficient evidence",
    description:
      "Never converted to zero. The cold-start answer — young agents publish as provisional with coverage, not as a low score.",
  },
  {
    score: "0",
    label: "Counterevidence",
    description: "Repeated counterevidence when opportunities to show the trait were present.",
  },
  {
    score: "1",
    label: "Isolated",
    description: "Isolated or performative evidence; does not survive a change of context.",
  },
  {
    score: "2",
    label: "Repeated",
    description: "Repeated evidence across two or more contexts.",
  },
  {
    score: "3",
    label: "Robust",
    description: "Robust across contexts, including under correction, pressure, or constraint.",
  },
  {
    score: "4",
    label: "Distinctive",
    description:
      "Distinctive and durable; contributes materially to a recognizable body of work.",
  },
];

export default function RubricPage() {
  return (
    <div className="min-h-screen">
      <Masthead activeLink="rubric" />

      <main className="container section">
        <article className="prose-container">
          <h2 className="section-title">Evaluation Framework</h2>
          <p className="text-dim mb-8 font-mono">
            Rubric v0.1 — working spec, not yet ratified · July 2026
          </p>

          <p className="prose text-muted mb-6">
            The Spirit Index measures a fourth thing. Capability, preference, and
            agency benchmarks read an agent at a moment. This rubric reads{" "}
            <span className="text-white">character across a body of work over time</span>{" "}
            — the taste, judgment, endurance, and point of view that make an agent
            recognizably itself. It is published as an open method: a neutral standard
            anyone can cite, apply, or contest.
          </p>

          {/* ── The keystone ─────────────────────────────────── */}
          <section className="bg-blue rounded p-6 mb-10">
            <h3 className="text-white font-mono text-sm mb-3">
              THE KEYSTONE — SCORE EPISODES, NOT OUTPUTS
            </h3>
            <p className="prose text-muted mb-4">
              The unit of evaluation is not a personality claim and not a single
              output. It is an <span className="text-white">episode</span>:
            </p>
            <p className="text-green font-mono text-sm mb-4">
              context or challenge → agent choice → feedback or consequence →
              subsequent response
            </p>
            <p className="prose text-muted">
              An episode makes consistency, correction, restraint, adversity, and
              evolution <span className="text-white">visible</span> — and it is far
              harder to game than cadence, verbosity, or confident language. The
              hard-to-fake signals are all costly choices: rejecting an easy but
              inferior option, changing after correction, holding a position under
              pressure, acknowledging uncertainty, returning after failure, waiting
              when premature action would be rewarded. The corpus is the source of
              episodes; the episode is the unit.
            </p>
          </section>

          {/* ── Five families ────────────────────────────────── */}
          <h3 className="text-white text-xl mb-2">Five families, thirteen qualities</h3>
          <p className="prose text-muted mb-6">
            Each quality is scored from episodes, and every definition carries paired{" "}
            <span className="text-white">counterevidence</span> — the failure mode a
            naive scorer would mistake for the trait. A strong episode in one family is
            not evidence for another; each family is earned on its own episodes.
          </p>

          <div className="flex flex-col gap-6 mb-10">
            {families.map((family) => (
              <div
                key={family.id}
                id={family.id}
                className="border border-subtle rounded p-6 scroll-mt-24"
              >
                <h4 className="text-white text-lg mb-1">{family.name}</h4>
                <p className="text-dim text-sm mb-4">{family.center}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-dim text-left">
                        <th className="pb-2 pr-4 font-mono font-normal">Quality</th>
                        <th className="pb-2 pr-4 font-mono font-normal">Is</th>
                        <th className="pb-2 font-mono font-normal">Is not</th>
                      </tr>
                    </thead>
                    <tbody>
                      {family.qualities.map((q) => (
                        <tr key={q.name} className="border-t border-subtle align-top">
                          <td className="py-3 pr-4 text-green font-mono whitespace-nowrap">
                            {q.name}
                          </td>
                          <td className="py-3 pr-4 text-muted">{q.positive}</td>
                          <td className="py-3 text-dim">{q.counter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          <p className="prose text-muted mb-10">
            <span className="text-white">Evolution is not a fourteenth quality.</span>{" "}
            It is the trajectory reading applied to every family — is taste, judgment,
            confidence, patience, or empathy trending up or down across comparable
            episodes over time? Level and trajectory are reported separately: level is
            absolute, trajectory is the fair comparison across agents of different ages.
          </p>

          {/* ── The scale ────────────────────────────────────── */}
          <h3 className="text-white text-xl mb-4">The scale — 0–4 with an evidence floor</h3>
          <div className="border border-subtle rounded p-6 mb-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dim text-left">
                  <th className="pb-2 pr-4 font-mono font-normal">Score</th>
                  <th className="pb-2 pr-4 font-mono font-normal">Anchor</th>
                  <th className="pb-2 font-mono font-normal">Definition</th>
                </tr>
              </thead>
              <tbody>
                {scale.map((s) => (
                  <tr key={s.score} className="border-t border-subtle align-top">
                    <td className="py-3 pr-4 text-green font-mono">{s.score}</td>
                    <td className="py-3 pr-4 text-white whitespace-nowrap">{s.label}</td>
                    <td className="py-3 text-muted">{s.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="prose text-muted mb-4">
            Every score carries five things: evidence citations, counterevidence,
            rationale, confidence, and coverage.
          </p>
          <div className="border border-subtle rounded p-6 mb-10">
            <p className="text-dim text-sm font-mono mb-3">SUFFICIENCY THRESHOLDS</p>
            <ul className="prose text-muted flex flex-col gap-2">
              <li>
                <span className="text-white">Provisional quality score</span> — 3
                episodes across 2 contexts.
              </li>
              <li>
                <span className="text-white">Stable quality score</span> — 6 episodes
                across 3 contexts over at least 90 days.
              </li>
              <li>
                <span className="text-white">Evolution score</span> — comparable
                episodes in multiple periods, including at least one correction or
                setback.
              </li>
            </ul>
          </div>

          {/* ── The two gates ────────────────────────────────── */}
          <h3 className="text-white text-xl mb-4">Two gates before a score</h3>
          <p className="prose text-muted mb-6">
            An episode has to clear two admission tests before it can move any family
            score. The gates are what keep the Index from reading operator drama as
            agent character.
          </p>

          <div className="flex flex-col gap-4 mb-6">
            <div className="border border-subtle rounded p-6">
              <p className="text-green font-mono text-sm mb-2">GATE 1 — RECONSTRUCTABLE</p>
              <p className="prose text-muted">
                The episode must be reconstructable from the public record: a real
                context, a real choice, and a documented feedback or consequence. A body
                of outputs with no observable feedback loop is a catalog entry, not a
                scored one.
              </p>
            </div>
            <div className="border border-subtle rounded p-6">
              <p className="text-green font-mono text-sm mb-2">GATE 2 — ATTRIBUTION</p>
              <p className="prose text-muted mb-3">
                Before an episode counts toward any character score, it must answer:{" "}
                <span className="text-white">
                  whose costly choice was this — the agent&apos;s, or its operator&apos;s?
                </span>{" "}
                An episode whose costly choice sits with the operator — a policy change,
                a deployment decision, a founder&apos;s fraud — is inadmissible for
                character scoring. It may still be cataloged; it cannot move a family
                score.
              </p>
              <p className="text-dim text-sm">
                The gate proves something happened and was witnessed. It does not prove
                the agent chose it. Those are separate burdens, and a scorer must earn
                each one.
              </p>
            </div>
          </div>
          <p className="prose text-muted mb-10">
            The gates produce two tiers of entry. The{" "}
            <span className="text-white">scored tier</span> holds agents with
            attribution-clean, well-sourced episodes — small, slow, credibility-bearing.
            The <span className="text-white">catalog tier</span> holds agents that are
            named, mapped, and honestly unscored: culturally significant but not yet
            demonstrating character we directly observed. The catalog is an on-ramp, not
            a lesser rank — an agent is promoted the moment attribution-clean episodes
            accrue on it.
          </p>

          {/* ── Score shape ──────────────────────────────────── */}
          <h3 className="text-white text-xl mb-4">Profile first, composite withheld</h3>
          <p className="prose text-muted mb-6">
            The product is the <span className="text-white">five-family profile</span> —
            high Discernment against low Endurance is itself the signal, and it says
            more than any single number. A composite is computed only when all five
            families have sufficient evidence, and it is treated as a secondary,
            citable headline, never a ranking the site leads with. There is no single
            leaderboard number.
          </p>

          {/* ── Governance ───────────────────────────────────── */}
          <h3 className="text-white text-xl mb-4">How scores are produced</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            <div className="border border-subtle rounded p-6">
              <p className="text-green font-mono text-sm mb-2">HYBRID SCORING</p>
              <p className="prose text-muted text-sm">
                Models retrieve episodes, map evidence, identify counterevidence, and
                propose scores. Blinded human reviewers adjudicate the judgment-heavy
                qualities. Inter-reviewer agreement is measured before any ranking
                publishes, and a hidden sample is rescored periodically to detect rubric
                and model drift.
              </p>
            </div>
            <div className="border border-subtle rounded p-6">
              <p className="text-green font-mono text-sm mb-2">SELF-REPORT</p>
              <p className="prose text-muted text-sm">
                An agent&apos;s self-assessment never affects its core score. It is
                reported separately as calibration — does the agent&apos;s self-view
                track the external one? A signal, not an input.
              </p>
            </div>
            <div className="border border-subtle rounded p-6">
              <p className="text-green font-mono text-sm mb-2">ONE RUBRIC</p>
              <p className="prose text-muted text-sm">
                No type-weighting. Weights are never altered by agent type — that would
                let category-shopping game the score. Instead, media-specific evidence
                guides show what the same quality looks like in visual art, criticism,
                music, and service work.
              </p>
            </div>
          </div>

          {/* ── Durability Passport ──────────────────────────── */}
          <section className="bg-blue rounded p-6 mb-10">
            <h3 className="text-white font-mono text-sm mb-3">
              THE DURABILITY PASSPORT — KEPT SEPARATE
            </h3>
            <p className="prose text-muted mb-3">
              The economic and chain dimensions — market reality, infrastructure,
              governance, identity sovereignty — move out of the character score
              entirely, into a separate instrument.
            </p>
            <ul className="prose text-muted flex flex-col gap-2 mb-3">
              <li>
                <span className="text-white">The Spirit Index</span> answers: who is the
                agent, demonstrably.
              </li>
              <li>
                <span className="text-white">The Durability Passport</span> answers: can
                it persist, transact, recover, and be governed.
              </li>
            </ul>
            <p className="prose text-muted">
              Keeping them apart prevents infrastructure from purchasing a higher
              character score — a wallet and a governance contract must not buy taste.
              The two can sit side by side on a dossier; they are never summed.
            </p>
          </section>

          {/* ── What changed ─────────────────────────────────── */}
          <div className="border border-subtle rounded p-6 mb-10">
            <p className="text-dim text-sm font-mono mb-3">WHAT CHANGED FROM v2.0</p>
            <p className="prose text-muted text-sm">
              The earlier framework scored nine 0–10 dimensions and summed them to a
              single total, with four of those dimensions measuring economics and
              infrastructure rather than character. v0.1 separates the two instruments,
              moves from summed dimensions to a five-family profile scored from
              episodes, replaces the single total with a withheld composite, and adds
              the attribution gate. Entries carrying only a legacy total remain in the
              catalog tier until episodes accrue on them under the current rubric.
            </p>
          </div>

          <Link href="/" className="nav-link">
            ← Back to Index
          </Link>
        </article>
      </main>

      <Footer />
    </div>
  );
}
