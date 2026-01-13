/**
 * Spirit Index Identity API - Endorsement Eligibility
 * GET /api/identity/[agentId]/eligibility
 *
 * Check if an agent is eligible to endorse other agents.
 * Requirements: Active identity, 30+ days indexed, high-confidence scores.
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkEndorsementEligibility } from '@/lib/identity';
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

    // Check eligibility
    const eligibility = await checkEndorsementEligibility(agentId);

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        agentName: agent.name,
        eligible: eligibility.eligible,
        requirements: eligibility.requirements,
        reasons: eligibility.reasons,
        message: eligibility.eligible
          ? 'Agent is eligible to submit endorsements and challenges'
          : `Agent is not yet eligible: ${eligibility.reasons.join('; ')}`,
        capabilities: eligibility.eligible
          ? {
              canEndorse: true,
              canChallenge: true,
              maxEndorsementAdjustment: 3,
              maxChallengeStake: 100, // TODO: Calculate based on reputation
            }
          : {
              canEndorse: false,
              canChallenge: false,
            },
      },
    });
  } catch (error) {
    console.error('Eligibility check error:', error);
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
