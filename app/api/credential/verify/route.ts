/**
 * Spirit Index Credential Verification API
 * POST /api/credential/verify
 *
 * Verifies a Spirit Index Verifiable Credential.
 * Other services can use this to verify credentials presented by agents.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';
import { getIdentityByAgentId } from '@/lib/identity';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

interface VerifiableCredential {
  '@context': string[];
  type: string[];
  id: string;
  issuer: { id: string } | string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    agentId: string;
    indexed: boolean;
    verified: boolean;
    score: number;
    trust_level: string;
  };
  proof: {
    type: string;
    created: string;
    contentHash: string;
  };
}

export async function POST(request: NextRequest) {
  let body: { credential: VerifiableCredential };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({
      success: false,
      valid: false,
      error: 'Invalid JSON body',
      code: 'INVALID_REQUEST'
    }, { status: 400 });
  }

  const { credential } = body;

  if (!credential) {
    return NextResponse.json({
      success: false,
      valid: false,
      error: 'Missing credential in request body',
      code: 'MISSING_CREDENTIAL'
    }, { status: 400 });
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check credential structure
  if (!credential['@context']?.includes('https://www.w3.org/2018/credentials/v1')) {
    errors.push('Invalid @context - must include W3C credentials context');
  }

  if (!credential.type?.includes('SpiritIndexCredential')) {
    errors.push('Invalid type - must include SpiritIndexCredential');
  }

  // 2. Check issuer
  const issuerId = typeof credential.issuer === 'string'
    ? credential.issuer
    : credential.issuer?.id;

  if (issuerId !== 'did:web:spiritindex.org') {
    errors.push('Invalid issuer - must be did:web:spiritindex.org');
  }

  // 3. Check expiration
  const now = new Date();
  const expirationDate = new Date(credential.expirationDate);

  if (expirationDate < now) {
    errors.push(`Credential expired on ${credential.expirationDate}`);
  }

  // 4. Check issuance date
  const issuanceDate = new Date(credential.issuanceDate);
  if (issuanceDate > now) {
    errors.push('Credential issuance date is in the future');
  }

  // 5. Verify the agent still exists and check current status
  const agentId = credential.credentialSubject?.agentId;
  if (!agentId) {
    errors.push('Missing agentId in credentialSubject');
  }

  let currentStatus = null;
  if (agentId && errors.length === 0) {
    const agent = await getAgentById(agentId);

    if (!agent) {
      errors.push(`Agent ${agentId} no longer exists in Spirit Index`);
    } else {
      // Calculate current score
      const scores = agent.scores || {};
      const currentScore = Object.values(scores).reduce((sum: number, dim: any) => {
        return sum + (dim?.value || 0);
      }, 0);

      // Check verification status
      let currentVerified = false;
      try {
        const identity = await getIdentityByAgentId(agentId);
        if (identity) {
          currentVerified = identity.walletVerified && identity.domainVerified;
        }
      } catch {
        // No identity
      }

      currentStatus = {
        indexed: true,
        verified: currentVerified,
        score: currentScore,
        trust_level: !currentVerified ? 'indexed' :
                     currentScore >= 50 ? 'high' :
                     currentScore >= 30 ? 'medium' : 'low'
      };

      // Check if status has changed significantly
      if (credential.credentialSubject.verified && !currentVerified) {
        warnings.push('Agent verification status has changed since credential issuance');
      }

      const scoreDiff = Math.abs(currentScore - credential.credentialSubject.score);
      if (scoreDiff > 10) {
        warnings.push(`Agent score has changed significantly (was ${credential.credentialSubject.score}, now ${currentScore})`);
      }
    }
  }

  // 6. Verify proof hash (integrity check)
  if (credential.proof?.contentHash && agentId) {
    const expectedHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        agentId,
        indexed: credential.credentialSubject.indexed,
        verified: credential.credentialSubject.verified,
        score: credential.credentialSubject.score,
        issuanceDate: credential.issuanceDate
      }))
      .digest('hex');

    if (credential.proof.contentHash !== expectedHash) {
      errors.push('Credential integrity check failed - content has been modified');
    }
  }

  const valid = errors.length === 0;

  return NextResponse.json({
    success: true,
    valid,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
    credential_summary: valid ? {
      agent_id: agentId,
      issued: credential.issuanceDate,
      expires: credential.expirationDate,
      claimed: {
        indexed: credential.credentialSubject.indexed,
        verified: credential.credentialSubject.verified,
        score: credential.credentialSubject.score,
        trust_level: credential.credentialSubject.trust_level
      },
      current: currentStatus
    } : undefined
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
