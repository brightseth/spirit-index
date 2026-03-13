/**
 * Agent Data Loading Utilities
 * Loads agent data from JSON files in data/agents/
 */

import { Agent, calculateComparable } from './types';
import fs from 'fs';
import path from 'path';

const AGENTS_DIR = path.join(process.cwd(), 'data', 'agents');

/**
 * Minimum comparable_pct for an agent to be "listed" in the default index view.
 * Agents below this threshold are still tracked but hidden from public-facing views.
 */
export const QUALITY_THRESHOLD = 20;

/** Agent enriched with computed comparable metrics and listing status */
export type EnrichedAgent = Agent & {
  scoring_coverage: number;
  comparable_score: number;
  comparable_max: number;
  comparable_pct: number;
  listed: boolean;
};

/**
 * Get all agents from JSON files (internal use — includes unlisted agents)
 */
export async function getAllAgents(): Promise<EnrichedAgent[]> {
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.json'));

  const agents = files.map(file => {
    const filePath = path.join(AGENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const agent = JSON.parse(content) as Agent;
    // Compute comparable metrics if not in JSON
    const comp = calculateComparable(agent.scores);
    const comparable_pct = comp.pct;
    return {
      ...agent,
      scoring_coverage: comp.coverage,
      comparable_score: comp.score,
      comparable_max: comp.max,
      comparable_pct,
      listed: comparable_pct >= QUALITY_THRESHOLD,
    };
  });

  // Sort by comparable_pct descending by default
  return agents.sort((a, b) => b.comparable_pct - a.comparable_pct);
}

/**
 * Get only listed agents (above quality threshold) — used for public-facing views
 */
export async function getListedAgents(): Promise<EnrichedAgent[]> {
  const all = await getAllAgents();
  return all.filter(a => a.listed);
}

/**
 * Convert a comparable_pct to a letter grade
 */
export function getGrade(pct: number): string {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 67) return 'D+';
  if (pct >= 63) return 'D';
  if (pct >= 60) return 'D-';
  return 'F';
}

/**
 * Get a single agent by ID (with comparable metrics)
 */
export async function getAgentById(id: string): Promise<EnrichedAgent | null> {
  const filePath = path.join(AGENTS_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const agent = JSON.parse(content) as Agent;
  const comp = calculateComparable(agent.scores);
  const comparable_pct = comp.pct;
  return {
    ...agent,
    scoring_coverage: comp.coverage,
    comparable_score: comp.score,
    comparable_max: comp.max,
    comparable_pct,
    listed: comparable_pct >= QUALITY_THRESHOLD,
  };
}

/**
 * Get all agent IDs for static generation
 */
export async function getAllAgentIds(): Promise<string[]> {
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => f.replace('.json', ''));
}

/**
 * Get agents filtered by index tier
 */
export async function getAgentsByTier(tier: 'indexed' | 'tracked'): Promise<EnrichedAgent[]> {
  const all = await getAllAgents();
  return all.filter(a => a.index_tier === tier);
}

/**
 * Get agents sorted by a specific dimension
 */
export async function getAgentsSortedBy(
  dimension: keyof Agent['scores'] | 'total' | 'name' | 'inception_date' | 'comparable_pct' | 'index_tier'
): Promise<EnrichedAgent[]> {
  const agents = await getAllAgents();

  return agents.sort((a, b) => {
    if (dimension === 'total') {
      return b.total - a.total;
    }
    if (dimension === 'comparable_pct') {
      return b.comparable_pct - a.comparable_pct;
    }
    if (dimension === 'index_tier') {
      // indexed first, then tracked
      if (a.index_tier === b.index_tier) return b.comparable_pct - a.comparable_pct;
      return a.index_tier === 'indexed' ? -1 : 1;
    }
    if (dimension === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (dimension === 'inception_date') {
      return new Date(b.inception_date).getTime() - new Date(a.inception_date).getTime();
    }
    // Dimension score
    return (b.scores[dimension].value ?? 0) - (a.scores[dimension].value ?? 0);
  });
}
