/**
 * GET /api/v1/genesis
 *
 * Returns Genesis Cohort agents. Combines scored agent data from
 * data/agents/ (filtered by network === "Spirit Protocol") with
 * cohort metadata from data/genesis-status.json.
 */

import { NextRequest } from 'next/server';
import { getAllAgents } from '@/lib/agents';
import {
  handleOptions,
  jsonSuccess,
  jsonError,
  formatAgentSummary,
  sortAgents,
  isValidSortField,
  type SortField,
} from '@/lib/api-utils';
import fs from 'fs';
import path from 'path';

interface GenesisAgentMeta {
  artist: string;
  agentName: string;
  applicationId: string | null;
  onboarding: {
    soulMd: boolean;
    walletAndGrant: boolean;
    communityJoined: boolean;
    firstOutput: boolean;
  };
  practiceStreak: number;
  lastPractice: string | null;
  notes: string;
}

interface CoreAgentMeta {
  role: string;
  status: string;
  notes: string;
}

interface GenesisStatus {
  lastUpdated: string;
  cohort: number;
  launchDate: string;
  showcaseDate: string;
  agents: Record<string, GenesisAgentMeta>;
  coreAgents: Record<string, CoreAgentMeta>;
}

function loadGenesisStatus(): GenesisStatus {
  const filePath = path.join(process.cwd(), 'data', 'genesis-status.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as GenesisStatus;
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const sortRaw = sp.get('sort') || 'score';
    const orderRaw = sp.get('order') || 'desc';

    if (!isValidSortField(sortRaw)) {
      return jsonError(400, {
        code: 'INVALID_PARAMETER',
        message: `Invalid sort field "${sortRaw}".`,
        hint: 'Use ?sort=score for default ordering.',
      });
    }

    if (orderRaw !== 'asc' && orderRaw !== 'desc') {
      return jsonError(400, {
        code: 'INVALID_PARAMETER',
        message: `Invalid order "${orderRaw}". Must be "asc" or "desc".`,
      });
    }

    const allAgents = await getAllAgents();
    const genesisStatus = loadGenesisStatus();

    // Genesis agents = Spirit Protocol network agents that appear in genesis-status.json
    const genesisAgentIds = new Set(Object.keys(genesisStatus.agents));
    const coreAgentIds = new Set(Object.keys(genesisStatus.coreAgents));

    // Get Spirit Protocol agents that are either in genesis agents or core agents
    let genesisAgents = allAgents.filter(
      (a) =>
        a.network === 'Spirit Protocol' &&
        (genesisAgentIds.has(a.id) || coreAgentIds.has(a.id)),
    );

    // Sort
    genesisAgents = sortAgents(
      genesisAgents,
      sortRaw as SortField,
      orderRaw as 'asc' | 'desc',
    );

    // Enrich with genesis metadata
    const enrichedAgents = genesisAgents.map((agent) => {
      const genesisMeta = genesisStatus.agents[agent.id];
      const coreMeta = genesisStatus.coreAgents[agent.id];

      const summary = formatAgentSummary(agent);

      return {
        ...summary,
        artist: genesisMeta?.artist ?? coreMeta?.notes?.split('.')[0] ?? undefined,
        role: coreMeta?.role ?? (genesisMeta ? 'Genesis Cohort' : undefined),
      };
    });

    // Separate cohort agents from core agents for the response
    const cohortAgents = enrichedAgents.filter((a) =>
      genesisAgentIds.has(a.id),
    );
    const coreAgentsList = Object.entries(genesisStatus.coreAgents).map(
      ([id, meta]) => ({
        id,
        role: meta.role,
        status: meta.status,
      }),
    );

    return jsonSuccess(
      {
        cohort: genesisStatus.cohort,
        launch_date: genesisStatus.launchDate,
        showcase_date: genesisStatus.showcaseDate,
        agents: cohortAgents,
        core_agents: coreAgentsList,
      },
      {
        total_genesis_agents: cohortAgents.length,
        total_core_agents: coreAgentsList.length,
      },
      {
        cacheControl:
          'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      },
    );
  } catch (error) {
    console.error('GET /api/v1/genesis error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch genesis cohort.',
    });
  }
}
