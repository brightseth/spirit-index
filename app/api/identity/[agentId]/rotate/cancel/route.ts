/**
 * Spirit Index Identity API - Cancel Key Rotation
 * POST /api/identity/[agentId]/rotate/cancel
 *
 * Cancel a pending key rotation before it completes.
 * Requires signature from current wallet.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIdentityByAgentId, cancelKeyRotation } from '@/lib/identity';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();

    // Validate signature
    if (!body.signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: signature',
          code: 'MISSING_FIELDS',
        },
        { status: 400 }
      );
    }

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

    // Find pending rotation
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

    // Cancel the rotation
    const result = await cancelKeyRotation(pendingRotation.id, body.signature);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to cancel key rotation',
          code: 'CANCELLATION_FAILED',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        rotationCancelled: true,
        currentWallet: identity.primaryWallet,
        status: 'CANCELLED',
        message: 'Key rotation cancelled. Identity has been reactivated.',
      },
    });
  } catch (error) {
    console.error('Key rotation cancellation error:', error);
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
