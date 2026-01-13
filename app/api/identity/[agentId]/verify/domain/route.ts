/**
 * Spirit Index Identity API - Domain Verification
 * POST /api/identity/[agentId]/verify/domain
 *
 * Verify domain control by checking /.well-known/spirit-identity.json
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getIdentityByAgentId,
  verifyDomainControl,
  checkAndActivateIdentity,
} from '@/lib/identity';

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
    if (identity.domainVerified) {
      return NextResponse.json(
        {
          success: false,
          error: 'Domain already verified',
          code: 'ALREADY_VERIFIED',
        },
        { status: 400 }
      );
    }

    // Verify domain control
    const result = await verifyDomainControl(
      identity.id,
      identity.verifiedDomain,
      identity.primaryWallet
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Domain verification failed',
          code: 'VERIFICATION_FAILED',
          instructions: {
            step1: `Create a file at https://${identity.verifiedDomain}/.well-known/spirit-identity.json`,
            step2: 'The file must contain:',
            example: {
              agentId: agentId,
              primaryWallet: identity.primaryWallet,
              spiritIndexDossier: `https://spiritindex.org/agents/${agentId}`,
              updatedAt: new Date().toISOString(),
            },
            step3: 'Try verification again after hosting the file',
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
        domainVerified: true,
        domain: identity.verifiedDomain,
        identityActivated: activation.activated,
        remainingSteps: activation.missingSteps,
        message: activation.activated
          ? 'Identity fully verified and activated!'
          : `Domain verified. Remaining steps: ${activation.missingSteps.join(', ')}`,
      },
    });
  } catch (error) {
    console.error('Domain verification error:', error);
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
