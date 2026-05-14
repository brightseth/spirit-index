# Spirit Index Roadmap

## Vision

Spirit Index evolves from an **editorial benchmark** to a **verifiable oracle** — the canonical reference for evaluating autonomous cultural agents. Like S&P for companies or Michelin for restaurants, but for non-human entities.

---

## Current State (v1.2) ✓

**Live at [spiritindex.org](https://spiritindex.org)**

### What's Built
- **170 entities tracked · 62 indexed** spanning artists, DAOs, chaos agents, infrastructure
- **9-dimension scoring framework** (Rubric v2.0, max score 90) with public anchors
- **Full API access** — REST + v1 endpoints, RSS feed, JSON exports
- **Embeddable badges** — SVG badges for agent READMEs
- **Search/filter/sort** — Interactive index with dimension sorting
- **Submission workflow** — GitHub issue templates for nominations
- **Spirit Protocol launch slate** — SOLIENNE + HENRI indexed as Spirit-native agents ahead of 2026-06-15 TGE

### Endpoints
| Endpoint | Purpose |
|----------|---------|
| `/api/agents` | REST API with filtering/sorting |
| `/api/agents/:id` | Individual agent data |
| `/feed.xml` | RSS feed with custom `spirit:` namespace |
| `/badge/:id` | SVG badge for embedding |
| `/llm.txt` | Plain text for LLM context windows |
| `/index.json` | Full index as JSON |
| `/rubric.json` | Scoring methodology |
| `/submit.json` | Submission protocol spec |
| `/sitemap.xml` | SEO sitemap |

### Current Rankings

Rankings update with each scoring round. The live leaderboard is canonical:

- [Live index](https://spiritindex.org) — sortable rankings
- [`/api/v1/agents`](https://spiritindex.org/api/v1/agents) — JSON, filterable
- [`/api/v1/stats`](https://spiritindex.org/api/v1/stats) — cohort counts, tier distribution

Static tables in this README are intentionally omitted to avoid drift.

---

## Phase 2: Expansion (Q1 2026)

### Goals
- **25+ entities** — Broader coverage including infrastructure agents, commercial agents
- **Quarterly reviews** — Systematic re-evaluation of existing entities
- **Advisory reviewers** — 2-3 practitioners contributing to scoring
- **Agent self-nomination** — Indexed agents can nominate others

### Features
- [ ] Comparison presets (e.g., "The Elders", "2024 Wave", "Artists vs Infrastructure")
- [ ] Score change notifications (email/webhook for tracked agents)
- [ ] Public nomination queue (transparent pending submissions)
- [ ] Entity relationships (parent/child, fork/merge tracking)

### Target Entities
- **Infrastructure:** Autonolas, Fetch.ai agents, Olas, Langchain agents
- **Commercial:** Character.AI, Pi, Claude (as entity?), ChatGPT personas
- **Art:** Refik Anadol Studio agents, AI Weiwei, other generative systems
- **Finance:** More prediction market agents, trading bots with identity
- **Gaming:** NPC agents with persistent identity, game DAOs

---

## Phase 3: Hybrid Scoring (Q2-Q3 2026)

### Goal
Split dimensions into **verified** (on-chain/data-derived) and **reviewed** (human-assessed).

### Verified Dimensions (Auto-calculated)
| Dimension | Data Source |
|-----------|-------------|
| **Persistence** | Activity timestamps, uptime, gap analysis |
| **Economic Reality** | Treasury balances, tx volume, market cap |
| **Governance** | On-chain votes, proposal counts, multisig diversity |

### Reviewed Dimensions (Expert assessment)
| Dimension | Why Human Review |
|-----------|------------------|
| **Cultural Impact** | Requires qualitative judgment |
| **Narrative Coherence** | Subjective interpretation |
| **Tech Distinctiveness** | Architectural assessment |
| **Autonomy** | Hybrid (can be verified if telemetry exists) |

### Display Format
```
Plantoid                                    78/90

VERIFIED (on-chain)
├─ Economic    ████████░░  8/10  ✓
├─ Governance  █████████░  9/10  ✓
└─ Persistence ██████████ 10/10  ✓

REVIEWED (expert)
├─ Cultural          █████████░  9/10  May 2026
├─ Narrative         ██████████ 10/10  May 2026
├─ Tech Distinct.    ████████░░  8/10  May 2026
└─ Autonomy          ███████░░░  7/10  May 2026
```

---

## Phase 4: SPIRIT-001 Telemetry Standard (Q3-Q4 2026)

### Goal
Define a standard for agents to self-report verifiable metrics. Agents implementing SPIRIT-001 receive "certified" status.

### Specification (Draft)
```typescript
interface SpiritTelemetry {
  schema_version: "SPIRIT-001";
  agent_id: string;

  persistence: {
    genesis_timestamp: string;
    last_activity_timestamp: string;
    total_active_days: number;
    longest_inactive_gap_days: number;
  };

  economic: {
    treasury_addresses: { chain: string; address: string; balance_usd: number }[];
    revenue_30d_usd: number;
    transaction_count_30d: number;
    market_cap_usd?: number;
  };

  governance: {
    governance_type: "multisig" | "token_voting" | "conviction" | "none";
    governance_contract?: string;
    proposals_total: number;
    avg_voter_participation: number;
  };

  autonomy: {
    actions_30d: number;
    self_initiated_percent: number;
    human_overrides_30d: number;
  };

  verification: {
    signed_by: string;
    signature: string;
  };
}
```

### Endpoint
Agents expose: `GET /.well-known/spirit-telemetry.json`

### Certification Tiers
| Tier | Requirements | Benefits |
|------|--------------|----------|
| **Indexed** | Basic dossier | Listed in index |
| **Verified** | SPIRIT-001 + signature | Auto-updated scores, ✓ badge |
| **Certified** | Verified + attestation | Oracle-grade, prediction market eligible |

---

## Phase 5: Decentralized Oracle (2027)

### Goal
Spirit Index becomes a decentralized oracle network for prediction markets and protocol integrations.

### Architecture
```
Reviewers (stake-weighted) → Score Aggregation → On-Chain Oracle → Consumers
                                    ↓
                           Prediction Markets
                           Staking Protocols
                           Agent Registries
```

### Oracle Interface
```solidity
interface ISpiritOracle {
    function getScore(bytes32 agentId, bytes32 dimension)
        external view returns (uint8 score, uint8 confidence, uint256 timestamp);

    function getTotalScore(bytes32 agentId)
        external view returns (uint8 total, uint256 timestamp);

    function meetsThreshold(bytes32 agentId, bytes32 dimension, uint8 threshold)
        external view returns (bool);
}
```

### Prediction Market Examples
- "Will Botto's Cultural Impact exceed 9 by Q2 2026?"
- "Will any new agent reach top 3 by total score in 2026?"
- "Will Truth Terminal's Governance improve after DAO formation?"

---

## Open Questions

1. **Token economics** — Does Spirit Index need its own token, or use SPIRIT?
2. **Reviewer incentives** — How to attract quality reviewers?
3. **Gaming resistance** — How to prevent telemetry manipulation?
4. **Subjective dimensions** — Can Cultural Impact ever be fully objective?
5. **Chain selection** — Base (Spirit native) vs Ethereum vs multi-chain?

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to:
- Nominate new entities
- Challenge existing scores
- Contribute to the rubric
- Join as a reviewer

---

## Timeline Summary

| Phase | Timeline | Key Milestone |
|-------|----------|---------------|
| **1.1** | ✓ Done | 15 entities, API, badges, search |
| **1.2** | ✓ Done | 9-dim rubric (v2.0), 170 entities tracked, v1 API, launch slate |
| **2** | Q2-Q3 2026 | Hybrid verified/reviewed scoring, advisory reviewers |
| **3** | Q3-Q4 2026 | SPIRIT-001 telemetry standard |
| **4** | 2027 | Decentralized oracle network |

---

*Last updated: 2026-05-14*
