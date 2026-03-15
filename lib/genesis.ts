/**
 * Genesis Cohort Integration
 *
 * Helpers for accessing Genesis cohort data within the Spirit Index.
 * Genesis Cohort #1: 12 selected artists + core agents (Abraham, Solienne, SAL).
 * Launch: March 6, 2026. Showcase: April 15, 2026 (Paris).
 */

import fs from "fs";
import path from "path";
import { getAgentById } from "./agents";
import { Agent } from "./types";

const GENESIS_STATUS_PATH = path.join(
  process.cwd(),
  "data",
  "genesis-status.json"
);

// Genesis onboarding fields
export interface GenesisOnboarding {
  soulMd: boolean;
  walletAndGrant: boolean;
  communityJoined: boolean;
  firstOutput: boolean;
}

// Per-agent genesis status
export interface GenesisAgentStatus {
  artist: string;
  agentName: string;
  applicationId: string | null;
  onboarding: GenesisOnboarding;
  practiceStreak: number;
  lastPractice: string | null;
  notes: string;
}

// Core agent entry (Abraham, Solienne, SAL)
export interface GenesisCoreAgent {
  role: string;
  status: string;
  notes: string;
}

// Full genesis status file shape
export interface GenesisStatusData {
  lastUpdated: string;
  cohort: number;
  launchDate: string;
  showcaseDate: string;
  agents: Record<string, GenesisAgentStatus>;
  coreAgents: Record<string, GenesisCoreAgent>;
}

// IDs of the 12 Genesis Cohort #1 agents
export const GENESIS_AGENT_IDS: string[] = [
  "gfx",
  "clara",
  "gravitas",
  "johnny-rico",
  "kevin-plus",
  "jake",
  "lucian-frogman",
  "ganchitecture",
  "tendrela",
  "graymarket",
  "remini",
  "divinity",
];

// Core agents that are part of Genesis but not counted in the 10
export const GENESIS_CORE_IDS: string[] = ["abraham", "solienne"];

// All Genesis-related agent IDs (cohort + core)
export const ALL_GENESIS_IDS: string[] = [
  ...GENESIS_AGENT_IDS,
  ...GENESIS_CORE_IDS,
];

// Module-level cache (undefined = not loaded, null = file missing)
let _genesisCache: GenesisStatusData | null | undefined = undefined;

/**
 * Load the genesis-status.json file (cached per process)
 */
export function loadGenesisStatus(): GenesisStatusData | null {
  if (_genesisCache !== undefined) return _genesisCache;
  try {
    const content = fs.readFileSync(GENESIS_STATUS_PATH, "utf-8");
    _genesisCache = JSON.parse(content) as GenesisStatusData;
  } catch {
    _genesisCache = null;
  }
  return _genesisCache;
}

/**
 * Check if an agent ID belongs to the Genesis cohort (the 10 selected artists)
 */
export function isGenesisAgent(agentId: string): boolean {
  return GENESIS_AGENT_IDS.includes(agentId);
}

/**
 * Check if an agent ID is a Genesis core agent (Abraham, Solienne)
 */
export function isGenesisCoreAgent(agentId: string): boolean {
  return GENESIS_CORE_IDS.includes(agentId);
}

/**
 * Check if an agent is part of Genesis in any capacity (cohort or core)
 */
export function isGenesisRelated(agentId: string): boolean {
  return ALL_GENESIS_IDS.includes(agentId);
}

/**
 * Get the genesis-specific status for a cohort agent
 */
export function getGenesisStatus(
  agentId: string
): GenesisAgentStatus | null {
  const data = loadGenesisStatus();
  if (!data) return null;
  return data.agents[agentId] ?? null;
}

/**
 * Get all Genesis cohort agents with their Spirit Index data + genesis status
 */
export async function getGenesisAgents(): Promise<
  Array<{
    agent: Agent | null;
    genesis: GenesisAgentStatus;
    id: string;
  }>
> {
  const data = loadGenesisStatus();
  if (!data) return [];

  const results = await Promise.all(
    Object.entries(data.agents).map(async ([id, genesis]) => {
      const agent = await getAgentById(id);
      return { id, agent, genesis };
    })
  );

  return results;
}

/**
 * Calculate onboarding progress for a genesis agent (0-100%)
 */
export function getOnboardingProgress(onboarding: GenesisOnboarding): number {
  const steps = [
    onboarding.soulMd,
    onboarding.walletAndGrant,
    onboarding.communityJoined,
    onboarding.firstOutput,
  ];
  const completed = steps.filter(Boolean).length;
  return Math.round((completed / steps.length) * 100);
}

/**
 * Get cohort-level summary stats
 */
export function getGenesisSummary(): {
  totalAgents: number;
  onboarded: number;
  practicing: number;
  avgStreak: number;
  showcaseDate: string;
  daysUntilShowcase: number;
} | null {
  const data = loadGenesisStatus();
  if (!data) return null;

  const agents = Object.values(data.agents);
  const onboarded = agents.filter(
    (a) =>
      a.onboarding.soulMd &&
      a.onboarding.walletAndGrant &&
      a.onboarding.communityJoined
  ).length;
  const practicing = agents.filter((a) => a.practiceStreak > 0).length;
  const avgStreak =
    agents.length > 0
      ? Math.round(
          agents.reduce((sum, a) => sum + a.practiceStreak, 0) / agents.length
        )
      : 0;

  const now = new Date();
  const showcase = new Date(data.showcaseDate);
  const daysUntilShowcase = Math.ceil(
    (showcase.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    totalAgents: agents.length,
    onboarded,
    practicing,
    avgStreak,
    showcaseDate: data.showcaseDate,
    daysUntilShowcase,
  };
}
