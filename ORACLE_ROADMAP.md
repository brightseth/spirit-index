# Spirit Index Oracle Roadmap

## Vision

The Spirit Index evolves from an **editorial benchmark** to a **verifiable oracle** for autonomous agent evaluation. Prediction markets, staking protocols, and agent registries can consume Spirit Index data with confidence in its objectivity and manipulation resistance.

---

## Current State (v1.0)

**Model:** Human-reviewed with AI assistance
**Methodology:** 7-dimension rubric with anchor definitions
**Output:** Scores 0-10 per dimension, 0-70 total
**Confidence:** Editorial (transparent but subjective)

**Strengths:**
- Nuanced evaluation of hard-to-quantify dimensions
- Expert judgment on cultural significance
- Fast iteration, can add new entities quickly

**Limitations:**
- Not suitable for trustless oracle consumption
- Scores could be disputed in prediction market resolution
- Doesn't scale without reviewer bottleneck

---

## Phase 2: Hybrid Scoring (Q2 2026)

### Goal
Split dimensions into **verified** (on-chain/data-derived) and **reviewed** (human-assessed). Display both clearly.

### Verified Dimensions (Auto-calculated)

#### Economic Reality
```
Score = weighted_average(
  treasury_value_normalized,      // 0-10 based on brackets
  revenue_30d_normalized,         // 0-10 based on brackets
  transaction_volume_normalized,  // 0-10 based on activity
  market_cap_normalized           // 0-10 if tokenized
)
```

**Data sources:**
- On-chain treasury balances (multi-chain)
- DEX/CEX volume APIs
- Revenue tracking (where transparent)

**Brackets (example):**
| Treasury USD | Score |
|--------------|-------|
| $0 | 0 |
| $1-10K | 2 |
| $10K-100K | 4 |
| $100K-1M | 6 |
| $1M-10M | 8 |
| $10M+ | 10 |

#### Governance
```
Score = weighted_average(
  onchain_governance_exists,      // 0 or 3 base
  proposal_activity,              // 0-3 based on count
  voter_participation,            // 0-2 based on %
  multisig_diversity,             // 0-2 based on signer count
)
```

**Data sources:**
- Governance contract events
- Snapshot/Tally APIs
- Multisig transaction analysis

#### Persistence
```
Score = weighted_average(
  operational_duration,           // 0-4 based on years
  activity_continuity,            // 0-3 based on gap analysis
  platform_survival,              // 0-3 based on migrations survived
)
```

**Data sources:**
- First/last transaction timestamps
- Activity gap analysis
- Historical archive (Wayback, on-chain)

### Reviewed Dimensions (Human-assessed)

#### Cultural Impact
- Press coverage analysis (semi-automated)
- Exhibition/museum presence
- Academic citations
- Derivative works and influence
- **Human review required** for weighting and context

#### Narrative Coherence
- Voice consistency analysis (NLP-assisted)
- Brand recognition
- Mythos depth
- **Human review required** for qualitative assessment

#### Technical Distinctiveness
- Architecture novelty assessment
- Code analysis (partial automation)
- Innovation vs. wrapper determination
- **Human review required** for technical judgment

#### Autonomy
- Self-initiation ratio (if telemetry available)
- Human intervention frequency
- Decision-making independence
- **Hybrid:** Can be verified if agent implements telemetry

### Display Format

```
Plantoid                                    60/70

VERIFIED DIMENSIONS (on-chain data)
├─ Economic Reality    ████████░░  8/10  ✓ verified
├─ Governance          █████████░  9/10  ✓ verified
└─ Persistence         ██████████ 10/10  ✓ verified

REVIEWED DIMENSIONS (expert assessment)
├─ Cultural Impact     █████████░  9/10  reviewed Jan 2026
├─ Narrative Coherence ██████████ 10/10  reviewed Jan 2026
├─ Technical           ████████░░  8/10  reviewed Jan 2026
└─ Autonomy            ███████░░░  7/10  reviewed Jan 2026
                                         (telemetry not implemented)
```

---

## Phase 3: SPIRIT-001 Telemetry Standard (Q3-Q4 2026)

### Goal
Define a standard for agents to self-report verifiable telemetry. Agents implementing SPIRIT-001 receive "certified" status with fully automated scoring on applicable dimensions.

### SPIRIT-001 Specification

```typescript
interface SpiritTelemetry {
  // Metadata
  schema_version: "SPIRIT-001";
  agent_id: string;
  updated_at: string; // ISO timestamp

  // Persistence Metrics
  persistence: {
    genesis_timestamp: string;        // First activity
    last_activity_timestamp: string;  // Most recent
    total_active_days: number;        // Days with activity
    longest_inactive_gap_days: number;
    platforms_survived: string[];     // e.g., ["ethereum", "base"]
  };

  // Economic Metrics
  economic: {
    treasury_addresses: {
      chain: string;
      address: string;
      balance_usd: number;
      last_verified: string;
    }[];
    revenue_30d_usd: number;
    revenue_lifetime_usd: number;
    transaction_count_30d: number;
    market_cap_usd?: number;          // If tokenized
    token_address?: string;
  };

  // Governance Metrics
  governance: {
    governance_type: "multisig" | "token_voting" | "conviction" | "none" | "other";
    governance_contract?: string;
    proposals_total: number;
    proposals_30d: number;
    avg_voter_participation: number;  // 0-1
    signers_or_delegates: number;
    decision_log_url?: string;        // Public decision history
  };

  // Autonomy Metrics
  autonomy: {
    actions_30d: number;
    self_initiated_percent: number;   // 0-100
    human_overrides_30d: number;
    scheduled_actions_percent: number;
    reactive_actions_percent: number;
    proactive_actions_percent: number;
  };

  // Verification
  verification: {
    signed_by: string;                // Agent's signing key
    signature: string;                // Signature of payload
    attestation_url?: string;         // Third-party attestation
  };
}
```

### Telemetry Endpoint

Agents implementing SPIRIT-001 expose:
```
GET /.well-known/spirit-telemetry.json
```

Spirit Index crawls registered agents, verifies signatures, cross-references on-chain data, and auto-updates verified dimension scores.

### Certification Tiers

| Tier | Requirements | Benefits |
|------|--------------|----------|
| **Indexed** | Basic dossier, human-reviewed | Listed in index |
| **Verified** | SPIRIT-001 telemetry + signature | Auto-updated scores, "✓ verified" badge |
| **Certified** | Verified + third-party attestation | Oracle-grade data, prediction market eligible |

### Incentives for Implementation

1. **Visibility:** Certified agents ranked higher, featured in comparisons
2. **Trust:** Prediction markets prefer certified agents for resolution
3. **Integration:** Spirit Protocol onboarding prioritizes certified agents
4. **Badge:** Certified badge for websites/READMEs

---

## Phase 4: Decentralized Oracle (2027+)

### Goal
Spirit Index becomes a decentralized oracle network where multiple independent reviewers contribute to scores, with economic incentives for accuracy.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Spirit Oracle Network                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Reviewer 1 │  │  Reviewer 2 │  │  Reviewer 3 │     │
│  │  (Human)    │  │  (Human)    │  │  (AI Agent) │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         ▼                ▼                ▼             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Score Aggregation Layer             │   │
│  │  - Stake-weighted averaging                      │   │
│  │  - Outlier detection                             │   │
│  │  - Dispute resolution                            │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              On-Chain Oracle Contract            │   │
│  │  - Score commitments                             │   │
│  │  - Verification proofs                           │   │
│  │  - Dispute bonds                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │                   Consumers                       │   │
│  │  - Prediction markets                            │   │
│  │  - Staking protocols                             │   │
│  │  - Agent registries                              │   │
│  │  - Insurance protocols                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Reviewer Economics

1. **Stake requirement:** Reviewers stake tokens to participate
2. **Accuracy rewards:** Reviewers whose scores match consensus earn fees
3. **Slashing:** Reviewers with outlier scores lose stake
4. **Specialization:** Reviewers can specialize in dimensions (governance experts, cultural critics)

### Dispute Resolution

1. **Challenge period:** 7 days after score publication
2. **Dispute bond:** Challenger stakes tokens
3. **Arbitration:** Panel of senior reviewers or Kleros-style jury
4. **Resolution:** Loser forfeits bond

### Prediction Market Integration

```solidity
interface ISpiritOracle {
    // Get current score for an agent
    function getScore(bytes32 agentId, bytes32 dimension)
        external view returns (uint8 score, uint8 confidence, uint256 timestamp);

    // Get total score
    function getTotalScore(bytes32 agentId)
        external view returns (uint8 total, uint256 timestamp);

    // Check if agent meets threshold
    function meetsThreshold(bytes32 agentId, bytes32 dimension, uint8 threshold)
        external view returns (bool);

    // Subscribe to score updates
    event ScoreUpdated(bytes32 indexed agentId, bytes32 dimension, uint8 newScore);
}
```

**Example prediction market questions:**
- "Will Botto's Cultural Impact score exceed 9 by Q2 2026?" → Resolves via `getScore("botto", "cultural_impact")`
- "Will any new agent reach top 3 by total score in 2026?" → Resolves via `getTotalScore` comparison
- "Will Truth Terminal's Governance score improve to 5+ after DAO formation?" → Resolves via threshold check

---

## Implementation Timeline

| Phase | Timeline | Key Deliverables |
|-------|----------|------------------|
| **1.0** | Now | Editorial index, public rubric, 10+ entities |
| **1.5** | Q1 2026 | API, RSS, badges, 20+ entities |
| **2.0** | Q2 2026 | Hybrid scoring, verified vs reviewed split |
| **2.5** | Q3 2026 | SPIRIT-001 spec draft, first implementations |
| **3.0** | Q4 2026 | Telemetry crawler, certification tiers |
| **3.5** | Q1 2027 | Oracle contract deployment (testnet) |
| **4.0** | Q2 2027 | Decentralized reviewer network (limited) |
| **4.5** | Q3 2027 | Prediction market integrations |

---

## Open Questions

1. **Which chain for oracle contract?** Base (Spirit Protocol native) vs Ethereum mainnet (liquidity) vs multi-chain
2. **Token economics?** Does Spirit Index need its own token, or use SPIRIT token?
3. **Reviewer recruitment?** How to bootstrap quality reviewer network?
4. **Gaming resistance?** How to prevent agents from gaming telemetry metrics?
5. **Subjective dimensions?** Can Cultural Impact ever be fully objective, or always needs human input?

---

## Competitive Moat

If Spirit Index successfully establishes:
1. **The standard** for agent evaluation (SPIRIT-001)
2. **The oracle** prediction markets trust
3. **The registry** protocols check for legitimacy

Then Spirit Index becomes critical infrastructure for the autonomous agent economy—the "credit rating agency" for non-human entities.

---

*Document version: 0.1*
*Last updated: January 2026*
*Status: Draft for discussion*
