/**
 * GET /api/v1/search
 *
 * Search agents by name, tagline, category, or classification.
 * Case-insensitive substring match. Results sorted by relevance:
 * exact name match first, then name prefix, then other matches,
 * with score as tiebreaker.
 */

import { NextRequest } from 'next/server';
import { getAllAgents, EnrichedAgent } from '@/lib/agents';
import {
  handleOptions,
  jsonSuccess,
  jsonError,
  formatAgentSummary,
  clampInt,
} from '@/lib/api-utils';

export async function OPTIONS() {
  return handleOptions();
}

/** Relevance bucket: lower = higher relevance */
function relevanceBucket(agent: EnrichedAgent, queryLower: string): number {
  const nameLower = agent.name.toLowerCase();

  // Exact name match
  if (nameLower === queryLower) return 0;

  // Name starts with query
  if (nameLower.startsWith(queryLower)) return 1;

  // Name contains query
  if (nameLower.includes(queryLower)) return 2;

  // ID exact match
  if (agent.id === queryLower) return 3;

  // Tagline, category, classification match
  return 4;
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const q = sp.get('q');
    const limit = clampInt(sp.get('limit'), 20, 1, 100);
    const include = sp.get('include');

    // Validate required query param
    if (!q || q.trim().length < 2) {
      return jsonError(400, {
        code: 'INVALID_PARAMETER',
        message:
          "Query parameter 'q' is required and must be at least 2 characters.",
        hint: 'Example: GET /api/v1/search?q=botto',
      });
    }

    const queryLower = q.trim().toLowerCase();

    let agents = await getAllAgents();

    // Default: listed only
    if (include !== 'all') {
      agents = agents.filter((a) => a.listed);
    }

    // Substring match against name, tagline, category, classification, and id
    const matches = agents.filter((a) => {
      const haystack = [
        a.name,
        a.tagline,
        a.category,
        a.classification,
        a.id,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(queryLower);
    });

    // Sort by relevance bucket, then score descending as tiebreaker
    matches.sort((a, b) => {
      const bucketA = relevanceBucket(a, queryLower);
      const bucketB = relevanceBucket(b, queryLower);
      if (bucketA !== bucketB) return bucketA - bucketB;
      return b.comparable_pct - a.comparable_pct;
    });

    // Limit results
    const limited = matches.slice(0, limit);

    return jsonSuccess(limited.map(formatAgentSummary), {
      query: q.trim(),
      total_results: matches.length,
    }, {
      cacheControl: 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    });
  } catch (error) {
    console.error('GET /api/v1/search error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to search agents.',
    });
  }
}
