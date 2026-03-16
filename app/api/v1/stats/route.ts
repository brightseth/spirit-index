/**
 * GET /api/v1/stats
 *
 * Aggregate statistics about the Spirit Index.
 * Score stats computed over listed agents only.
 * Dimension averages count only non-null scores.
 */

import { getAllAgents, getGrade, QUALITY_THRESHOLD } from '@/lib/agents';
import { DimensionKey, DIMENSIONS } from '@/lib/types';
import {
  handleOptions,
  jsonSuccess,
  jsonError,
} from '@/lib/api-utils';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const allAgents = await getAllAgents();
    const listed = allAgents.filter((a) => a.listed);
    const unlisted = allAgents.filter((a) => !a.listed);

    // Tier distribution
    const tierDistribution: Record<string, number> = { indexed: 0, tracked: 0 };
    for (const a of allAgents) {
      tierDistribution[a.index_tier] = (tierDistribution[a.index_tier] || 0) + 1;
    }

    // Status distribution
    const statusDistribution: Record<string, number> = {};
    for (const a of allAgents) {
      statusDistribution[a.status] = (statusDistribution[a.status] || 0) + 1;
    }

    // Network distribution
    const networkDistribution: Record<string, number> = {};
    for (const a of allAgents) {
      networkDistribution[a.network] = (networkDistribution[a.network] || 0) + 1;
    }

    // Score stats (listed agents only)
    const scores = listed.map((a) => a.comparable_pct).sort((a, b) => a - b);
    const sum = scores.reduce((acc, s) => acc + s, 0);
    const mean = scores.length > 0 ? +(sum / scores.length).toFixed(1) : 0;
    const median =
      scores.length > 0
        ? scores.length % 2 === 0
          ? +((scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2).toFixed(1)
          : scores[Math.floor(scores.length / 2)]
        : 0;
    const min = scores.length > 0 ? scores[0] : 0;
    const max = scores.length > 0 ? scores[scores.length - 1] : 0;
    const variance =
      scores.length > 0
        ? scores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / scores.length
        : 0;
    const stdDev = +(Math.sqrt(variance)).toFixed(1);

    // Grade distribution (all agents)
    const gradeDistribution: Record<string, number> = {};
    for (const a of allAgents) {
      const grade = getGrade(a.comparable_pct);
      gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
    }

    // Dimension averages (only non-null scores across all agents)
    const dimensionKeys = Object.keys(DIMENSIONS) as DimensionKey[];
    const dimensionAverages: Record<string, number> = {};
    for (const key of dimensionKeys) {
      const vals = allAgents
        .map((a) => a.scores[key].value)
        .filter((v): v is number => v !== null);
      dimensionAverages[key] =
        vals.length > 0 ? +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : 0;
    }

    // Top 10 agents by score
    const topAgents = [...allAgents]
      .sort((a, b) => b.comparable_pct - a.comparable_pct)
      .slice(0, 10)
      .map((a) => ({
        id: a.id,
        name: a.name,
        score: a.comparable_pct,
      }));

    // Last updated: most recent score_history entry across all agents
    let lastUpdated: string | null = null;
    for (const a of allAgents) {
      for (const entry of a.score_history) {
        if (!lastUpdated || entry.date > lastUpdated) {
          lastUpdated = entry.date;
        }
      }
    }

    return jsonSuccess(
      {
        total_agents: allAgents.length,
        total_listed: listed.length,
        total_unlisted: unlisted.length,
        quality_threshold: QUALITY_THRESHOLD,
        tier_distribution: tierDistribution,
        status_distribution: statusDistribution,
        network_distribution: networkDistribution,
        score_stats: {
          mean,
          median,
          min,
          max,
          std_dev: stdDev,
        },
        grade_distribution: gradeDistribution,
        dimension_averages: dimensionAverages,
        top_agents: topAgents,
        last_updated: lastUpdated
          ? new Date(lastUpdated + 'T00:00:00.000Z').toISOString()
          : null,
      },
      {},
      {
        cacheControl:
          'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    );
  } catch (error) {
    console.error('GET /api/v1/stats error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to compute stats.',
    });
  }
}
