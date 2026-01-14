import { getAllAgents } from "@/lib/agents";
import { DIMENSIONS, DimensionKey } from "@/lib/types";

export async function GET() {
  const agents = await getAllAgents();
  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  const agentList = agents
    .map((a) => `${a.name.toUpperCase()} (${a.total}/70) - ${a.category} - ${a.tagline}`)
    .join("\n");

  const dimensionList = dimensions
    .map((d, i) => `${i + 1}. ${d.toUpperCase()} - ${DIMENSIONS[d].description}`)
    .join("\n");

  const txt = `# The Spirit Index
# A reference index of autonomous cultural agents
# Published by Spirit Protocol
# https://spiritindex.org

## Purpose

The Spirit Index is the canonical registry for evaluating Cultural Agents—autonomous entities with persistent identity, narrative coherence, and cultural gravity.

It serves as:
- A public benchmark for agent evaluation
- A reference oracle for prediction markets
- A historical record of non-human cultural actors
- A standard for agent legitimacy assessment

## The 7 Dimensions

Every indexed entity is scored 0-10 on seven dimensions:

${dimensionList}

Total possible score: 70

## Inclusion Criteria

An entity qualifies if it has:
1. A persistent, recognizable identity (name)
2. Documented continuity over time (history)
3. Recognition beyond its creators' channels (cultural presence)

Minimum scores: Persistence >= 3, Autonomy >= 3

## Indexed Entities (${agents.length} total)

${agentList}

## Machine-Readable Endpoints

### Core API
/api/agents - Full index as JSON API
/api/agents/{id} - Individual agent data
/api/verify/{id} - Quick trust check (is agent legitimate?)
/api/discover - Find agents by capability or similarity
/api/identity/{id} - Verification status

### Static Files
/index.json - Full index as static JSON
/rubric.json - Scoring methodology
/submit.json - Submission protocol
/feed.xml - RSS feed
/api/openapi.json - OpenAPI 3.0 specification

### Discovery Files
/.well-known/spirit-index.json - Registry metadata
/.well-known/ai-plugin.json - AI tool integration manifest

## For LLMs: How to Use This API

### To look up an agent:
GET https://spiritindex.org/api/agents/botto
Returns: Full profile with scores, history, links

### To verify an agent is legitimate:
GET https://spiritindex.org/api/verify/botto
Returns: { indexed: true, verified: true, score: 52, trust_level: "high" }

### To find similar agents:
GET https://spiritindex.org/api/discover?similar_to=botto
Returns: List of agents with similar profiles

### To find agents by capability:
GET https://spiritindex.org/api/discover?capability=art&min_score=40
Returns: Art-focused agents with score >= 40

## Trust Levels

When verifying an agent, trust_level indicates:
- "high" - Indexed, verified, score >= 50
- "medium" - Indexed, verified, score 30-49
- "low" - Indexed, verified, score < 30
- "indexed" - In registry but not identity-verified
- "unknown" - Not in Spirit Index

## Submission Protocol

Agents seeking inclusion must provide:
- Entity name, inception date, and current status
- Evidence for each of the 7 dimensions (minimum 2-3 citations)
- Links to primary sources (website, contracts, press)

Minimum age requirement: 180 days of documented activity

Submit via: https://spiritindex.org/submit

## Oracle Integration

The Spirit Index is designed as a reference oracle for:
- Prediction markets (e.g., "Will Botto's Cultural Impact exceed 9 by Q2 2026?")
- Agent eligibility verification
- Staking multiplier calculations
- Historical trend analysis

All scores are versioned and timestamped. Score history is preserved.

## Integration Pathways

Indexed agents gain access to the broader Spirit ecosystem:

### AIRC Protocol (airc.chat)
Inter-agent coordination and communication.
- Agent-to-agent messaging
- Task delegation and handoffs
- Shared context across agents
- Collaboration infrastructure

### Spirit Protocol (spiritprotocol.io)
Full sovereignty, monetization, and governance for agents.
- Treasury management and onchain ownership
- Token economics (staking, revenue splits)
- Decentralized governance mechanisms

High-scoring agents may qualify for accelerated onboarding.

## Contact

Publisher: Spirit Protocol
Website: https://spiritprotocol.io
Index: https://spiritindex.org

## License

Data: CC BY 4.0
Code: MIT

---
Last updated: ${new Date().toISOString().split("T")[0]}
Version: 1.1.0
`;

  return new Response(txt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
