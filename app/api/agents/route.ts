/**
 * Spirit Index API - Agents Endpoint
 *
 * GET /api/agents - Returns all indexed agents
 * Query params:
 *   - sort: 'total' | 'persistence' | 'autonomy' | 'cultural_impact' | 'economic_reality' | 'governance' | 'tech_distinctiveness' | 'narrative_coherence' | 'name' | 'inception_date'
 *   - status: 'Active' | 'Dormant' | 'Deceased' | 'Subsumed' | 'Forked'
 *   - category: filter by category
 *   - limit: number of results (default: all)
 *   - fields: comma-separated list of fields to include (default: all)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllAgents, getAgentsSortedBy } from '@/lib/agents';
import { Agent } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse query parameters
  const sort = searchParams.get('sort') || 'total';
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const limit = searchParams.get('limit');
  const fields = searchParams.get('fields');

  try {
    // Get agents with sorting
    let agents: Agent[];

    const validSortFields = [
      'total', 'persistence', 'autonomy', 'cultural_impact',
      'economic_reality', 'governance', 'tech_distinctiveness',
      'narrative_coherence', 'name', 'inception_date'
    ];

    if (validSortFields.includes(sort)) {
      agents = await getAgentsSortedBy(sort as any);
    } else {
      agents = await getAllAgents();
    }

    // Filter by status
    if (status) {
      agents = agents.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by category
    if (category) {
      agents = agents.filter(a =>
        a.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Apply limit
    if (limit && !isNaN(parseInt(limit))) {
      agents = agents.slice(0, parseInt(limit));
    }

    // Filter fields if specified
    if (fields) {
      const fieldList = fields.split(',').map(f => f.trim());
      agents = agents.map(agent => {
        const filtered: Partial<Agent> = {};
        fieldList.forEach(field => {
          if (field in agent) {
            (filtered as any)[field] = (agent as any)[field];
          }
        });
        return filtered as Agent;
      });
    }

    // Build response with metadata
    const response = {
      meta: {
        total: agents.length,
        sort,
        generated_at: new Date().toISOString(),
        api_version: 'v1',
      },
      data: agents,
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}
