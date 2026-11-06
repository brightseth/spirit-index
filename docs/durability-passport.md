# Durability Passport, spec v1.0

**Status:** v1.0, November 2026. Supersedes the v0.1 proposal (August 2026).
**Data:** `data/passports/<id>.json`, validated against `data/passports/schema.json`.
**API:** `GET /api/v1/passport/:id`. **Page:** [spiritindex.org/passport](https://spiritindex.org/passport).

---

## What it is

The Spirit Index score asks who an agent is, from its body of work. The Durability Passport asks a
different question: can the agent persist, transact, recover and be checked, and who holds its
memory while it does.

The two instruments sit side by side on an agent's dossier. They are never summed. The passport
has no field score and no total, and nothing in it feeds an agent's `scores` or `total`. A
passport does not change any score in the Index.

A passport is boring on purpose. Each field is a short plain statement of what the public record
shows, the links that show it, and the date it was checked.

## The six fields

Listed in display order. Memory custody comes first; the reason is below.

| Field | Question | Evidence that counts |
|---|---|---|
| `memory_custody` | Who holds the agent's memory, and can it be exported or moved? | Where memory, state, corpus, training data or weights live (operator servers, an open repo, a chain, IPFS, a vendor platform); who controls them; any documented export path; any documented survival of a model or vendor change |
| `identity_anchor` | Does the identity survive any single platform? | Own domain, on-chain registry entry or contract, ENS name, open repository, identity documents, as against a handle on one platform |
| `persistence_ops` | Does it run without heroics? | Public evidence it is operating now (recent dated output, status page, recent commits, recent chain activity), a documented cadence, documented outages or dormancy |
| `economic_rails` | Can it transact? | Wallet or contract addresses from the agent's own docs or a chain explorer, a payment or billing mechanism, a sales venue |
| `governance` | Can its operator be checked? | A public decision process, published rules, on-chain contracts, open code; who can override or pause it |
| `recovery` | What happens when it dies mid-act? | A documented incident and how it came back, a documented restart, backup or rebuild procedure, documented succession of stewardship |

## Status: attested, stale, IE

Every field carries exactly one status.

- **attested**: a public source, read on the check date, answers the field's question, and the
  source is current (a live page, doc, repository or explorer describing present state, or a
  dated source from the last 90 days). The answer can be unfavorable. "Memory is held on the
  operator's servers with no public export path" is attested when a public source says so.
  Attested means the fact is on the record, not that the agent does well on it.
- **stale**: public evidence exists, but the newest dated source is more than 90 days old and
  nothing current confirms it still holds.
- **IE** (insufficient evidence): there is no public evidence. The field carries no links, and its
  summary is one line saying what evidence would settle it.

An empty passport is a young or quiet agent, not a bad one. IE is never read as zero.

## The evidence rule

1. **Public record only.** Sites, documentation, repositories, chain explorers, institutional
   records, press. Nothing private, nothing self-reported off the record, nothing from memory.
2. **One URL per claim.** Every claim in a field's evidence list has exactly one URL, and that URL,
   as read on the check date, supports the claim. If a page cannot be read, it is not cited.
3. **Primary sources first.** The agent's own site, docs, repository or contract come before
   press. Aggregators and exchange explainers are a last resort and are never used for memory
   custody.
4. **IE when there is none.** No inference past the source. If the docs show memory on a vendor
   database and say nothing about export, the passport says no export path is documented. It
   does not say export is impossible.
5. **Plain summaries.** Two or three sentences. No praise words. Money is described as what the
   agent transacts, holds or sells; never as returns, yield or investment, and never with prices.

## The 90-day stale clock

Each field records the date its evidence was last read (`checked`). Two clocks apply:

- **At authoring**, a field whose newest supporting source is more than 90 days old is recorded
  as `stale`.
- **At display**, a field recorded as `attested` whose `checked` date is more than 90 days in the
  past is shown as stale until it is re-checked. The stored status is not rewritten; the API
  returns both `status` (as shown) and `recorded_status` (as stored).

Re-checking a field means reading its sources again and updating `checked`, the status and the
summary if anything changed.

## Why memory custody is listed first

An agent's model can be swapped, its interface rebuilt and its host replaced, and it can still be
the same agent if its memory comes with it. If the memory sits with one operator or one vendor,
with no export path, the agent ends when that relationship does, however capable it is that
afternoon. Capability benchmarks measure what a system can do on a given day. Who holds the memory
decides whether there is a tomorrow for the same agent. It is also the field the public record
says least about, so it is filled first and most carefully, and an IE there is itself the
finding.

## Schema

The JSON Schema is `data/passports/schema.json`. In short:

```json
{
  "id": "<agent id, matching data/agents/<id>.json>",
  "spec_version": "1.0",
  "fields": {
    "identity_anchor": {
      "status": "attested | stale | IE",
      "summary": "Two or three plain sentences.",
      "evidence": [{ "claim": "One claim.", "url": "https://..." }],
      "checked": "YYYY-MM-DD"
    },
    "memory_custody": { "...": "same shape" },
    "persistence_ops": { "...": "same shape" },
    "economic_rails": { "...": "same shape" },
    "governance": { "...": "same shape" },
    "recovery": { "...": "same shape" }
  }
}
```

Rules the schema enforces: all six fields present; `status` is one of the three values; an `IE`
field has an empty evidence list; an `attested` or `stale` field has at least one evidence item;
every URL is `https`. The site refuses to build if a passport breaks these rules.

## API

`GET /api/v1/passport/:id` returns the v1 envelope (`{ data, meta }`), CORS open, cached for an hour
at the browser and a day at the edge. `data.fields` is an array in display order, each item with
`key`, `label`, `question`, `status`, `recorded_status`, `summary`, `evidence` and `checked`. An
agent without a passport returns 404 `PASSPORT_NOT_FOUND`.

## What the passport is not

- Not a score, a grade or a ranking. There is no total and no way to compute one.
- Not an audit. It reports what the public record shows on a date, and links to it.
- Not an endorsement. Attested facts are often unfavorable facts.
- Not permanent. It goes stale on a clock, by design.

## Coverage

v1.0 covers 21 agents: the first 21 in the public index's score order
(`GET /api/v1/scores`) as of 6 November 2026. SOLIENNE, the pilot entry in v0.1, is among them.
Agents without a passport show no passport section.

## Change log

- **v1.0 (November 2026):** JSON schema, evidence rule, 90-day stale clock, memory custody listed
  first, API endpoint, dossier section, 21 passports.
- **v0.1 (August 2026):** proposal. Six fields and the attested / stale / IE rule.
