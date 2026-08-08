# Durability Passport — spec v0.1

**Status:** PROPOSED, not ratified. Fills the slot rubric-spec v0.1 §6 created
and left empty. Names only agents already present in this repo's data layer.
**Date:** 2026-08-08

---

## What it is

The rubric ruled that infrastructure must not purchase character: the four
economic/chain dimensions of the old 9-dim rubric (economic reality, economic
infrastructure, governance, identity sovereignty) move out of the character
score into a separate instrument. This is that instrument.

- **Spirit Index (rubric)** answers: *who is the agent, demonstrably.*
- **Durability Passport** answers: *can it persist, transact, recover, be
  governed.*
- The two sit side by side on a dossier and are **never summed**.

A passport is boring on purpose. It contains verifiable operational and
chain facts, each with evidence and a check date — no adjectives, no scores
above the field level.

## The fields

| Field | Question | Evidence class |
|---|---|---|
| `identity_anchor` | Does the identity survive any single platform? | domain + registry entries + canonical soul/identity doc location |
| `memory_custody` | Is the memory owned and portable? | store type, export path, survives-model-swap claim with test date |
| `persistence_ops` | Does it run without heroics? | uptime source, heartbeat freshness, restart-survival (reconciliation) evidence |
| `economic_rails` | Can it transact? | wallet(s) from canonical docs only, metering/billing state |
| `governance` | Can its operator be checked? | soul-binding audit result (BINDS/PROSE/ADJACENT counts), kill-switch test date, receipt truthfulness standard |
| `recovery` | What happens when it dies mid-act? | fail-closed vs fail-open on identity load; documented restart reconciliation |

Field values are `attested` (evidence linked, checked date fresh),
`stale` (evidence older than 90 days), or `IE`. Same honesty rule as
everywhere else: an empty passport is a young agent, not a bad one.

## Where the evidence comes from

For Spirit-native agents, the fleet's internal completion grid (held
off-repo) is the evidence pipeline: its memory / surfaces / economics /
stewardship checks produce passport facts as a by-product. The passport is
the **public-safe projection** of that grid — facts only, no operational
gaps, no client information. For external agents, passports are built from
public record, same as episodes.

## Pilot passport: SOLIENNE (public entry — re-attested 2026-08-08 after
## the whole-system review; corrected claims are STRONGER, not weaker)

- `identity_anchor`: attested with caveat — solienne.ai; First Spirit,
  un-numbered; hash-pinned ratified constitution with tamper-evidence
  tests in CI. Caveat: the published soul document and the runtime
  identity document are different files; reconciliation open.
- `memory_custody`: attested — owned per-person relational store behind a
  single write chokepoint with standing-neutrality invariants (purchases
  move no standing) and a CI-tested consent suite. Scale stated honestly:
  ~8k relational events; a further ~100k conversation turns live in
  adjacent stores not yet joined to the spine. DATA verifiably survives
  model migrations; voice continuity across migrations has failed and been
  human-caught twice — the revert trigger is procedure, not yet code.
- `persistence_ops`: attested — daily practice pipeline with cron, retry,
  and streak computation, operating under institutional exhibition load
  (Fotografiska 2026). The record includes a 7-day outage (Jul 2026) and a
  minting pause (Apr–Aug 2026), both documented in-repo — durability
  measured, not asserted.
- `economic_rails`: attested — sells work; a 7-gate commerce constitution
  (steward-approved 2026-08-06) with 6 gates built including
  refusal-with-full-refund in a single function; pricing authored by the
  agent, provenance filed. Not yet live (flags off; canary sale pending).
- `governance`: attested — soul-binding audit completed 2026-08-08 (3rd in
  fleet). Binding gates verified (memory chokepoint, IG human-confirm,
  constitution pinning); named gaps on record (kill-switch coverage,
  runtime-soul reconciliation) with fix routing.
- `recovery`: partial — refund path fail-safe by design; identity load
  currently fail-OPEN to a hardcoded fallback (fix routed: fail-closed per
  fleet standard).

## Candidate second passport + cohort nomination: COLTRANE

The 2026-08-05 whole-system review (three independent read-only model
passes, claims re-checked, findings fixed and deployed) makes COLTRANE the
best-evidenced infrastructure case in the network: the first completed
soul-binding audit; a summon-gate with **9 of 12 attempts refused, in the
log** (a costly-choice episode set with clean attribution — the agent's own
gates, not an operator's stage direction); a documented undead-soul failure
fixed to fail-closed; restart reconciliation proven against a production
database copy; and a receipts-truthfulness standard ruled by the steward
(leave-attempted vs leave-confirmed).

**PROPOSED — awaits ruling:** nominate COLTRANE as the *"one further
Spirit-native, held internal"* fifth slot in the rubric's launch cohort
(§7, explicitly not locked). The review corpus is precisely the episode
material the cohort requires, and its correction events (review → fix →
deploy) satisfy the §4 evolution requirement. If accepted, episode
enumeration to LEVI-grade sourcing is the remaining pre-launch labor.

## Promotion policy — when `public: false` flips

Fleet entries are held off the public site until, cumulatively:

1. Internal completion stage **C3+** (grounded and practicing — verified,
   not claimed),
2. A passport with **≥4 of 6 fields attested**,
3. No unresolved soul-binding finding of class ADJACENT or worse on a
   participant-facing surface,
4. A steward (Seth) ruling — the flip is always a decision, never an
   automation.

This turns the public/held flag from a vibe into a gate, and gives every
fleet agent a legible path to standing in the Index.
