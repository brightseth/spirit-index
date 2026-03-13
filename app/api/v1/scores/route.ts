/**
 * Spirit Index Public Data Feed — v1 Scores
 *
 * GET /api/v1/scores — Returns scored agents for external consumption
 *
 * Query params:
 *   - network:    Filter by network (e.g., "Virtuals Protocol", "Ethereum Native")
 *   - tier:       Filter by index tier ("indexed" | "tracked")
 *   - min_score:  Minimum comparable_pct (0-100)
 *   - sort:       Sort field ("score" | "name" | "inception_date"), default "score"
 *   - include:    "all" to include agents below quality threshold
 *   - limit:      Max results
 *
 * Designed for browser-side consumption (CORS enabled).
 * Cache: 1h browser, 24h CDN.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllAgents, getGrade, QUALITY_THRESHOLD, EnrichedAgent } from '@/lib/agents';
import { DimensionKey, DIMENSIONS } from '@/lib/types';

function formatAgent(agent: EnrichedAgent) {
  const dimensions: Record<string, number | null> = {};
  for (const key of Object.keys(DIMENSIONS) as DimensionKey[]) {
    dimensions[key] = agent.scores[key].value;
  }

  return {
    id: agent.id,
    name: agent.name,
    score: agent.comparable_pct,
    grade: getGrade(agent.comparable_pct),
    tier: agent.index_tier,
    network: agent.network,
    status: agent.status,
    category: agent.category,
    listed: agent.listed,
    dimensions,
    url: `https://spiritindex.org/${agent.id}`,
    badge: `https://spiritindex.org/badge/${agent.id}`,
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const network = searchParams.get('network');
  const tier = searchParams.get('tier');
  const minScore = searchParams.get('min_score');
  const sort = searchParams.get('sort') || 'score';
  const include = searchParams.get('include');
  const limit = searchParams.get('limit');

  try {
    let agents = await getAllAgents();

    // Keep reference to all for meta counts
    const allAgents = agents;

    // Default: listed only
    if (include !== 'all') {
      agents = agents.filter(a => a.listed);
    }

    // Filter by network
    if (network) {
      agents = agents.filter(a =>
        a.network.toLowerCase() === network.toLowerCase()
      );
    }

    // Filter by tier
    if (tier) {
      agents = agents.filter(a => a.index_tier === tier);
    }

    // Filter by min_score
    if (minScore && !isNaN(parseInt(minScore))) {
      const min = parseInt(minScore);
      agents = agents.filter(a => a.comparable_pct >= min);
    }

    // Sort
    if (sort === 'name') {
      agents.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'inception_date') {
      agents.sort((a, b) =>
        new Date(b.inception_date).getTime() - new Date(a.inception_date).getTime()
      );
    } else {
      // Default: score descending
      agents.sort((a, b) => b.comparable_pct - a.comparable_pct);
    }

    // Limit
    if (limit && !isNaN(parseInt(limit))) {
      agents = agents.slice(0, parseInt(limit));
    }

    const response = {
      version: '1.0',
      updated: new Date().toISOString(),
      agents: agents.map(formatAgent),
      meta: {
        total: allAgents.length,
        listed: allAgents.filter(a => a.listed).length,
        indexed: allAgents.filter(a => a.index_tier === 'indexed').length,
        tracked: allAgents.filter(a => a.index_tier === 'tracked').length,
        threshold: QUALITY_THRESHOLD,
      },
    };

    return NextResponse.json(response, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
