/**
 * Spirit Index Identity API - Complete Key Rotation
 * POST /api/identity/[agentId]/rotate/complete
 *
 * Complete a pending key rotation after cooldown period.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIdentityByAgentId, completeKeyRotation } from '@/lib/identity';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();

    // Get rotation ID from body or find pending rotation
    let rotationId = body.rotationId;

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

    // If no rotation ID provided, find the pending one
    if (!rotationId) {
      const pendingRotation = await prisma.keyRotation.findFirst({
        where: {
          identityId: identity.id,
          status: 'PENDING',
        },
      });

      if (!pendingRotation) {
        return NextResponse.json(
          {
            success: false,
            error: 'No pending key rotation found',
            code: 'NO_PENDING_ROTATION',
          },
          { status: 400 }
        );
      }

      rotationId = pendingRotation.id;
    }

    // Complete the rotation
    const result = await completeKeyRotation(rotationId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to complete key rotation',
          code: 'COMPLETION_FAILED',
        },
        { status: 400 }
      );
    }

    // Get updated identity
    const updatedIdentity = await getIdentityByAgentId(agentId);

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        rotationCompleted: true,
        newPrimaryWallet: updatedIdentity?.primaryWallet,
        status: 'ACTIVE',
        message: 'Key rotation completed successfully. New wallet is now active.',
        note: 'Wallet verification has been reset. You must re-verify the new wallet.',
        nextStep: {
          action: 'Re-verify wallet',
          endpoint: `/api/identity/${agentId}/challenge`,
          method: 'POST',
        },
      },
    });
  } catch (error) {
    console.error('Key rotation completion error:', error);
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
