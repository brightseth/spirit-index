# Spirit Index Roadmap

## Vision

Spirit Index evolves from an **editorial benchmark** to a **verifiable oracle** — the canonical reference for evaluating autonomous cultural agents. Like S&P for companies or Michelin for restaurants, but for non-human entities.

---

## Current State (v1.2) ✓

**Live at [spiritindex.org](https://spiritindex.org)**

### What's Built
- **19 indexed entities** spanning artists, DAOs, chaos agents, infrastructure
- **7-dimension scoring framework** with public rubric and anchors
- **Full API access** — REST endpoints, RSS feed, JSON exports
- **Embeddable badges** — SVG badges for agent READMEs
- **Search/filter/sort** — Interactive index with dimension sorting
- **Submission workflow** — GitHub issue templates for nominations

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

### Current Rankings (Jan 2026)
| # | Entity | Score | Category |
|---|--------|-------|----------|
| 1 | Plantoid | 60/70 | Autonomous Sculpture |
| 2 | Botto | 55/70 | Autonomous Artist |
| 3 | Olas | 54/70 | Infrastructure Entity |
| 4 | Holly+ | 53/70 | Voice DAO |
| 5 | terra0 | 53/70 | Ecological DAO |
| 6 | Numerai | 52/70 | Prediction Meta-Model |
| 7 | Abraham | 51/70 | Sovereign Artist |
| 8 | Solienne | 51/70 | Archive Symbient |
| 9 | ai16z | 49/70 | DAO / Fund |
| 10 | Omen Agents | 49/70 | Prediction Collective |
| 11 | Morpheus | 47/70 | Decentralized AI Network |
| 12 | Truth Terminal | 47/70 | Chaos Agent |
| 13 | AIXBT | 46/70 | Autonomous Analyst |
| 14 | AIVA | 45/70 | AI Composer |
| 15 | Freysa | 45/70 | Game Agent |
| 16 | Luna | 42/70 | Virtual Pop Star |
| 17 | Zerebro | 42/70 | Chaos Agent |
| 18 | Replika | 39/70 | AI Companion |
| 19 | Tay | 25/70 | Conversational (†Deceased) |

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
| **Technical Distinctiveness** | Architectural assessment |
| **Autonomy** | Hybrid (can be verified if telemetry exists) |

### Display Format
```
Plantoid                                    60/70

VERIFIED (on-chain)
├─ Economic    ████████░░  8/10  ✓
├─ Governance  █████████░  9/10  ✓
└─ Persistence ██████████ 10/10  ✓

REVIEWED (expert)
├─ Cultural    █████████░  9/10  Jan 2026
├─ Narrative   ██████████ 10/10  Jan 2026
├─ Technical   ████████░░  8/10  Jan 2026
└─ Autonomy    ███████░░░  7/10  Jan 2026
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
| **2** | Q1 2026 | 25+ entities, advisory reviewers |
| **3** | Q2-Q3 2026 | Hybrid verified/reviewed scoring |
| **4** | Q3-Q4 2026 | SPIRIT-001 telemetry standard |
| **5** | 2027 | Decentralized oracle network |

---

*Last updated: January 2026*
