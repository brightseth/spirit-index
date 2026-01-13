/**
 * Spirit Index Identity API - Get Identity
 * GET /api/identity/[agentId]
 *
 * Get the identity binding status for an agent.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIdentityByAgentId } from '@/lib/identity';
import { getAgentById } from '@/lib/agents';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    // Check if agent exists
    const agent = await getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error: `Agent '${agentId}' not found in registry`,
          code: 'AGENT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Get identity binding
    const identity = await getIdentityByAgentId(agentId);

    if (!identity) {
      return NextResponse.json(
        {
          success: true,
          data: {
            agentId,
            agentName: agent.name,
            hasIdentity: false,
            registerUrl: '/api/identity/register',
          },
        }
      );
    }

    // Calculate verification progress
    const verificationSteps = [
      { name: 'wallet', verified: identity.walletVerified },
      { name: 'domain', verified: identity.domainVerified },
      { name: 'backlink', verified: identity.backlinkVerified },
    ];
    const completedSteps = verificationSteps.filter(s => s.verified).length;
    const progress = Math.round((completedSteps / verificationSteps.length) * 100);

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        agentName: agent.name,
        hasIdentity: true,
        identity: {
          id: identity.id,
          primaryWallet: identity.primaryWallet,
          verifiedDomain: identity.verifiedDomain,
          did: identity.did,
          ens: identity.ens,
          status: identity.status,
          registeredAt: identity.registeredAt,
          lastVerifiedAt: identity.lastVerifiedAt,
        },
        verification: {
          progress,
          steps: verificationSteps,
          fullyVerified: identity.status === 'ACTIVE',
        },
        keyRotation: identity.keyRotation,
      },
    });
  } catch (error) {
    console.error('Identity lookup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
