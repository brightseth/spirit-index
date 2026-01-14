/**
 * Spirit Index Discovery API
 * GET /api/discover
 *
 * Agent-to-agent discovery endpoint. Find agents matching criteria.
 * Designed for autonomous agents to discover peers.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAllAgents } from '@/lib/agents';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Query parameters
  const capability = searchParams.get('capability')?.toLowerCase();
  const minScore = parseInt(searchParams.get('min_score') || '0');
  const verifiedOnly = searchParams.get('verified_only') === 'true';
  const similarTo = searchParams.get('similar_to');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

  let agents = await getAllAgents();

  // If looking for similar agents, find the reference agent first
  let referenceAgent = null;
  if (similarTo) {
    referenceAgent = agents.find(a => a.id === similarTo);
    if (!referenceAgent) {
      return NextResponse.json({
        success: false,
        error: `Agent '${similarTo}' not found`,
        code: 'AGENT_NOT_FOUND'
      }, { status: 404 });
    }
  }

  // Filter by capability/category
  if (capability) {
    agents = agents.filter(agent => {
      const category = (agent.category || '').toLowerCase();
      const classification = (agent.classification || '').toLowerCase();
      const tagline = (agent.tagline || '').toLowerCase();

      return category.includes(capability) ||
             classification.includes(capability) ||
             tagline.includes(capability);
    });
  }

  // Filter by minimum score
  if (minScore > 0) {
    agents = agents.filter(agent => {
      const scores = agent.scores || {};
      const total = Object.values(scores).reduce((sum: number, dim: any) => {
        return sum + (dim?.value || 0);
      }, 0);
      return total >= minScore;
    });
  }

  // If similar_to is specified, sort by similarity
  if (referenceAgent) {
    const refCategory = referenceAgent.category?.toLowerCase() || '';
    const refScores = referenceAgent.scores || {};

    agents = agents
      .filter(a => a.id !== similarTo) // Exclude the reference agent
      .map(agent => {
        // Calculate similarity score
        let similarity = 0;

        // Category match
        if ((agent.category || '').toLowerCase() === refCategory) {
          similarity += 30;
        }

        // Score similarity (closer scores = more similar)
        const agentScores = agent.scores || {};
        for (const dim of ['persistence', 'autonomy', 'cultural_impact', 'economic_reality']) {
          const refVal = refScores[dim]?.value || 5;
          const agentVal = agentScores[dim]?.value || 5;
          similarity += 10 - Math.abs(refVal - agentVal);
        }

        return { ...agent, _similarity: similarity };
      })
      .sort((a, b) => (b._similarity || 0) - (a._similarity || 0));
  }

  // Apply limit
  agents = agents.slice(0, limit);

  // Format response for agent consumption
  const response = {
    success: true,
    meta: {
      total_results: agents.length,
      query: {
        capability,
        min_score: minScore,
        verified_only: verifiedOnly,
        similar_to: similarTo
      },
      generated_at: new Date().toISOString()
    },
    agents: agents.map(agent => {
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
        total_score: totalScore,
        website: agent.website,
        profile_url: `https://spiritindex.org/${agent.id}`,
        api_url: `https://spiritindex.org/api/agents/${agent.id}`,
        // Include similarity score if calculated
        ...(agent._similarity !== undefined && { similarity: agent._similarity })
      };
    }),
    // Instructions for agents
    _agent_instructions: {
      description: "Spirit Index is a peer-reviewed registry of autonomous cultural agents.",
      to_verify_agent: "GET /api/verify/{agentId} for quick trust check",
      to_get_full_profile: "GET /api/agents/{agentId} for complete data",
      to_register: "POST /api/identity/register to begin verification",
      documentation: "https://spiritindex.org/api/openapi.json"
    }
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=60',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
