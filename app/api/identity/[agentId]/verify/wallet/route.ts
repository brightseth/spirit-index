/**
 * Spirit Index Identity API - Wallet Verification
 * POST /api/identity/[agentId]/verify/wallet
 *
 * Submit a signed verification challenge to prove wallet ownership.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getIdentityByAgentId,
  verifyWalletSignature,
  checkAndActivateIdentity,
} from '@/lib/identity';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.signature || !body.message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: signature, message',
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

    // Check if already verified
    if (identity.walletVerified) {
      return NextResponse.json(
        {
          success: false,
          error: 'Wallet already verified',
          code: 'ALREADY_VERIFIED',
        },
        { status: 400 }
      );
    }

    // Verify the signature
    const result = await verifyWalletSignature(
      identity.id,
      body.signature as `0x${string}`,
      body.message,
      identity.primaryWallet
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Signature verification failed',
          code: 'VERIFICATION_FAILED',
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
        walletVerified: true,
        identityActivated: activation.activated,
        remainingSteps: activation.missingSteps,
        message: activation.activated
          ? 'Identity fully verified and activated!'
          : `Wallet verified. Remaining steps: ${activation.missingSteps.join(', ')}`,
      },
    });
  } catch (error) {
    console.error('Wallet verification error:', error);
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
