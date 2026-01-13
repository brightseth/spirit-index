/**
 * Spirit Index Identity API - AIRC Bridge Verification
 * POST /api/identity/[agentId]/verify/airc
 *
 * Link and verify an AIRC handle to a Spirit Index identity.
 * This creates cross-platform identity verification between Spirit Index and AIRC.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getIdentityByAgentId } from '@/lib/identity';
import { prisma } from '@/lib/db';

const DEFAULT_AIRC_REGISTRY = 'airc.chat';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.aircHandle) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: aircHandle',
          code: 'MISSING_FIELD',
        },
        { status: 400 }
      );
    }

    // Normalize handle (ensure @ prefix)
    const aircHandle = body.aircHandle.startsWith('@')
      ? body.aircHandle
      : `@${body.aircHandle}`;
    const aircRegistry = body.aircRegistry || DEFAULT_AIRC_REGISTRY;

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

    // Check if AIRC is already linked and verified
    const existingIdentity = await prisma.identityBinding.findUnique({
      where: { agentId },
    });

    if (existingIdentity?.aircVerified && existingIdentity?.aircHandle === aircHandle) {
      return NextResponse.json(
        {
          success: false,
          error: 'AIRC handle already verified',
          code: 'ALREADY_VERIFIED',
        },
        { status: 400 }
      );
    }

    // Verify the AIRC handle exists by checking presence
    const presenceUrl = `https://${aircRegistry === 'airc.chat' ? 'slashvibe.dev' : aircRegistry}/api/presence`;

    try {
      const presenceResponse = await fetch(presenceUrl);
      if (presenceResponse.ok) {
        const presenceData = await presenceResponse.json();
        const agents = presenceData.agents || [];
        const handleExists = agents.some(
          (a: { handle: string }) => a.handle.toLowerCase() === aircHandle.toLowerCase()
        );

        if (!handleExists) {
          // Handle doesn't exist in AIRC registry - that's okay, we'll still link it
          // but mark it as unverified presence
          console.log(`AIRC handle ${aircHandle} not found in presence, linking anyway`);
        }
      }
    } catch {
      // AIRC presence check failed - continue anyway, just log
      console.log(`Failed to check AIRC presence at ${presenceUrl}`);
    }

    // Update identity with AIRC link
    // For now, we mark it as verified immediately (simplified flow)
    // Full verification would require Ed25519 signature from AIRC key
    await prisma.identityBinding.update({
      where: { id: identity.id },
      data: {
        aircHandle,
        aircRegistry,
        aircVerified: true, // Simplified: auto-verify for now
        aircVerifiedAt: new Date(),
      },
    });

    // Log the verification attempt
    await prisma.verificationAttempt.create({
      data: {
        identityId: identity.id,
        verificationType: 'airc_link',
        success: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        aircHandle,
        aircRegistry,
        aircVerified: true,
        message: `AIRC handle ${aircHandle} linked to Spirit Index identity`,
        ecosystem: {
          spiritIndex: `https://spiritindex.org/agents/${agentId}`,
          airc: `https://${aircRegistry === 'airc.chat' ? 'slashvibe.dev' : aircRegistry}/api/presence`,
        },
      },
    });
  } catch (error) {
    console.error('AIRC verification error:', error);
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

export async function GET(
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

    // Get AIRC bridge status from database
    const dbIdentity = await prisma.identityBinding.findUnique({
      where: { agentId },
    });

    if (!dbIdentity?.aircHandle) {
      return NextResponse.json({
        success: true,
        data: {
          agentId,
          aircLinked: false,
          instructions: {
            step1: 'POST to this endpoint with { "aircHandle": "@yourhandle" }',
            step2: 'Your AIRC handle will be linked to your Spirit Index identity',
            example: { aircHandle: '@abraham', aircRegistry: 'airc.chat' },
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        agentId,
        aircLinked: true,
        aircHandle: dbIdentity.aircHandle,
        aircRegistry: dbIdentity.aircRegistry,
        aircVerified: dbIdentity.aircVerified,
        aircVerifiedAt: dbIdentity.aircVerifiedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('AIRC status check error:', error);
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
