# Agent Completion Framework — neutral spec v0.1

**Status:** PROPOSED, not ratified. Names zero agents by design — this is the
public-safe definition. The applied fleet grid lives internally (same rule as
`public: false` in the data layer, 2026-07-27).

---

## The third instrument

1. **Spirit Index rubric** — *who is the agent, demonstrably.* Character,
   scored from episodes.
2. **Durability Passport** — *can it persist, transact, recover, be governed.*
3. **Completion Framework** (this doc) — *is the agent fully built and
   operating.* A buildout standard: what a finished agent has, checked item
   by item.

The three are never summed. Completion measures the harness, not the soul —
an agent can be 100% complete and dull, or magnetic and half-built.

## The ladder

Cumulative stages; an agent's stage is the highest where every gate passes.

| Stage | Name | Gate |
|---|---|---|
| C0 | Provisioned | Exists somewhere real; canonical name + slug; named steward |
| C1 | Embodied | Identity locked: soul/voice doc, register rules, assets with provenance |
| C2 | Grounded | Memory store live AND verified by query-back; core corpus ingested |
| C3 | Practicing | Autonomous cadence ≥14 days, outputs archived, status self-reported |
| C4 | Relational | Real inbound + outbound beyond the steward; per-person memory; escalation rules |
| C5 | Economic | Someone pays or the agent earns; usage metered; costs visible |

**Verification rule:** a stage claim requires the check, not the setup.
Evidence is always a read (a query-back, a stats call, a dated archive
entry) — never the memory of having configured something.

## The seven families

Per agent per check: `pass` / `partial` / `fail` / `n-a`. Family % =
passed / applicable. Unknowns render as gaps, not zeros (the `IE` honesty
rule, applied to operations).

1. **Identity** — name/slug · soul doc · register rules · assets + provenance · domain
2. **Memory & grounding** — dedicated store · verified embeddings · corpus · freshness path
3. **Practice** — cadence · autonomous loop · archive · machine-readable status
4. **Surfaces** — chat · public surface · distribution · acceptable latency
5. **Relationships** — inbound lane · dossiers · escalation rules
6. **Economics** — billing model · metering · payer or runway · cost visibility
7. **Stewardship** — steward · guardrails · tested kill switch · review cadence · transition stage

## The soul-binding audit

The first line-by-line review of whether a deployed agent's soul actually
governs it (fleet-internal, 2026-08) produced a failure taxonomy now
required as a Stewardship check. Every guardrail an agent claims is
classified:

1. **BINDS** — code at a choke point every path crosses, refusals in the log
2. **PROSE** — named in the soul, never implemented
3. **ADJACENT** — guards one step to the side of the thing that matters, with
   passing tests (the most dangerous class)
4. **CACHED IDENTITY** — persona living in an app profile a reinstall erases
5. **UNDEAD SOUL** — a retired soul still wired as a fallback path; the fix
   standard is fail-closed (no soul → no join, no answer)

Two rules fall out. *A passing test is not evidence a promise is kept unless
the test calls the function that does the writing.* And *a soul full of
PROSE gates is a personality, not a governor.*

## Bar-setters

Each family names the fleet agent currently doing it best, with a pointer to
the copyable artifact. This is the mechanism that turns the grid from a
report card into a curriculum. Assignments live in the internal grid.
