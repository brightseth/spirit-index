/**
 * Spirit Index API - Agents Endpoint
 *
 * GET /api/agents - Returns listed agents (above quality threshold) by default
 * Query params:
 *   - include: 'all' to include agents below quality threshold (default: listed only)
 *   - sort: 'total' | 'comparable_pct' | 'persistence' | 'autonomy' | 'cultural_impact' | 'economic_reality' | 'governance' | 'tech_distinctiveness' | 'narrative_coherence' | 'name' | 'inception_date'
 *   - status: 'Active' | 'Dormant' | 'Deceased' | 'Subsumed' | 'Forked'
 *   - tier: 'indexed' | 'tracked'
 *   - category: filter by category
 *   - network: filter by network affiliation (e.g., 'Spirit Protocol', 'Virtuals Protocol', 'Independent')
 *   - limit: number of results (default: all)
 *   - fields: comma-separated list of fields to include (default: all)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllAgents, getListedAgents, getAgentsSortedBy, QUALITY_THRESHOLD, EnrichedAgent } from '@/lib/agents';
import { Agent } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Parse query parameters
  const include = searchParams.get('include');
  const sort = searchParams.get('sort') || 'total';
  const status = searchParams.get('status');
  const tier = searchParams.get('tier');
  const category = searchParams.get('category');
  const network = searchParams.get('network');
  const limit = searchParams.get('limit');
  const fields = searchParams.get('fields');

  try {
    // Get agents with sorting
    let agents: EnrichedAgent[];

    const validSortFields = [
      'total', 'comparable_pct', 'persistence', 'autonomy', 'cultural_impact',
      'economic_reality', 'governance', 'tech_distinctiveness',
      'narrative_coherence', 'economic_infrastructure',
      'identity_sovereignty', 'name', 'inception_date'
    ];

    if (validSortFields.includes(sort)) {
      agents = await getAgentsSortedBy(sort as any);
    } else {
      agents = await getAllAgents();
    }

    // Keep a reference to all agents for meta counts
    const allAgents = agents;

    // Default: listed only. Use ?include=all to get everything.
    if (include !== 'all') {
      agents = agents.filter(a => a.listed);
    }

    // Filter by status
    if (status) {
      agents = agents.filter(a => a.status.toLowerCase() === status.toLowerCase());
    }

    // Filter by tier
    if (tier) {
      agents = agents.filter(a => a.index_tier === tier);
    }

    // Filter by category
    if (category) {
      agents = agents.filter(a =>
        a.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Filter by network
    if (network) {
      agents = agents.filter(a =>
        a.network.toLowerCase() === network.toLowerCase()
      );
    }

    // Apply limit
    if (limit && !isNaN(parseInt(limit))) {
      agents = agents.slice(0, parseInt(limit));
    }

    // Filter fields if specified
    let responseData: any[] = agents;
    if (fields) {
      const fieldList = fields.split(',').map(f => f.trim());
      responseData = agents.map(agent => {
        const filtered: Record<string, unknown> = {};
        fieldList.forEach(field => {
          if (field in agent) {
            filtered[field] = (agent as any)[field];
          }
        });
        return filtered;
      });
    }

    // Build response with metadata
    const response = {
      meta: {
        total: agents.length,
        indexed: allAgents.filter(a => a.index_tier === 'indexed').length,
        tracked: allAgents.filter(a => a.index_tier === 'tracked').length,
        total_tracked: allAgents.length,
        below_threshold: allAgents.filter(a => !a.listed).length,
        threshold: QUALITY_THRESHOLD,
        sort,
        generated_at: new Date().toISOString(),
        api_version: 'v1',
      },
      data: responseData,
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
