/**
 * Spirit Index Identity API - Registration
 * POST /api/identity/register
 *
 * Register a new identity binding for an agent.
 * This is the first step in the identity verification process.
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerIdentity } from '@/lib/identity';
import type { IdentityBindingRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['agentId', 'primaryWallet', 'verifiedDomain'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`,
            code: 'MISSING_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Construct request
    const identityRequest: IdentityBindingRequest = {
      agentId: body.agentId,
      primaryWallet: body.primaryWallet,
      verifiedDomain: body.verifiedDomain,
      did: body.did,
      ens: body.ens,
      keyRotation: body.keyRotation,
    };

    // Register the identity
    const result = await registerIdentity(identityRequest);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          code: 'REGISTRATION_FAILED',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          identity: result.identity,
          nextSteps: [
            {
              step: 1,
              action: 'wallet_verification',
              description: 'Sign a verification challenge with your wallet',
              endpoint: `/api/identity/${body.agentId}/challenge`,
              method: 'POST',
            },
            {
              step: 2,
              action: 'domain_verification',
              description: 'Host spirit-identity.json at /.well-known/',
              endpoint: `/api/identity/${body.agentId}/verify/domain`,
              method: 'POST',
            },
            {
              step: 3,
              action: 'backlink_verification',
              description: 'Add a link to your Spirit Index dossier',
              endpoint: `/api/identity/${body.agentId}/verify/backlink`,
              method: 'POST',
            },
          ],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Identity registration error:', error);
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
