/**
 * Spirit Index API - Single Agent Endpoint
 *
 * GET /api/agents/:id - Returns a single agent by ID
 * Includes comparable score fields: comparable_score, comparable_max, comparable_pct, scoring_coverage, index_tier
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';
import { calculateComparable } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    const agent = await getAgentById(id);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found', id },
        { status: 404 }
      );
    }

    // Compute comparable metrics
    const comp = calculateComparable(agent.scores);
    const enrichedAgent = {
      ...agent,
      comparable_score: comp.score,
      comparable_max: comp.max,
      comparable_pct: comp.pct,
      scoring_coverage: comp.coverage,
    };

    const response = {
      meta: {
        generated_at: new Date().toISOString(),
        api_version: 'v1',
      },
      data: enrichedAgent,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}
