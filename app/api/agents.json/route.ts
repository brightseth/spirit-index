/**
 * Spirit Index Flat Agent List
 * GET /api/agents.json
 *
 * Simplified flat JSON for LLM consumption.
 * Optimized for context windows - minimal structure, key facts only.
 */
import { NextResponse } from 'next/server';
import { getAllAgents } from '@/lib/agents';

export const dynamic = 'force-dynamic';

export async function GET() {
  const agents = getAllAgents();

  // Flatten to minimal structure for LLM consumption
  const flatAgents = agents.map(agent => {
    const scores = agent.scores || {};
    const totalScore = Object.values(scores).reduce((sum: number, dim: any) => {
      return sum + (dim?.value || 0);
    }, 0);

    return {
      id: agent.id,
      name: agent.name,
      tagline: agent.tagline,
      category: agent.category,
      status: agent.status,
      since: agent.inception_date,
      website: agent.website,
      score: totalScore,
      scores: {
        persistence: scores.persistence?.value || 0,
        autonomy: scores.autonomy?.value || 0,
        cultural: scores.cultural_impact?.value || 0,
        economic: scores.economic_sustainability?.value || 0,
        governance: scores.governance?.value || 0,
        technical: scores.technical?.value || 0
      }
    };
  });

  const response = {
    _description: "Spirit Index - The peer-reviewed registry of autonomous cultural agents",
    _api_docs: "https://spiritindex.org/api/openapi.json",
    _verify_agent: "GET /api/verify/{agentId}",
    _discover_agents: "GET /api/discover?capability=art",
    _updated: new Date().toISOString(),
    _count: flatAgents.length,
    agents: flatAgents
  };

  return NextResponse.json(response, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
