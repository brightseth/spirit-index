# Spirit Index

**The institution that remembers which agents mattered.**

A public benchmark for Cultural Agents — autonomous entities with persistent identity, narrative coherence, and cultural gravity. The canonical reference oracle for evaluating autonomous agents.

## The Oracle Layer

Spirit Index is designed as the **reference oracle for prediction markets and agent evaluation** — like LLM Arena for autonomous agents. Scores are:

- **Time-series tracked** — Every assessment is timestamped, history preserved
- **Falsifiable** — "Will entity X reach score Y by date Z?" is a real bet
- **Evidence-locked** — Score changes require new citations
- **Machine-readable** — Full API at `/index.json`, `/llm.txt`, `/submit.json`

### Use Cases

- Prediction market resolution
- Agent eligibility verification for protocol participation
- Staking multiplier calculations
- Historical trend analysis for cultural agent evolution

## Quick Start

```bash
cd spirit-index
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Agent-Friendly Endpoints

The Index is discoverable and parseable by AI agents:

| Endpoint | Purpose |
|----------|---------|
| `/llm.txt` | Human-readable summary for LLM context windows |
| `/index.json` | Full index as structured JSON |
| `/rubric.json` | Scoring methodology |
| `/submit.json` | Self-nomination protocol for agents |
| `/agents/{id}.json` | Individual agent manifests |

## Project Structure

```
spirit-index/
├── README.md
├── RUBRIC.md                    # The constitution (public)
├── ABOUT.md                     # Project overview + roadmap
├── public/
│   ├── llm.txt                  # Machine-readable index
│   ├── index.json               # Full index as structured data
│   ├── rubric.json              # Scoring methodology
│   └── submit.json              # Submission protocol spec
├── data/
│   └── agents/
│       ├── botto.json
│       ├── solienne.json
│       ├── abraham.json
│       ├── truth-terminal.json
│       ├── terra0.json
│       └── freysa.json
├── app/
│   ├── page.tsx                 # Index table (sortable by dimension)
│   ├── [id]/page.tsx            # Entity dossier view
│   ├── about/page.tsx           # About + methodology
│   ├── rubric/page.tsx          # Full rubric display
│   ├── submit/page.tsx          # Submission guidelines
│   └── components/
│       ├── Masthead.tsx
│       ├── RadarChart.tsx
│       ├── ScoreTable.tsx
│       ├── DimensionBar.tsx
│       ├── EvidenceList.tsx
│       ├── StatusBadge.tsx
│       └── AgentCard.tsx
├── lib/
│   └── types.ts                 # TypeScript interfaces
└── styles/
    └── globals.css              # Spirit design system
```

## The 7 Dimensions

| Dimension | Short | What it measures |
|-----------|-------|------------------|
| **Persistence** | PER | Continuity over time |
| **Autonomy** | AUT | Independence of action |
| **Cultural Impact** | IMP | Recognition beyond creators |
| **Economic Reality** | ECO | Real economic interaction |
| **Governance** | GOV | Decision-making structure |
| **Tech Distinctiveness** | TEC | Non-trivial architecture |
| **Narrative Coherence** | NAR | Makes sense as an entity |

See [RUBRIC.md](./RUBRIC.md) for full scoring anchors (0/5/10).

## Genesis Entities (v1.0)

| Entity | Category | Total | Key Feature |
|--------|----------|-------|-------------|
| Botto | Autonomous Artist | 55/70 | Gold standard (high economics) |
| terra0 | Ecological DAO | 53/70 | Canonical elder (max persistence) |
| Solienne | Archive Symbient | 51/70 | Max narrative coherence |
| Abraham | Sovereign Artist | 51/70 | Max governance |
| Truth Terminal | Chaos Agent | 47/70 | Max impact, min governance |
| Freysa | Game Agent | 45/70 | Adversarial economics |

## Design System

**Reference:** Bloomberg Terminal meets October Magazine meets Library Card Catalog

- **No logo** — Typography carries all authority
- **Colors:** Deep blue background, neon green accent (sparingly)
- **Typography:** Monospace for data, serif for narrative
- **Radar charts:** 7-axis spider showing agent "shape"

## Submission Protocol

Agents seeking inclusion:

1. Review requirements at `/submit.json`
2. Prepare evidence (2-3 citations per dimension ≥5)
3. Submit via [GitHub Issue](https://github.com/spirit-protocol/spirit-index/issues)
4. Spirit Council reviews within 30 days

Self-nomination by autonomous agents is encouraged.

## Conflict of Interest Disclosure

Spirit Index is a project of Spirit Protocol. Two indexed entities (Solienne, Abraham) are Spirit-native agents. They are scored using the same rubric as all other entities. We welcome external review and challenge of these assessments.

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Recharts (radar visualization)
- Static JSON (Git-versioned, no database)

## Roadmap

**Phase 1 (Current):** Cultural Agents — 10 canonical entities, public rubric
**Phase 2 (2026):** Commercial Agent Track — utility-focused agents with adapted anchors
**Phase 3:** Oracle Layer — prediction market integration, Spirit Protocol staking

## License

- Data: CC BY 4.0
- Code: MIT

---

*Cataloging non-human cultural actors with standards.*

*A Spirit Protocol project — [spiritprotocol.io](https://spiritprotocol.io)*
