# Phase 3 & 4 Implementation Plan

## Phase 3: RUBRIC.md Updates

### 3.1 Add Archival Exception Rule

**Location:** After "Inclusion Criteria" section, before "The 7 Dimensions"

**New section to add:**

```markdown
### Archival Exceptions

Entities of significant historical importance may be indexed even if they fail the minimum threshold requirements. These are marked with **Archival Status** and serve as historical test cases rather than active benchmarks.

**Criteria for archival exception:**
- Cultural impact score ≥8 (canonical significance)
- Historical importance to the field of autonomous agents
- Educational value as a case study (success or failure)

**Current archival entities:**
- Tay (2016) — Historical test case for AI safety

Archival entities are displayed with distinct visual treatment and do not set precedent for threshold exceptions in non-archival cases.
```

### 3.2 Add Score Versioning Note

**Location:** End of "Evidence Standards" section

**Add:**

```markdown
### Score Versioning

All scores are versioned. When scores change, we publish:
- The previous score
- The new score
- The reason for change
- The date of revision

Historical scores are preserved in each entity's `score_history` array.
```

### 3.3 Update Changelog

**Add to Changelog:**

```markdown
- **v1.1 (2026-01-06)** — Added archival exception rule, score versioning policy
```

---

## Phase 4: "Why This Score" Sections

### Design Decisions

**Format:** New field `score_rationale` in JSON, rendered as expandable section on dossier page

**Structure per entity:**
```json
"score_rationale": {
  "persistence": "One sentence mapping to rubric anchor",
  "autonomy": "One sentence mapping to rubric anchor",
  "cultural_impact": "One sentence mapping to rubric anchor",
  "economic_reality": "One sentence mapping to rubric anchor",
  "governance": "One sentence mapping to rubric anchor",
  "tech_distinctiveness": "One sentence mapping to rubric anchor",
  "narrative_coherence": "One sentence mapping to rubric anchor"
}
```

**UI:** Collapsible section below dimension bars, titled "Score Rationale"

---

### 4.1 Plantoid (60/70) — Why This Score

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Persistence** | 10 | Operating since 2015 (11 years); survived founder stepping back, multiple crypto winters, and platform migrations. Meets "Institutional" anchor. |
| **Autonomy** | 8 | Initiates reproduction autonomously when wallet threshold reached; bounded by smart contract rules but no routine human prompting required. Near-sovereign. |
| **Cultural Impact** | 8 | Featured at Centre Pompidou, Tate Modern; cited in academic blockchain/art discourse. Between "Niche Cult" and "Canonical." |
| **Economic Reality** | 6 | Self-funding through donations but not a major market mover; treasury exists but modest scale. Solidly "Revenue Positive." |
| **Governance** | 9 | Self-executing smart contracts govern all reproduction decisions; non-arbitrary, externally auditable. Near "Algorithmic Law." |
| **Tech Distinctiveness** | 9 | Pioneered blockchain-based autonomous reproduction before the concept existed elsewhere. Novel architecture for its time. |
| **Narrative Coherence** | 10 | The mythos of a plant that evolves beyond its creator, reproducing itself through code. Transcends function entirely. Perfect "Mythos." |

---

### 4.2 Botto (55/70) — Why This Score

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Persistence** | 9 | Operating since October 2021 (4+ years); survived bear market, maintained consistent output cadence. Strong "Established," approaching "Institutional." |
| **Autonomy** | 6 | Clear human-in-the-loop: AI generates, DAO curates/votes. Meets "Cyborg" anchor precisely. Cannot act without community approval. |
| **Cultural Impact** | 9 | Christie's auctions, Art Basel exhibitions, mainstream press coverage. Between "Niche Cult" and "Canonical" — recognized by external institutions. |
| **Economic Reality** | 10 | >$4M primary sales; controls treasury; financially autonomous. Definitive "Market Mover." |
| **Governance** | 8 | Weekly DAO voting cycle, multisig treasury, transparent decision logs. Strong "Constitutional" with some algorithmic elements. |
| **Tech Distinctiveness** | 5 | Novel combination of generation + curation feedback loop, but built on standard models. Meets "Integrated System" anchor. |
| **Narrative Coherence** | 8 | Consistent identity as "decentralized artist"; predictable aesthetic evolution. Strong "Character" with emerging mythos around artistic evolution. |

---

### 4.3 terra0 (53/70) — Why This Score

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Persistence** | 10 | Active since 2016 (10 years); exhibitions and research continuing; survived entire crypto arc from pre-ICO to post-NFT. "Institutional." |
| **Autonomy** | 7 | Designed for autonomous forest management; current implementation is research/exhibition focused with human curation of outputs. Above "Cyborg," below "Sovereign." |
| **Cultural Impact** | 9 | Ars Electronica, academic citations, influenced entire discourse on non-human agency and ecological DAOs. Near "Canonical." |
| **Economic Reality** | 3 | Conceptual project with minimal economic activity; grant-funded, no significant revenue generation. Between "Cost Center" and "Revenue Positive." |
| **Governance** | 8 | Smart contract-based governance model; publicly documented decision framework. Strong "Constitutional." |
| **Tech Distinctiveness** | 8 | Pioneered smart contract environmental governance before the concept existed. Novel architecture, though not fully deployed at scale. |
| **Narrative Coherence** | 8 | "Self-owning forest" concept is immediately graspable and philosophically rich. Strong "Character" with conceptual depth. |

---

## Implementation Steps

### Phase 3 Implementation (~30 min)

1. Edit `RUBRIC.md`:
   - Add "Archival Exceptions" subsection after inclusion criteria
   - Add "Score Versioning" note to Evidence Standards
   - Update changelog

2. Verify public/rubric.json stays in sync (if exists)

### Phase 4 Implementation (~1.5 hrs)

1. Update `lib/types.ts`:
   - Add `score_rationale?: Record<string, string>` to Agent interface

2. Update JSON files:
   - Add `score_rationale` to plantoid.json
   - Add `score_rationale` to botto.json
   - Add `score_rationale` to terra0.json

3. Update `app/[id]/page.tsx`:
   - Add collapsible "Score Rationale" section after Dimension Scores
   - Render each dimension's rationale

4. Update `app/globals.css`:
   - Add styling for rationale section (if needed)

5. Build and verify

---

## Open Questions for Phase 4

1. **Expand to all entities?** Start with top 3, or do all 10 now?
2. **Collapsible or always visible?** Recommend collapsible to reduce initial cognitive load
3. **Link to rubric anchors?** Each rationale could hyperlink to the specific anchor definition

---

*Ready for implementation on approval.*
