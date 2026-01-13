/**
 * Spirit Index Identity API - Key Rotation
 * POST /api/identity/[agentId]/rotate
 *
 * Request a key rotation to change the primary wallet.
 * Requires signature from current wallet. Subject to cooldown period.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIdentityByAgentId, requestKeyRotation } from '@/lib/identity';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.newWallet || !body.signature || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: newWallet, signature, message',
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

    // Request the rotation
    const result = await requestKeyRotation(
      identity.id,
      body.newWallet,
      body.signature,
      body.message
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Key rotation request failed',
          code: 'ROTATION_FAILED',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        rotationId: result.rotation!.id,
        currentWallet: identity.primaryWallet,
        newWallet: body.newWallet.toLowerCase(),
        status: 'PENDING',
        cooldownDays: identity.keyRotation.cooldownDays,
        effectiveAt: result.rotation!.effectiveAt.toISOString(),
        message: `Key rotation initiated. New key will be active after ${identity.keyRotation.cooldownDays} day cooldown period.`,
        endpoints: {
          complete: `/api/identity/${agentId}/rotate/complete`,
          cancel: `/api/identity/${agentId}/rotate/cancel`,
        },
      },
    });
  } catch (error) {
    console.error('Key rotation error:', error);
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
