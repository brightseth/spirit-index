/**
 * Spirit Index Public Data Feed — Single Agent Score
 *
 * GET /api/v1/scores/:id — Returns full score data for a single agent
 *
 * Returns all dimensions, rationale, evidence, and score history.
 * 404 with helpful error for unknown agent IDs.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgentById, getGrade, QUALITY_THRESHOLD } from '@/lib/agents';
import { DimensionKey, DIMENSIONS } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
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

export async function GET(request: NextRequest, { params }: Props) {
  const { id } = await params;

  try {
    const agent = await getAgentById(id);

    if (!agent) {
      return NextResponse.json(
        {
          error: 'Agent not found',
          id,
          hint: `No agent with ID "${id}" exists in the Spirit Index. Use GET /api/v1/scores to list all agents, or check the ID at https://spiritindex.org`,
        },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Build full dimensions with metadata
    const dimensions: Record<string, {
      value: number | null;
      confidence: string;
      method: string;
      label: string;
      description: string;
      rationale?: string;
    }> = {};

    for (const key of Object.keys(DIMENSIONS) as DimensionKey[]) {
      dimensions[key] = {
        value: agent.scores[key].value,
        confidence: agent.scores[key].confidence,
        method: agent.scores[key].method,
        label: DIMENSIONS[key].label,
        description: DIMENSIONS[key].description,
        rationale: agent.score_rationale?.[key],
      };
    }

    const response = {
      version: '1.0',
      updated: new Date().toISOString(),
      agent: {
        id: agent.id,
        name: agent.name,
        tagline: agent.tagline,
        score: agent.comparable_pct,
        grade: getGrade(agent.comparable_pct),
        tier: agent.index_tier,
        listed: agent.listed,
        network: agent.network,
        status: agent.status,
        category: agent.category,
        classification: agent.classification,
        inception_date: agent.inception_date,
        website: agent.website,
        dimensions,
        scoring: {
          comparable_score: agent.comparable_score,
          comparable_max: agent.comparable_max,
          comparable_pct: agent.comparable_pct,
          coverage: agent.scoring_coverage,
          total_raw: agent.total,
        },
        curator_notes: agent.curator_notes,
        evidence: agent.evidence,
        score_history: agent.score_history,
        url: `https://spiritindex.org/${agent.id}`,
        badge: `https://spiritindex.org/badge/${agent.id}`,
      },
      meta: {
        threshold: QUALITY_THRESHOLD,
      },
    };

    return NextResponse.json(response, { headers: CORS_HEADERS });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
