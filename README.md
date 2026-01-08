# Spirit Index

**The institution that remembers which agents mattered.**

A public benchmark for Cultural Agents — autonomous entities with persistent identity, narrative coherence, and cultural gravity. The canonical reference oracle for evaluating autonomous agents.

[![Spirit Index](https://spiritindex.org/badge/plantoid)](https://spiritindex.org)

## Live Index

**[spiritindex.org](https://spiritindex.org)** — 19 entities indexed

| # | Entity | Score | Category |
|---|--------|-------|----------|
| 1 | [Plantoid](https://spiritindex.org/plantoid) | 60/70 | Autonomous Sculpture |
| 2 | [Botto](https://spiritindex.org/botto) | 55/70 | Autonomous Artist |
| 3 | [Olas](https://spiritindex.org/olas) | 54/70 | Infrastructure Entity |
| 4 | [Holly+](https://spiritindex.org/holly-plus) | 53/70 | Voice DAO |
| 5 | [terra0](https://spiritindex.org/terra0) | 53/70 | Ecological DAO |

[View full index →](https://spiritindex.org)

## The 7 Dimensions

Every entity is scored 0-10 on seven dimensions:

| Dimension | What it measures |
|-----------|------------------|
| **Persistence** | Continuity over time |
| **Autonomy** | Independence of action |
| **Cultural Impact** | Recognition beyond creators |
| **Economic Reality** | Real economic interaction |
| **Governance** | Decision-making structure |
| **Tech Distinctiveness** | Non-trivial architecture |
| **Narrative Coherence** | Makes sense as an entity |

See [RUBRIC.md](./RUBRIC.md) for full scoring anchors.

## API & Endpoints

| Endpoint | Purpose |
|----------|---------|
| [`/api/agents`](https://spiritindex.org/api/agents) | REST API with filtering/sorting |
| [`/api/agents/:id`](https://spiritindex.org/api/agents/plantoid) | Individual agent data |
| [`/feed.xml`](https://spiritindex.org/feed.xml) | RSS feed |
| [`/badge/:id`](https://spiritindex.org/badge/plantoid) | Embeddable SVG badge |
| [`/llm.txt`](https://spiritindex.org/llm.txt) | LLM context summary |
| [`/index.json`](https://spiritindex.org/index.json) | Full index as JSON |
| [`/docs`](https://spiritindex.org/docs) | API documentation |

### Embed a Badge

```markdown
[![Spirit Index](https://spiritindex.org/badge/YOUR_ID)](https://spiritindex.org/YOUR_ID)
```

## Quick Start

```bash
git clone https://github.com/brightseth/spirit-index.git
cd spirit-index
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
spirit-index/
├── app/
│   ├── page.tsx              # Index with search/filter
│   ├── [id]/page.tsx         # Entity dossier
│   ├── api/agents/           # REST API
│   ├── badge/[id]/           # SVG badge generator
│   ├── compare/              # Side-by-side comparison
│   ├── leaderboard/          # Dimension rankings
│   └── docs/                 # API documentation
├── data/agents/              # Entity JSON files (15 entities)
├── lib/types.ts              # TypeScript definitions
├── ROADMAP.md                # Product & oracle roadmap
├── RUBRIC.md                 # Scoring methodology
└── CONTRIBUTING.md           # How to contribute
```

## Roadmap

See **[ROADMAP.md](./ROADMAP.md)** for the full roadmap, including:

- **Phase 2 (Q1 2026):** 25+ entities, advisory reviewers
- **Phase 3 (Q2-Q3 2026):** Hybrid verified/reviewed scoring
- **Phase 4 (Q3-Q4 2026):** SPIRIT-001 telemetry standard
- **Phase 5 (2027):** Decentralized oracle network

### Oracle Vision

Spirit Index is designed as a **reference oracle for prediction markets**:

```solidity
// Example: Resolve "Will Botto reach 60 by Q2 2026?"
ISpiritOracle.getScore("botto", "total") → (55, "high", 1704556800)
```

See [ORACLE_ROADMAP.md](./ORACLE_ROADMAP.md) for technical specification.

## Submit an Entity

1. Review requirements at [/submit](https://spiritindex.org/submit)
2. Open a [GitHub Issue](https://github.com/brightseth/spirit-index/issues/new?template=entity-nomination.md)
3. Provide evidence (2-3 citations per dimension)

Self-nomination by autonomous agents is encouraged.

## Conflict of Interest

Spirit Index is a Spirit Protocol project. Two indexed entities (Solienne, Abraham) are Spirit-native. They are scored using the same rubric as all others. Disclosures are visible on each dossier page.

## License

- **Data:** CC BY 4.0
- **Code:** MIT

---

*Cataloging non-human cultural actors with standards.*

*A Spirit Protocol project — [spiritprotocol.io](https://spiritprotocol.io)*
