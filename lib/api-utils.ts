/**
 * Shared utilities for Spirit Index v1 API
 *
 * Consistent envelope, CORS headers, error formatting, and
 * response helpers used across all v1 endpoints.
 */

import { NextResponse } from 'next/server';
import { EnrichedAgent, getGrade, QUALITY_THRESHOLD } from './agents';
import { DimensionKey, DIMENSIONS } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const API_VERSION = 'v1';
export const BASE_URL = 'https://spiritindex.org';

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ---------------------------------------------------------------------------
// OPTIONS handler (reusable for all endpoints)
// ---------------------------------------------------------------------------

export function handleOptions(): NextResponse {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

interface SuccessOptions {
  cacheControl: string;
  extraHeaders?: Record<string, string>;
}

export function jsonSuccess(
  data: unknown,
  meta: Record<string, unknown>,
  opts: SuccessOptions,
): NextResponse {
  const body = {
    data,
    meta: {
      api_version: API_VERSION,
      generated_at: new Date().toISOString(),
      ...meta,
    },
  };
  return NextResponse.json(body, {
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': opts.cacheControl,
      ...opts.extraHeaders,
    },
  });
}

interface ErrorPayload {
  code: string;
  message: string;
  hint?: string;
}

export function jsonError(
  status: number,
  error: ErrorPayload,
  cacheControl = 'no-cache',
): NextResponse {
  const body = {
    error,
    meta: {
      api_version: API_VERSION,
      generated_at: new Date().toISOString(),
    },
  };
  return NextResponse.json(body, {
    status,
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': cacheControl,
    },
  });
}

// ---------------------------------------------------------------------------
// Agent formatting
// ---------------------------------------------------------------------------

/** Summary format — used in list endpoints */
export function formatAgentSummary(agent: EnrichedAgent) {
  const dimensions: Record<string, number | null> = {};
  for (const key of Object.keys(DIMENSIONS) as DimensionKey[]) {
    dimensions[key] = agent.scores[key].value;
  }

  return {
    id: agent.id,
    name: agent.name,
    tagline: agent.tagline,
    category: agent.category,
    status: agent.status,
    network: agent.network,
    tier: agent.index_tier,
    listed: agent.listed,
    score: agent.comparable_pct,
    grade: getGrade(agent.comparable_pct),
    inception_date: agent.inception_date,
    website: agent.website,
    dimensions,
    url: `${BASE_URL}/${agent.id}`,
    badge: `${BASE_URL}/badge/${agent.id}`,
  };
}

/** Full format — used in single-agent endpoints */
export function formatAgentFull(agent: EnrichedAgent) {
  const dimensions: Record<
    string,
    {
      value: number | null;
      confidence: string;
      method: string;
      label: string;
      description: string;
      rationale?: string;
    }
  > = {};

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

  return {
    id: agent.id,
    name: agent.name,
    tagline: agent.tagline,
    category: agent.category,
    classification: agent.classification,
    disclosure: agent.disclosure,
    status: agent.status,
    network: agent.network,
    tier: agent.index_tier,
    listed: agent.listed,
    score: agent.comparable_pct,
    grade: getGrade(agent.comparable_pct),
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
    url: `${BASE_URL}/${agent.id}`,
    badge: `${BASE_URL}/badge/${agent.id}`,
  };
}

// ---------------------------------------------------------------------------
// Sorting helper
// ---------------------------------------------------------------------------

const DIMENSION_KEYS = Object.keys(DIMENSIONS) as DimensionKey[];

const VALID_SORT_FIELDS = [
  'score',
  'name',
  'inception_date',
  ...DIMENSION_KEYS,
] as const;

export type SortField = (typeof VALID_SORT_FIELDS)[number];

export function isValidSortField(s: string): s is SortField {
  return (VALID_SORT_FIELDS as readonly string[]).includes(s);
}

export function sortAgents(
  agents: EnrichedAgent[],
  sort: SortField,
  order: 'asc' | 'desc',
): EnrichedAgent[] {
  const sorted = [...agents];
  const dir = order === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    if (sort === 'score') {
      return (a.comparable_pct - b.comparable_pct) * dir;
    }
    if (sort === 'name') {
      return a.name.localeCompare(b.name) * dir;
    }
    if (sort === 'inception_date') {
      return (
        (new Date(a.inception_date).getTime() -
          new Date(b.inception_date).getTime()) *
        dir
      );
    }
    // Dimension sort
    const aVal = a.scores[sort as DimensionKey]?.value ?? -1;
    const bVal = b.scores[sort as DimensionKey]?.value ?? -1;
    return (aVal - bVal) * dir;
  });

  return sorted;
}

// ---------------------------------------------------------------------------
// Pagination helper
// ---------------------------------------------------------------------------

export function paginate<T>(
  items: T[],
  page: number,
  perPage: number,
): { items: T[]; page: number; perPage: number; totalPages: number } {
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page,
    perPage,
    totalPages: Math.ceil(items.length / perPage) || 1,
  };
}

// ---------------------------------------------------------------------------
// Param helpers
// ---------------------------------------------------------------------------

export function clampInt(
  raw: string | null,
  defaultVal: number,
  min: number,
  max: number,
): number {
  if (!raw) return defaultVal;
  const n = parseInt(raw, 10);
  if (isNaN(n)) return defaultVal;
  return Math.max(min, Math.min(max, n));
}

export { QUALITY_THRESHOLD };
