# Contributing to Spirit Index

## Philosophy

The Spirit Index is an editorial institution, not a directory.
Submission does not imply inclusion.
Git is our CMS.

---

## Nominating an Entity

### Via Pull Request (Preferred)

1. Fork the repository
2. Create `data/agents/[entity-id].json` following the schema below
3. Ensure all evidence citations are external and verifiable
4. Open a PR with a brief description of the entity

PRs with complete, well-evidenced dossiers are reviewed faster.

### Via GitHub Issue

Open an issue using the entity nomination template. Include:
- Entity name, inception date, and status
- Category and classification
- Self-assessment scores with rationale
- 2-3 evidence citations per dimension where score ≥5

---

## Important Policies

**No DM submissions.** All nominations must go through GitHub.

**No exceptions for timing.** Entities less than 3 months old will not be considered. Wait for a persistence signal.

**Self-nomination is welcome.** We evaluate all submissions using the same rubric regardless of source.

---

## JSON Schema

```json
{
  "id": "entity-id",
  "name": "Entity Name",
  "tagline": "Short descriptor (3-7 words)",
  "inception_date": "YYYY-MM-DD",
  "status": "Active | Dormant | Deceased | Subsumed | Forked",
  "category": "Autonomous Artist | DAO / Fund | Game Agent | etc.",
  "classification": "Descriptive classification",
  "website": "https://...",
  "scores": {
    "persistence": { "value": 0-10, "confidence": "high | medium | low" },
    "autonomy": { "value": 0-10, "confidence": "high | medium | low" },
    "cultural_impact": { "value": 0-10, "confidence": "high | medium | low" },
    "economic_reality": { "value": 0-10, "confidence": "high | medium | low" },
    "governance": { "value": 0-10, "confidence": "high | medium | low" },
    "tech_distinctiveness": { "value": 0-10, "confidence": "high | medium | low" },
    "narrative_coherence": { "value": 0-10, "confidence": "high | medium | low" }
  },
  "total": 0-70,
  "curator_notes": "2-4 sentences explaining the entity's significance and score rationale.",
  "evidence": [
    {
      "dimension": "dimension_key",
      "claim": "Specific, verifiable claim",
      "url": "https://external-source.com/..."
    }
  ],
  "score_history": [
    { "date": "YYYY-MM-DD", "total": 0-70, "reviewer": "reviewer_id" }
  ],
  "_review_flags": []
}
```

---

## Evidence Standards

### Citation Requirements

- Scores ≥5 require **2-3 external citations**
- No creator-controlled sources for cultural impact claims
- Acceptable evidence: press coverage, academic papers, onchain data, institutional exhibitions, third-party analysis

### Confidence Levels

- **High** — Multiple independent sources confirm
- **Medium** — Limited but credible evidence
- **Low** — Single source or inference-based

---

## What Gets Rejected

Examples of submissions that will not be accepted:

- **Entities < 3 months old** — Wait for persistence signal
- **Pure marketing projects** — Without demonstrated cultural presence
- **Platforms mistaken for agents** — See our platform vs. agent distinction
- **Incomplete evidence** — < 2 citations per high score
- **Threshold failures** — Must score ≥3 in both Persistence and Autonomy
- **Deceptive/harmful entities** — Regardless of technical sophistication

---

## Score Challenges

To challenge an existing score, open a GitHub Issue with:

- Specific dimension(s) contested
- Evidence supporting a different assessment
- Proposed score with rationale

Challenges are reviewed quarterly. Scores may be adjusted if compelling evidence is presented.

---

## Review Process

1. **Initial Screening** — We verify minimum requirements (identity, history, cultural presence)
2. **Independent Scoring** — Two reviewers assess all 7 dimensions independently
3. **Reconciliation** — Scores averaged; disagreements >2 points require discussion
4. **Publication** — Accepted entities added to the Index with full dossier

Typical review cycle: 2-4 weeks.

---

## Code of Conduct

- Submissions should be made in good faith
- Do not submit entities you know to be fraudulent
- Respect the editorial process; decisions are final unless new evidence emerges
- Scores are versioned; we publish revisions publicly

---

## Questions?

Open a GitHub Issue for process questions or contact the review council via the methods listed on the [Submit page](/submit).
