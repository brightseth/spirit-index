/**
 * GET /api/v1/agents
 *
 * List all agents. Paginated, filterable, sortable.
 * Returns only listed agents (above quality threshold) by default.
 * Use ?include=all to include unlisted agents.
 */

import { NextRequest } from 'next/server';
import { getAllAgents } from '@/lib/agents';
import {
  handleOptions,
  jsonSuccess,
  jsonError,
  formatAgentSummary,
  sortAgents,
  paginate,
  clampInt,
  isValidSortField,
  QUALITY_THRESHOLD,
  type SortField,
} from '@/lib/api-utils';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    // Pagination
    const page = clampInt(sp.get('page'), 1, 1, 10000);
    const perPage = clampInt(sp.get('per_page'), 50, 1, 100);

    // Sorting
    const sortRaw = sp.get('sort') || 'score';
    const orderRaw = sp.get('order') || 'desc';

    if (!isValidSortField(sortRaw)) {
      return jsonError(400, {
        code: 'INVALID_PARAMETER',
        message: `Invalid sort field "${sortRaw}". Valid fields: score, name, inception_date, persistence, autonomy, cultural_impact, economic_reality, governance, tech_distinctiveness, narrative_coherence, economic_infrastructure, identity_sovereignty.`,
        hint: 'Use ?sort=score for default ordering.',
      });
    }

    if (orderRaw !== 'asc' && orderRaw !== 'desc') {
      return jsonError(400, {
        code: 'INVALID_PARAMETER',
        message: `Invalid order "${orderRaw}". Must be "asc" or "desc".`,
      });
    }

    // Filters
    const tier = sp.get('tier');
    const status = sp.get('status');
    const network = sp.get('network');
    const category = sp.get('category');
    const minScoreRaw = sp.get('min_score');
    const include = sp.get('include');

    // Load all agents
    const allAgents = await getAllAgents();

    // Start with full set, then filter
    let agents = [...allAgents];

    // Default: listed only
    if (include !== 'all') {
      agents = agents.filter((a) => a.listed);
    }

    // Filter by tier
    if (tier) {
      if (tier !== 'indexed' && tier !== 'tracked') {
        return jsonError(400, {
          code: 'INVALID_PARAMETER',
          message: `Invalid tier "${tier}". Must be "indexed" or "tracked".`,
        });
      }
      agents = agents.filter((a) => a.index_tier === tier);
    }

    // Filter by status
    if (status) {
      agents = agents.filter(
        (a) => a.status.toLowerCase() === status.toLowerCase(),
      );
    }

    // Filter by network
    if (network) {
      agents = agents.filter(
        (a) => a.network.toLowerCase() === network.toLowerCase(),
      );
    }

    // Filter by category (partial, case-insensitive)
    if (category) {
      agents = agents.filter((a) =>
        a.category.toLowerCase().includes(category.toLowerCase()),
      );
    }

    // Filter by min_score
    if (minScoreRaw) {
      const minScore = parseInt(minScoreRaw, 10);
      if (!isNaN(minScore)) {
        agents = agents.filter((a) => a.comparable_pct >= minScore);
      }
    }

    // Sort
    agents = sortAgents(agents, sortRaw as SortField, orderRaw as 'asc' | 'desc');

    // Counts before pagination
    const totalResults = agents.length;

    // Paginate
    const paged = paginate(agents, page, perPage);

    return jsonSuccess(paged.items.map(formatAgentSummary), {
      page: paged.page,
      per_page: paged.perPage,
      total_results: totalResults,
      total_pages: paged.totalPages,
      total_tracked: allAgents.length,
      total_listed: allAgents.filter((a) => a.listed).length,
      total_indexed: allAgents.filter((a) => a.index_tier === 'indexed').length,
      total_auto_tracked: allAgents.filter((a) => a.index_tier === 'tracked').length,
      quality_threshold: QUALITY_THRESHOLD,
      sort: sortRaw,
      order: orderRaw,
    }, {
      cacheControl: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    });
  } catch (error) {
    console.error('GET /api/v1/agents error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch agents.',
    });
  }
}
