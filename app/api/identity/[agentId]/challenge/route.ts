/**
 * Spirit Index Identity API - Generate Challenge
 * POST /api/identity/[agentId]/challenge
 *
 * Generate a verification challenge for wallet signing.
 * The agent must sign this message to prove wallet ownership.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIdentityByAgentId, generateVerificationChallenge } from '@/lib/identity';
import { prisma } from '@/lib/db';

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

    // Generate challenge
    const challenge = generateVerificationChallenge(agentId);

    // Store the challenge for later verification
    // We'll store it in the verification attempts table with a special type
    await prisma.verificationAttempt.create({
      data: {
        identityId: identity.id,
        verificationType: 'wallet_signature',
        success: false, // Will be updated when verified
        challengeNonce: challenge.nonce,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        challenge: {
          nonce: challenge.nonce,
          message: challenge.message,
          expiresAt: challenge.expiresAt.toISOString(),
        },
        instructions: {
          step1: 'Sign the message above using your registered wallet',
          step2: 'Submit the signature to POST /api/identity/' + agentId + '/verify/wallet',
          walletAddress: identity.primaryWallet,
        },
      },
    });
  } catch (error) {
    console.error('Challenge generation error:', error);
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
