/**
 * Spirit Index Identity API - Backlink Verification
 * POST /api/identity/[agentId]/verify/backlink
 *
 * Verify that the agent's website links back to their Spirit Index dossier.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getIdentityByAgentId,
  verifyBacklink,
  checkAndActivateIdentity,
} from '@/lib/identity';
import { getAgentById } from '@/lib/agents';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;

    // Get identity binding
    const identity = await getIdentityByAgentId(agentId);

    if (!identity) {
      return NextResponse.json(
        {
          success: false,
          error: `No identity binding found for agent '${agentId}'`,
          code: 'IDENTITY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Get agent for website URL
    const agent = await getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        {
          success: false,
          error: `Agent '${agentId}' not found`,
          code: 'AGENT_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Check if already verified
    if (identity.backlinkVerified) {
      return NextResponse.json(
        {
          success: false,
          error: 'Backlink already verified',
          code: 'ALREADY_VERIFIED',
        },
        { status: 400 }
      );
    }

    // Verify backlink
    const result = await verifyBacklink(identity.id, agentId, agent.website);

    if (!result.success) {
      const dossierUrl = `https://spiritindex.org/agents/${agentId}`;
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Backlink verification failed',
          code: 'VERIFICATION_FAILED',
          instructions: {
            step1: `Add a link to ${dossierUrl} on your website`,
            step2: `We checked ${agent.website} but couldn't find the link`,
            example: `<a href="${dossierUrl}">View on Spirit Index</a>`,
            step3: 'Try verification again after adding the backlink',
          },
        },
        { status: 400 }
      );
    }

    // Check if identity should be activated
    const activation = await checkAndActivateIdentity(identity.id);

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        backlinkVerified: true,
        website: agent.website,
        identityActivated: activation.activated,
        remainingSteps: activation.missingSteps,
        message: activation.activated
          ? 'Identity fully verified and activated!'
          : `Backlink verified. Remaining steps: ${activation.missingSteps.join(', ')}`,
      },
    });
  } catch (error) {
    console.error('Backlink verification error:', error);
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
