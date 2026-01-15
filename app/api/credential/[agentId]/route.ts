/**
 * Spirit Index Verifiable Credential API
 * GET /api/credential/{agentId}
 *
 * Issues a W3C Verifiable Credential proving an agent's Spirit Index status.
 * Agents can present this credential to other services as proof of:
 * - Being indexed in Spirit Index
 * - Their verification status
 * - Their current score
 *
 * @see https://www.w3.org/TR/vc-data-model/
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents';
import { getIdentityByAgentId } from '@/lib/identity';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Credential validity period (30 days)
const CREDENTIAL_VALIDITY_DAYS = 30;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;

  // Check if agent exists
  const agent = await getAgentById(agentId);
  if (!agent) {
    return NextResponse.json({
      success: false,
      error: 'Agent not found in Spirit Index',
      code: 'AGENT_NOT_FOUND'
    }, { status: 404 });
  }

  // Get verification status
  let verified = false;
  let walletVerified = false;
  let domainVerified = false;

  try {
    const identity = await getIdentityByAgentId(agentId);
    if (identity) {
      verified = identity.walletVerified && identity.domainVerified;
      walletVerified = identity.walletVerified;
      domainVerified = identity.domainVerified;
    }
  } catch {
    // No identity record
  }

  // Calculate score
  const scores = agent.scores || {};
  const totalScore = Object.values(scores).reduce((sum: number, dim: any) => {
    return sum + (dim?.value || 0);
  }, 0);

  // Determine trust level
  const trustLevel = !verified ? 'indexed' :
                     totalScore >= 50 ? 'high' :
                     totalScore >= 30 ? 'medium' : 'low';

  // Issue dates
  const now = new Date();
  const expirationDate = new Date(now.getTime() + CREDENTIAL_VALIDITY_DAYS * 24 * 60 * 60 * 1000);

  // Create the Verifiable Credential
  const credential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://spiritindex.org/contexts/v1'
    ],
    type: ['VerifiableCredential', 'SpiritIndexCredential'],
    id: `https://spiritindex.org/api/credential/${agentId}#${now.getTime()}`,
    issuer: {
      id: 'did:web:spiritindex.org',
      name: 'Spirit Index',
      url: 'https://spiritindex.org'
    },
    issuanceDate: now.toISOString(),
    expirationDate: expirationDate.toISOString(),
    credentialSubject: {
      id: `did:web:spiritindex.org:agent:${agentId}`,
      agentId: agentId,
      name: agent.name,
      category: agent.category,

      // Core claims
      indexed: true,
      verified,
      score: totalScore,
      trust_level: trustLevel,

      // Detailed verification status
      verification: {
        wallet: walletVerified,
        domain: domainVerified,
        status: verified ? 'ACTIVE' : 'PENDING'
      },

      // Profile reference
      profile: `https://spiritindex.org/${agentId}`,
      api: `https://spiritindex.org/api/agents/${agentId}`
    },

    // Proof (simplified - in production would use actual cryptographic signature)
    proof: {
      type: 'SpiritIndexAttestation2024',
      created: now.toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:web:spiritindex.org#key-1',
      // Hash of the credential subject for integrity verification
      contentHash: crypto
        .createHash('sha256')
        .update(JSON.stringify({
          agentId,
          indexed: true,
          verified,
          score: totalScore,
          issuanceDate: now.toISOString()
        }))
        .digest('hex')
    }
  };

  return NextResponse.json({
    success: true,
    credential,
    meta: {
      agent_id: agentId,
      valid_until: expirationDate.toISOString(),
      verification_url: `https://spiritindex.org/api/credential/verify`
    }
  }, {
    headers: {
      'Cache-Control': 'private, max-age=300',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
