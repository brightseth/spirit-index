/**
 * GET /api/v1/agents/:slug
 *
 * Get a single agent with full score breakdown, dimensions with rationale,
 * evidence, and score history.
 */

import { NextRequest } from 'next/server';
import { getAgentById } from '@/lib/agents';
import {
  handleOptions,
  jsonSuccess,
  jsonError,
  formatAgentFull,
  QUALITY_THRESHOLD,
} from '@/lib/api-utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { slug } = await params;

    const agent = await getAgentById(slug);

    if (!agent) {
      return jsonError(404, {
        code: 'AGENT_NOT_FOUND',
        message: `No agent with ID "${slug}" exists in the Spirit Index.`,
        hint: 'Use GET /api/v1/agents to list all agents, or check the ID at https://spiritindex.org',
      });
    }

    return jsonSuccess(formatAgentFull(agent), {
      quality_threshold: QUALITY_THRESHOLD,
    }, {
      cacheControl: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    });
  } catch (error) {
    console.error('GET /api/v1/agents/[slug] error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch agent.',
    });
  }
}
