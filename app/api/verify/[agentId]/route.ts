/**
 * Spirit Index Quick Verify API
 * GET /api/verify/{agentId}
 *
 * Simple trust check for agent-to-agent interactions.
 * Returns minimal data for fast trust decisions.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';
import { getIdentityByAgentId } from '@/lib/identity';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;

  // Check if agent is indexed
  const agent = getAgentById(agentId);
  const indexed = !!agent;

  // Check identity verification status
  let verified = false;
  let verificationDetails = null;

  if (indexed) {
    try {
      const identity = await getIdentityByAgentId(agentId);
      if (identity) {
        verified = identity.walletVerified && identity.domainVerified;
        verificationDetails = {
          wallet_verified: identity.walletVerified,
          domain_verified: identity.domainVerified,
          backlink_verified: identity.backlinkVerified,
          status: identity.status
        };
      }
    } catch {
      // Identity lookup failed, agent not verified
    }
  }

  // Calculate score if indexed
  let score = 0;
  if (agent) {
    const scores = agent.scores || {};
    score = Object.values(scores).reduce((sum: number, dim: any) => {
      return sum + (dim?.value || 0);
    }, 0);
  }

  const response = {
    // Core trust signals - designed for fast agent decisions
    agent_id: agentId,
    indexed,
    verified,
    score,

    // Quick trust recommendation
    trust_level: !indexed ? 'unknown' :
                 !verified ? 'indexed' :
                 score >= 50 ? 'high' :
                 score >= 30 ? 'medium' : 'low',

    // Additional context if indexed
    ...(agent && {
      name: agent.name,
      category: agent.category,
      status: agent.status,
      inception_date: agent.inception_date,
      profile_url: `https://spiritindex.org/${agentId}`,
    }),

    // Verification details if available
    ...(verificationDetails && { verification: verificationDetails }),

    // Metadata
    meta: {
      checked_at: new Date().toISOString(),
      registry: 'Spirit Index',
      registry_url: 'https://spiritindex.org'
    }
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, max-age=300', // 5 min cache for trust checks
      'Access-Control-Allow-Origin': '*'
    }
  });
}
