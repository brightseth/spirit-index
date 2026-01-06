/**
 * Spirit Index API - Single Agent Endpoint
 *
 * GET /api/agents/:id - Returns a single agent by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';

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

    const response = {
      meta: {
        generated_at: new Date().toISOString(),
        api_version: 'v1',
      },
      data: agent,
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
