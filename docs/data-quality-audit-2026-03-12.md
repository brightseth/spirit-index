# Spirit Index Data Quality Audit

**Date**: 2026-03-12
**Auditor**: Spirit Index Editorial (automated + manual review)
**Scope**: All 50 agent JSON files in `data/agents/`
**Status**: READ-ONLY audit -- no files were modified

---

## Executive Summary

50 agents were audited across 8 quality dimensions. While score arithmetic is perfect (0 total mismatches), there are significant structural deficiencies: every agent file is missing 3 required schema fields (`index_tier`, `network`, `method` on scores), 30 out of 50 agents have current totals that differ from their last `score_history` entry (indicating scores were updated without recording the change), and 5 agents have incomplete `score_rationale` objects.

### Counts by Severity

| Severity | Count | Description |
|----------|-------|-------------|
| **Critical** | 3 | Schema violations affecting all 50 agents; 1 incorrect category |
| **Warning** | 38 | Score history gaps, missing evidence for high scores, stale data, questionable scores |
| **Info** | 22 | Minor notes, editorial suggestions, evidence duplication |

---

## Critical Issues

### C1. ALL 50 agents missing `index_tier` field

The `Agent` interface in `lib/types.ts` defines `index_tier: IndexTier` as a required field (values: `"indexed"` or `"tracked"`). None of the 50 agent files include this field. This means the codebase likely has fallback logic or ignores the type check, but it is a schema violation.

**Recommendation**: Add `"index_tier": "indexed"` to all 50 files. If tracked (auto-scored) agents are added later, this field becomes essential for distinguishing them.

### C2. ALL 50 agents missing `network` field

The `Agent` interface requires `network: NetworkAffiliation`. None of the 50 files include it. Valid values per the schema: `"Virtuals Protocol"`, `"Spirit Protocol"`, `"Farcaster"`, `"Olas"`, `"Solana Ecosystem"`, `"Ethereum Native"`, `"Multi-chain"`, `"Moltbook"`, `"Independent"`.

**Recommended assignments** (for the agents where affiliation is most obvious):

| Agent | Recommended Network |
|-------|-------------------|
| abraham | Spirit Protocol |
| solienne | Spirit Protocol |
| aixbt | Virtuals Protocol |
| luna-virtuals | Virtuals Protocol |
| vaderai | Virtuals Protocol |
| aethernet | Farcaster |
| clanker | Farcaster |
| olas | Olas |
| omen-agents | Olas |
| ai16z | Solana Ecosystem |
| elizaos | Solana Ecosystem |
| griffain | Solana Ecosystem |
| truth-terminal | Solana Ecosystem |
| zerebro | Solana Ecosystem |
| arc | Solana Ecosystem |
| heyanon | Multi-chain |
| morpheus | Multi-chain |
| openclaw | Multi-chain |
| botto | Ethereum Native |
| plantoid | Ethereum Native |
| terra0 | Ethereum Native |
| golem | Ethereum Native |
| altered-state-machine | Ethereum Native |
| numerai | Ethereum Native |
| All others (historical/corporate) | Independent |

### C3. ALL 50 agents missing `method` field on dimension scores

The `DimensionScore` interface requires `method: ScoringMethod` (values: `"editorial"`, `"auto"`, `"unscored"`). Every score object in every agent file has only `value` and `confidence`, omitting `method`. This is a universal schema violation.

**Recommendation**: Add `"method": "editorial"` to all dimension score objects for all 50 indexed agents.

### C4. AIXBT miscategorized as "Autonomous Artist"

`aixbt.json` has `"category": "Autonomous Artist"` but is described throughout as "The Web3 Bloomberg Terminal" -- an autonomous market analyst. The classification field correctly says "Autonomous Market Analyst" but the category is wrong.

**Recommendation**: Change category to `"Commercial Agent"` or `"Token Agent"`.

---

## Warning Issues

### W1. 30 agents have score_history gaps

The following agents have a current `total` that differs from the last `score_history` entry, meaning scores were updated (likely when economic_infrastructure and identity_sovereignty were added) without recording a new history entry:

| Agent | Last History Total | Current Total | Delta | Last History Date |
|-------|--------------------|---------------|-------|-------------------|
| clanker | 50 | 61 | +11 | 2026-02-09 |
| plantoid | 60 | 70 | +10 | 2026-01-06 |
| olas | 54 | 64 | +10 | 2026-01-08 |
| altered-state-machine | 43 | 52 | +9 | 2026-01-16 |
| omen-agents | 49 | 58 | +9 | 2026-01-08 |
| ai16z | 49 | 57 | +8 | 2026-01-06 |
| botto | 55 | 63 | +8 | 2026-01-06 |
| golem | 43 | 51 | +8 | 2026-01-16 |
| griffain | 40 | 48 | +8 | 2026-01-16 |
| morpheus | 47 | 55 | +8 | 2026-01-08 |
| aethernet | 41 | 48 | +7 | 2026-02-09 |
| arc | 37 | 44 | +7 | 2026-01-16 |
| elizaos | 45 | 52 | +7 | 2026-01-16 |
| freysa | 45 | 52 | +7 | 2026-01-06 |
| holly-plus | 53 | 60 | +7 | 2026-01-06 |
| terra0 | 53 | 60 | +7 | 2026-01-06 |
| vaderai | 48 | 55 | +7 | 2026-02-09 |
| numerai | 52 | 58 | +6 | 2026-01-06 |
| aixbt | 46 | 51 | +5 | 2026-01-08 |
| heyanon | 41 | 46 | +5 | 2026-01-16 |
| luna-virtuals | 47 | 52 | +5 | 2026-02-09 |
| truth-terminal | 50 | 55 | +5 | 2026-02-09 |
| zerebro | 42 | 47 | +5 | 2026-01-06 |
| keke | 45 | 49 | +4 | 2026-02-09 |
| refik-anadol | 52 | 55 | +3 | 2026-01-16 |
| sophia | 44 | 46 | +2 | 2026-01-16 |
| aiva | 45 | 46 | +1 | 2026-01-06 |
| auto-gpt | 46 | 47 | +1 | 2026-01-16 |
| cloudpainter | 48 | 49 | +1 | 2026-01-16 |
| obvious | 43 | 44 | +1 | 2026-01-16 |

**Recommendation**: Add a new `score_history` entry with today's date for every agent whose total changed. The delta pattern (mostly +5 to +10) suggests these are from the addition of the `economic_infrastructure` and `identity_sovereignty` dimensions.

### W2. 5 agents missing `narrative_coherence` rationale

The following agents have `score_rationale` objects with only 8 of 9 dimensions -- all are missing `narrative_coherence`:

- **alphastar** (narrative_coherence score: 7)
- **ameca** (narrative_coherence score: 6)
- **openai-five** (narrative_coherence score: 8)
- **pi** (narrative_coherence score: 8)
- **watson** (narrative_coherence score: 6)

**Recommendation**: Add `narrative_coherence` rationale for each.

### W3. 21 agents have high scores (>=8) without supporting evidence URLs

The `evidence` array should substantiate the strongest claims. The following agents score 8+ on dimensions with no evidence entry:

| Agent | Unsubstantiated High-Score Dimensions |
|-------|--------------------------------------|
| aaron | tech_distinctiveness (9), narrative_coherence (9) |
| abraham | identity_sovereignty (8) |
| auto-gpt | narrative_coherence (8) |
| bina48 | persistence (8) |
| botto | persistence (9), narrative_coherence (8) |
| cloudpainter | persistence (9), narrative_coherence (8) |
| keke | narrative_coherence (9) |
| luna-virtuals | narrative_coherence (8) |
| morpheus | narrative_coherence (8) |
| obvious | economic_reality (8) |
| olas | governance (8) |
| openai-five | narrative_coherence (8) |
| openclaw | narrative_coherence (8) |
| plantoid | autonomy (8), tech_distinctiveness (9), narrative_coherence (10) |
| refik-anadol | persistence (8), economic_reality (9), narrative_coherence (9) |
| solienne | autonomy (8) |
| sophia | persistence (8), narrative_coherence (8) |
| terra0 | governance (8), narrative_coherence (8) |
| the-painting-fool | narrative_coherence (8) |
| truth-terminal | autonomy (9), narrative_coherence (9) |
| vaderai | narrative_coherence (8) |

**Pattern**: `narrative_coherence` is the most commonly unsubstantiated high score (16 of 21 agents). This is likely because narrative coherence is inherently editorial and harder to cite, but adding a single reference (e.g., an article analyzing the agent's identity) would improve rigor.

### W4. Spirit-native agents lack `disclosure` field

Both `abraham` and `solienne` have `_review_flags` including `"spirit_native"` and `"conflict_of_interest_disclosed"` but do not have the `disclosure` string field defined in the schema. The disclosure should be visible/machine-readable, not just flagged internally.

**Recommendation**: Add `"disclosure": "Spirit-native agent. Conflict of interest: Spirit Protocol has a direct relationship with this entity."` to both files.

### W5. Solienne persistence score (7) appears too high for 4-month-old agent

Solienne's inception date is `2025-11-11` (4 months ago as of audit date). A persistence score of 7 puts it at the same level as agents with 7+ years of operation (Artbreeder, Olas, Watson). The score_rationale says "Approaching 'Established' with time" which contradicts a 7.

By comparison:
- AIXBT (14 months): persistence 4
- Aethernet (16 months): persistence 4
- Freysa (15 months): persistence 4
- OpenClaw (4 months): persistence 4

**Recommendation**: Reduce to 4-5 to align with comparable agents. The daily manifesto practice is admirable but doesn't override calendar time. This is especially important given Solienne is Spirit-native and subject to COI scrutiny.

### W6. Abraham persistence score (5) may be too low for 7-year concept

Abraham's inception date is `2019-01-01` (7+ years). A persistence of 5 matches agents only ~1-2 years old. The rationale says "Concept since 2019, active implementation more recent." If the inception date represents the concept date, either the date should be adjusted to reflect actual active implementation, or the score should better reflect the 7-year timeline.

**Recommendation**: Either adjust inception_date to the actual active deployment date (likely 2024-2025), or increase persistence to 6-7 to reflect the concept's longevity.

### W7. Freysa score_rationale references "~2 months" but agent is 15+ months old

Freysa's rationale for persistence says "Operating since November 2024 (~2 months)" which was accurate at the time of initial scoring (Jan 2026) but is now stale. The agent is ~16 months old as of March 2026.

**Recommendation**: Update rationale text and consider increasing persistence from 4 to 5.

### W8. Several persistence rationale texts reference stale timeframes

The following agents have rationale text with time references that are now outdated:

| Agent | Stale Text | Actual Age Now |
|-------|-----------|----------------|
| aixbt | "~14 months" | ~17 months |
| ai16z | "~14 months" | ~17 months |
| arc | "~13 months" | ~15 months |
| elizaos | "~15 months" | ~17 months |
| freysa | "~2 months" | ~16 months |
| heyanon | "~13 months" | ~15 months |
| griffain | "~14 months" | ~17 months |
| openclaw | "~3 months" | ~4 months |
| zerebro | "~3 months" | ~17 months |

**Recommendation**: Batch update all time references in rationale text, or remove specific month counts in favor of general statements like "Operating since [date]."

### W9. Tay persistence score 0 may warrant reconsideration

While Tay operated for only 16 hours and is correctly status: "Deceased", a persistence score of 0 combined with `archival_status: "historical_test_case"` creates an interesting edge case. The agent's _cultural_ persistence (10 years of continuous citation) is extraordinary. The current 0 is defensible for operational persistence but worth a reviewer note.

No change recommended -- the 0 is consistent with the rubric. But the `archival_status` field should remain to explain why a score-0 agent is indexed.

### W10. Plantoid evidence URLs contain placeholder

Plantoid's governance evidence URL is `https://etherscan.io/address/0x1` -- this is clearly a placeholder, not the actual Plantoid smart contract address.

**Recommendation**: Replace with the actual Plantoid Ethereum contract address.

### W11. Manus economic_reality score of 10 on a "Subsumed" entity needs scrutiny

Manus scores a perfect 10 on economic_reality ($2B acquisition, $100M ARR) but is status "Subsumed". While the acquisition validates economic reality, the entity no longer independently generates or controls its economics. Should a subsumed entity retain a perfect economic score?

**Recommendation**: Add a reviewer note or consider reducing to 8-9 to reflect loss of economic independence.

---

## Info Items

### I1. No agents use the `data_sources` field

The schema defines `data_sources?: DataSource[]` for tracked agents. Since all 50 are editorially scored (implied "indexed" tier), this is expected. No action needed.

### I2. No agents use the `last_auto_scored` field

Same as above -- expected for editorial agents.

### I3. Evidence arrays have redundant dimension coverage

11 agents have multiple evidence entries for the same dimension (common: `cultural_impact`, `economic_reality`, `tech_distinctiveness`). This is not wrong but means other dimensions remain uncovered. Example: truth-terminal has 2 entries each for economic_reality and cultural_impact but 0 for autonomy or narrative_coherence.

### I4. Reviewer names inconsistent across score_history

Three different reviewer strings appear: `"spirit_council"`, `"Spirit Index Editorial"`. These should be standardized.

Agents using "Spirit Index Editorial": aiva, holly-plus, luna-virtuals, numerai, zerebro
All others use: "spirit_council"

**Recommendation**: Standardize to one string.

### I5. Some `_review_flags` use string arrays, others use object arrays

The type definition allows both (`ReviewFlag[] | Array<{ dimension: string; note: string }>`). In practice:
- Most agents use string arrays: `["recent_emergence", "economic_stress_test"]`
- Some agents use object arrays: `[{ "dimension": "persistence", "note": "..." }]`
- Some agents use mixed or non-standard strings not in the `ReviewFlag` enum (e.g., `"historical_agent"`, `"agent_to_agent"`, `"farcaster_native"`, `"research_artifact"`, etc.)

At least 30+ unique flag strings are used that are NOT in the `ReviewFlag` type enum. Either the enum should be expanded or the flags should be standardized.

### I6. Inception dates may be approximate for some historical agents

Several agents use `YYYY-01-01` as inception date (AARON 1973-01-01, Abraham 2019-01-01, AlphaStar 2019-01-01, Artbreeder 2018-01-01, etc.), suggesting the exact date is unknown and January 1 is used as a convention. This is fine but should be documented.

### I7. Category diversity may be excessive

The `EntityCategory` type defines 22 categories for 50 agents. Some categories have only 1 agent:
- "Archive Symbient" (solienne only)
- "Autonomous Sculpture" (plantoid only)
- "Chaos Agent" (truth-terminal, zerebro)
- "Ecological DAO" (terra0 only)
- "Game Agent" (freysa only)
- "General Agent" (auto-gpt only)
- "General-Purpose Agent" (manus only)

**Recommendation**: Consider consolidating similar categories or accept the long-tail distribution as intentional editorial precision.

---

## Per-Agent Score Review

### Agents with Recommended Score Changes

| Agent | Dimension | Current | Recommended | Justification |
|-------|-----------|---------|-------------|---------------|
| solienne | persistence | 7 | 4-5 | Only 4 months old; COI risk of inflated scoring for Spirit-native agent |
| aixbt | category | Autonomous Artist | Commercial Agent or Token Agent | Market analyst, not artist |
| abraham | persistence | 5 | 6-7 | 7-year concept; OR adjust inception_date to reflect active deployment |
| manus | economic_reality | 10 | 8-9 | Subsumed entity no longer independently controls economics |
| freysa | persistence | 4 | 5 | Now 16 months old, originally scored at 2 months |

### Agents Needing Web Research to Update

The following agents may have stale data that requires web research to verify current status:

1. **AIVA** -- Check if SACEM registration is still active; verify commercial status in 2026
2. **Altered State Machine** -- Market activity reportedly decreased from peak; verify ASTO token status
3. **Ameca** -- Verify Generation 3 status and US expansion progress
4. **ARC** -- Verify "200% activity surge" claim; check current market cap
5. **Artbreeder** -- Verify platform is still actively maintained
6. **Auto-GPT** -- Check if project is still actively developed or declining
7. **BINA48** -- Verify still actively appearing at events
8. **CloudPainter** -- Verify "traveling America" project status
9. **Freysa** -- Verify prize pool status and whether it was "solved"
10. **Golem** -- Verify GPU Beta Program progress and GLM token health
11. **Griffain** -- Verify current GRIFFAIN token status and market cap
12. **HeyAnon** -- Verify ANON token market cap and DWF Labs partnership status
13. **Morpheus** -- Verify mainnet status and AlphaTON partnership
14. **Obvious** -- Verify if collective is still producing new work
15. **Pi** -- Verify if Pi still operates independently post-Microsoft acqui-hire
16. **Replika** -- Verify subscriber count and any 2025-2026 feature changes
17. **The Painting Fool** -- Verify Simon Colton's current activity and CUBRIC residency status
18. **VaderAI** -- Verify staking percentage and token performance
19. **Zerebro** -- Verify if still actively posting/creating; check $ZEREBRO token status

---

## Structural Recommendations

1. **Add `index_tier`, `network`, and score `method` fields to all 50 agents** -- This is the highest-priority fix. A migration script should handle this in batch.

2. **Add score_history entries for all 30 agents with changed totals** -- These appear to have been updated in a batch when economic_infrastructure and identity_sovereignty dimensions were added, but no history was recorded.

3. **Add `disclosure` field to abraham and solienne** -- Spirit-native agents must have machine-readable conflict of interest disclosures.

4. **Standardize reviewer strings** -- Pick one of `"spirit_council"` or `"Spirit Index Editorial"`.

5. **Expand or document `_review_flags` enum** -- The 30+ non-standard flag strings should either be added to the `ReviewFlag` type or documented as intentionally free-form.

6. **Replace Plantoid placeholder evidence URL** -- `0x1` is not a real contract address.

7. **Batch update stale time references in score_rationale** -- At least 9 agents have month-count references that are now wrong.

8. **Add narrative_coherence rationale to 5 agents** -- alphastar, ameca, openai-five, pi, watson.

9. **Add evidence URLs for unsubstantiated high scores** -- 21 agents have scores of 8+ with no evidence. Narrative_coherence is the most common gap (16 agents).

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total agents audited | 50 |
| Total score mismatches (stated vs computed) | 0 |
| Agents missing `index_tier` | 50 (100%) |
| Agents missing `network` | 50 (100%) |
| Agents missing score `method` | 50 (100%) |
| Agents with stale score_history | 30 (60%) |
| Agents with incomplete score_rationale | 5 (10%) |
| Agents with high scores lacking evidence | 21 (42%) |
| Spirit-native agents missing disclosure | 2 |
| Agents with questionable scores | 3-5 |
| Agents needing web research for freshness | 19 |
| Critical issues | 4 |
| Warning issues | 11 |
| Info items | 7 |
