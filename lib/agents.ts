/**
 * Agent Data Loading Utilities
 * Loads agent data from JSON files in data/agents/
 */

import { Agent } from './types';
import fs from 'fs';
import path from 'path';

const AGENTS_DIR = path.join(process.cwd(), 'data', 'agents');

/**
 * Get all agents from JSON files
 */
export async function getAllAgents(): Promise<Agent[]> {
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.json'));

  const agents = files.map(file => {
    const filePath = path.join(AGENTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as Agent;
  });

  // Sort by total score descending by default
  return agents.sort((a, b) => b.total - a.total);
}

/**
 * Get a single agent by ID
 */
export async function getAgentById(id: string): Promise<Agent | null> {
  const filePath = path.join(AGENTS_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as Agent;
}

/**
 * Get all agent IDs for static generation
 */
export async function getAllAgentIds(): Promise<string[]> {
  const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.json'));
  return files.map(f => f.replace('.json', ''));
}

/**
 * Get agents sorted by a specific dimension
 */
export async function getAgentsSortedBy(
  dimension: keyof Agent['scores'] | 'total' | 'name' | 'inception_date'
): Promise<Agent[]> {
  const agents = await getAllAgents();

  return agents.sort((a, b) => {
    if (dimension === 'total') {
      return b.total - a.total;
    }
    if (dimension === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (dimension === 'inception_date') {
      return new Date(b.inception_date).getTime() - new Date(a.inception_date).getTime();
    }
    // Dimension score
    return b.scores[dimension].value - a.scores[dimension].value;
  });
}
