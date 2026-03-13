/**
 * Spirit Index Public Data Feed — Batch Lookup
 *
 * POST /api/v1/lookup — Look up scores for multiple agents by ID
 *
 * Request body: { "ids": ["botto", "aixbt", "luna"] }
 * Returns scores for all requested agents. Missing IDs are reported separately.
 *
 * Useful for platforms displaying multiple agents at once.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgentById, getGrade, QUALITY_THRESHOLD } from '@/lib/agents';
import { DimensionKey, DIMENSIONS } from '@/lib/types';
import type { EnrichedAgent } from '@/lib/agents';

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
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'public, max-age=3600, s-maxage=86400',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids)) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          hint: 'Expected JSON body with "ids" array, e.g. { "ids": ["botto", "aixbt"] }',
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const ids: string[] = body.ids.slice(0, 100); // Cap at 100
    const found: ReturnType<typeof formatAgent>[] = [];
    const notFound: string[] = [];

    for (const id of ids) {
      const agent = await getAgentById(id);
      if (agent) {
        found.push(formatAgent(agent));
      } else {
        notFound.push(id);
      }
    }

    const response = {
      version: '1.0',
      updated: new Date().toISOString(),
      agents: found,
      not_found: notFound,
      meta: {
        requested: ids.length,
        found: found.length,
        not_found_count: notFound.length,
        threshold: QUALITY_THRESHOLD,
      },
    };

    return NextResponse.json(response, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process lookup request' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
