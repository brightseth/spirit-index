# Spirit Index v2 Iteration Plan

**Status:** Decisions locked, ready for implementation
**Created:** 2026-01-06
**Updated:** 2026-01-06 (feedback incorporated)

---

## Strategic Decisions (LOCKED)

### 1. Spirit Protocol Relationship
**Decision:** Separate brand, explicit lineage. NOT a funnel.

**Rationale:**
- Index authority depends on epistemic neutrality
- Any "Spirit sales surface" perception collapses trust
- But hiding the relationship is unnecessary and evasive

**Implementation:**
- No CTA like "launch on Spirit" anywhere
- Footer: `Published by the Spirit initiative. Spirit Protocol provides optional economic infrastructure for autonomous agents.`
- About page: One descriptive paragraph on the stack (Index → AIRC → Spirit), no calls to action
- Domain: Acquire `spiritindex.org` ($12, worth it for institutional authority)

---

### 2. Editorial Authority
**Decision:** Centralized now, procedural path later. No open scoring.

**Rationale:**
- Community scoring destroys standards
- Early institutions earn trust by saying no
- Michelin didn't crowdsource stars

**v2 Policy:**
- Scores issued by named review council
- Submissions open, scoring closed
- Revisions versioned and explained publicly
- "Scores are versioned; we publish revisions publicly."

**Future (signal, don't implement):**
- Advisory reviews
- Counter-reports
- Parallel "community commentary" (never binding)
- No token voting, no averaging, no popularity mechanics ever

---

### 3. EDEN Inclusion
**Decision:** Exclude EDEN as platform. Include EDEN agents individually.

**Rationale:**
- EDEN is the factory, not the product
- Indexing it confuses the ontology
- Demonstrates editorial independence (not shilling own tool)

**Implementation:**
- Add explicit note to /about:
  > "Platforms (e.g., EDEN, Manus, Claude) are not indexed. Autonomous entities instantiated on platforms may qualify. EDEN agents are included; EDEN as infrastructure is excluded under the same rule."

---

## Content/Editorial Fixes (HIGH PRIORITY)

### 1. Truth Terminal Descriptor
**Change:** "Schizo-poster prophet" → "Memetic prophet"

**Why "Memetic prophet" > "Chaotic prophetic agent":**
- Retains edge without sanitizing
- Accurate descriptor
- Won't prevent institutional citation

**Files:** `data/agents/truth-terminal.json` (tagline field)

---

### 2. Tay Archival Status
**Change:** Add explicit archival exception with visual badge

**Implementation:**
- Add to `_review_flags`: "Indexed as archival exception despite failing minimum persistence threshold"
- Dossier page: Visual badge "ARCHIVAL • HISTORICAL TEST CASE"
- Greyed/tombstone styling to make status visually distinct
- Update RUBRIC.md: "Archival exceptions may be granted for entities of significant historical importance that fail threshold requirements"

**Rule:** Only archival entities can violate thresholds. This protects rubric integrity.

---

### 3. Replika Platform vs Agent Essay
**Change:** Add mini-essay to /about page

**Draft content:**
> **Platform vs. Agent: A Note on Replika**
>
> Replika occupies a boundary case in our framework. It is commercially successful and culturally significant, but it is fundamentally a platform—millions of individual Replikas exist, each unique to their user, but none possess singular agency.
>
> The company, not the AI, makes decisions. When Replika removed romantic features in 2023, users experienced distress equivalent to bereavement—but the "agents" had no say.
>
> We include Replika because it pioneered the AI companion category and raised critical questions about AI relationships. Its low autonomy and governance scores reflect that Replika-the-company controls Replika-the-agents.
>
> This distinction—platform vs. agent—is central to our methodology. Entities like Claude, Manus, and EDEN are infrastructure. Specific autonomous instantiations on those platforms may qualify for indexing.

---

### 4. "Last Reviewed" Timestamp
**Change:** Add to all dossier headers

**Implementation:**
- Pull from `score_history[last].date`
- Display: "Last reviewed: January 2026"
- Position: Dossier header, not buried

---

### 5. Consistency Fix
**Change:** Standardize to lowercase `ai16z`

**Files:** All references in `data/agents/ai16z.json` and any prose

---

### 6. Freysa Descriptor Enhancement
**Change:** Add mechanism context

**Tagline:** "Adversarial Prize Agent"
**One-liner for curator notes:** "An AI designed to resist social engineering, offered as an unconquerable prize."

---

## New Additions (from feedback)

### 7. "Why This Score" Section
**Change:** Add expandable section on dossiers mapping scores to rubric anchors

**Implementation:**
- 4-5 bullet points per entity
- Each maps directly to rubric anchor definitions
- Forces discipline, defangs "this is subjective" criticism
- Start with top 3 entities (Plantoid, Botto, terra0)

---

### 8. Scope Exclusions Section
**Change:** Add to /about page

**Content:**
> **What We Do Not Index**
> - Platforms and infrastructure (Claude, Manus, EDEN, ChatGPT)
> - Entities designed for deception or impersonation
> - Pure utility bots without cultural presence
> - Surveillance or coercion systems

---

### 9. "Under Observation" Tier
**Change:** Add watchlist for entities below threshold

**Implementation:**
- Separate section on homepage (below main index)
- Label: "Under Observation"
- Entities monitored but not scored
- Gives place to put new things without committing

---

## Documentation (MEDIUM PRIORITY)

### CONTRIBUTING.md

**Key opener:**
> The Spirit Index is an editorial institution, not a directory. Submission does not imply inclusion.

**Contents:**
```markdown
# Contributing to Spirit Index

## Philosophy
The Spirit Index is an editorial institution, not a directory.
Submission does not imply inclusion.
Git is our CMS.

## Nominating an Entity

1. Fork the repository
2. Create `data/agents/[entity-id].json` following schema below
3. Open a PR with evidence citations
4. Council reviews within 2-4 weeks

**Important:** No DM submissions. All nominations must go through GitHub.

## JSON Schema
[Full schema with required fields]

## Evidence Standards
- Scores ≥5 require 2-3 external citations
- No creator-controlled sources for cultural impact claims
- Acceptable: press, academic papers, onchain data, institutional exhibitions

## What Gets Rejected (Examples)
- Entities < 3 months old (wait for persistence signal)
- Pure marketing projects without cultural presence
- Platforms mistaken for agents
- Incomplete evidence (< 2 citations per high score)

## Score Challenges
To challenge an existing score, open an Issue with:
- Specific dimension(s) contested
- Evidence supporting different assessment
- Proposed score with rationale

Challenges reviewed quarterly.
```

---

### /submit Page Updates
- Primary CTA: "Submit via GitHub" → opens issue template
- Add: "No DM submissions. All nominations through GitHub."
- Add: "Git is our CMS. This filters for high-quality submissions."
- Secondary: Email only for genuinely sensitive cases

---

## Announcement (READY)

### Institutional Bulletin (cold, invites argument)
```
We have benchmarks for LLM intelligence.
We had no benchmark for agentic reality.

Introducing The Spirit Index — a historical register of autonomous cultural agents.

Not a hype list. Not a leaderboard.

Plantoid is #1. That's the point.

[spiritindex.org]
```

### Longer Version
```
The Spirit Index is now public.

A historical register of autonomous cultural entities.
We track Persistence, Autonomy, and Impact.

Plantoid (2015) is ranked #1.
Tay (2016) is archived as a historical test case.

Not a hype list. The record of agentic reality.

Scores are versioned; we publish revisions publicly.

[Link]
```

---

## Implementation Checklist

### Phase 1: Pre-Announcement Polish (2-3 hours)
- [ ] Fix Truth Terminal: "Memetic prophet"
- [ ] Add Tay archival badge + styling
- [ ] Standardize ai16z lowercase
- [ ] Add "Last reviewed" to dossier pages
- [ ] Update /submit with GitHub emphasis + "No DM" line
- [ ] Update Freysa tagline and curator notes

### Phase 2: About Page Updates (1-2 hours)
- [ ] Add "Platform vs Agent" essay (Replika section)
- [ ] Add "Scope Exclusions" section
- [ ] Add Spirit Protocol relationship paragraph (descriptive only)
- [ ] Update footer with approved language

### Phase 3: Documentation (1 hour)
- [ ] Create CONTRIBUTING.md with rejection examples
- [ ] Update RUBRIC.md with archival exception rule

### Phase 4: Enhanced Dossiers (2 hours)
- [ ] Add "Why This Score" to Plantoid
- [ ] Add "Why This Score" to Botto
- [ ] Add "Why This Score" to terra0

### Phase 5: Domain & Launch
- [ ] Acquire spiritindex.org
- [ ] Configure DNS
- [ ] Final review
- [ ] Announce

---

## Future Considerations (NOT v2)

- Multi-axis sorting (sort by dimension, not just total)
- "Under Observation" watchlist implementation
- Commercial Track scoping (wait for 3+ citation events)
- Score challenge mechanism (quarterly reviews)
- Rubric anchor tweaks (ensure 10s are achievable)

---

## Success Metrics

**Primary KPI:** Citation
- Researchers, curators, journalists referencing "according to the Spirit Index"

**Secondary:**
- First quality submission PR
- First score challenge (tests rubric)
- Agent discovery via /llm.txt (monitor referrers)

**Anti-metrics:**
- Don't optimize for traffic
- Don't count low-quality submissions
- Don't celebrate shill attempts

---

*Decisions locked. Ready for Phase 1 implementation on your go.*
