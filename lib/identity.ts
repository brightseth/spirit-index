/**
 * Identity Binding Service
 * Handles registration, verification, and key rotation for agent identities
 */

import { prisma } from './db';
import { getAgentById } from './agents';
import type {
  IdentityBinding,
  IdentityBindingRequest,
  IdentityStatus,
  KeyRotationPolicy,
  EndorsementEligibility,
  SpiritIdentityDocument,
  DimensionKey,
} from './types';
import { verifyMessage, isAddress } from 'viem';

// Default key rotation policy
const DEFAULT_KEY_ROTATION_POLICY: KeyRotationPolicy = {
  allowed: true,
  requiresMultisig: false,
  cooldownDays: 7,
  notifyOnRotation: true,
};

// Minimum days an agent must be indexed to endorse others
const MIN_INDEXED_DAYS_FOR_ENDORSEMENT = 30;

// ============================================
// IDENTITY REGISTRATION
// ============================================

/**
 * Register a new identity binding for an agent
 */
export async function registerIdentity(
  request: IdentityBindingRequest
): Promise<{ success: boolean; identity?: IdentityBinding; error?: string }> {
  // Validate agent exists
  const agent = await getAgentById(request.agentId);
  if (!agent) {
    return { success: false, error: `Agent '${request.agentId}' not found in registry` };
  }

  // Validate wallet address
  if (!isAddress(request.primaryWallet)) {
    return { success: false, error: 'Invalid Ethereum address' };
  }

  // Check if identity already exists
  const existing = await prisma.identityBinding.findUnique({
    where: { agentId: request.agentId },
  });
  if (existing) {
    return { success: false, error: `Identity already registered for agent '${request.agentId}'` };
  }

  // Check if wallet is already used
  const walletInUse = await prisma.identityBinding.findUnique({
    where: { primaryWallet: request.primaryWallet.toLowerCase() },
  });
  if (walletInUse) {
    return { success: false, error: 'Wallet address already registered to another agent' };
  }

  // Merge with default key rotation policy
  const keyRotation = {
    ...DEFAULT_KEY_ROTATION_POLICY,
    ...request.keyRotation,
  };

  // Create the identity binding
  const identity = await prisma.identityBinding.create({
    data: {
      agentId: request.agentId,
      primaryWallet: request.primaryWallet.toLowerCase(),
      verifiedDomain: request.verifiedDomain.toLowerCase(),
      did: request.did,
      ens: request.ens?.toLowerCase(),
      keyRotationAllowed: keyRotation.allowed,
      keyRotationMultisig: keyRotation.requiresMultisig,
      keyRotationCooldownDays: keyRotation.cooldownDays,
      keyRotationNotify: keyRotation.notifyOnRotation,
      status: 'PENDING',
    },
  });

  return {
    success: true,
    identity: mapPrismaToIdentityBinding(identity),
  };
}

/**
 * Get identity binding by agent ID
 */
export async function getIdentityByAgentId(
  agentId: string
): Promise<IdentityBinding | null> {
  const identity = await prisma.identityBinding.findUnique({
    where: { agentId },
  });
  return identity ? mapPrismaToIdentityBinding(identity) : null;
}

/**
 * Get identity binding by wallet address
 */
export async function getIdentityByWallet(
  wallet: string
): Promise<IdentityBinding | null> {
  const identity = await prisma.identityBinding.findUnique({
    where: { primaryWallet: wallet.toLowerCase() },
  });
  return identity ? mapPrismaToIdentityBinding(identity) : null;
}

/**
 * Get all active identities
 */
export async function getActiveIdentities(): Promise<IdentityBinding[]> {
  const identities = await prisma.identityBinding.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { registeredAt: 'desc' },
  });
  return identities.map(mapPrismaToIdentityBinding);
}

// ============================================
// VERIFICATION
// ============================================

/**
 * Generate a verification challenge for wallet signing
 */
export function generateVerificationChallenge(agentId: string): {
  nonce: string;
  message: string;
  expiresAt: Date;
} {
  const nonce = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const message = `Spirit Index Identity Verification

Agent: ${agentId}
Nonce: ${nonce}
Expires: ${expiresAt.toISOString()}

By signing this message, I confirm that I control the wallet being registered for this agent identity.`;

  return { nonce, message, expiresAt };
}

/**
 * Verify a wallet signature for identity verification
 */
export async function verifyWalletSignature(
  identityId: string,
  signature: `0x${string}`,
  message: string,
  expectedAddress: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const recoveredAddress = await verifyMessage({
      address: expectedAddress as `0x${string}`,
      message,
      signature,
    });

    if (!recoveredAddress) {
      // Log failed attempt
      await prisma.verificationAttempt.create({
        data: {
          identityId,
          verificationType: 'wallet_signature',
          success: false,
          errorMessage: 'Signature verification failed',
          signature: signature,
        },
      });
      return { success: false, error: 'Signature verification failed' };
    }

    // Log successful attempt and update identity
    await prisma.verificationAttempt.create({
      data: {
        identityId,
        verificationType: 'wallet_signature',
        success: true,
        signature: signature,
      },
    });

    await prisma.identityBinding.update({
      where: { id: identityId },
      data: {
        walletVerified: true,
        lastVerifiedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Verification error: ${error}` };
  }
}

/**
 * Verify domain control via /.well-known/spirit-identity.json
 */
export async function verifyDomainControl(
  identityId: string,
  domain: string,
  expectedWallet: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://${domain}/.well-known/spirit-identity.json`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      await prisma.verificationAttempt.create({
        data: {
          identityId,
          verificationType: 'domain_wellknown',
          success: false,
          errorMessage: `HTTP ${response.status}: ${response.statusText}`,
        },
      });
      return { success: false, error: `Failed to fetch ${url}: ${response.status}` };
    }

    const doc: SpiritIdentityDocument = await response.json();

    // Validate the document
    if (doc.primaryWallet.toLowerCase() !== expectedWallet.toLowerCase()) {
      await prisma.verificationAttempt.create({
        data: {
          identityId,
          verificationType: 'domain_wellknown',
          success: false,
          errorMessage: 'Wallet mismatch in spirit-identity.json',
          wellKnownContent: JSON.stringify(doc),
        },
      });
      return { success: false, error: 'Wallet in spirit-identity.json does not match' };
    }

    // Log success and update identity
    await prisma.verificationAttempt.create({
      data: {
        identityId,
        verificationType: 'domain_wellknown',
        success: true,
        wellKnownContent: JSON.stringify(doc),
      },
    });

    await prisma.identityBinding.update({
      where: { id: identityId },
      data: {
        domainVerified: true,
        verificationMethod: 'well_known',
        lastVerifiedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Domain verification error: ${error}` };
  }
}

/**
 * Verify backlink from agent's site to Spirit Index dossier
 */
export async function verifyBacklink(
  identityId: string,
  agentId: string,
  website: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const expectedBacklink = `https://spiritindex.org/agents/${agentId}`;
    const response = await fetch(website);

    if (!response.ok) {
      await prisma.verificationAttempt.create({
        data: {
          identityId,
          verificationType: 'backlink',
          success: false,
          errorMessage: `Failed to fetch ${website}: ${response.status}`,
        },
      });
      return { success: false, error: `Failed to fetch ${website}` };
    }

    const html = await response.text();
    const hasBacklink = html.includes(expectedBacklink) || html.includes(`spiritindex.org/agents/${agentId}`);

    if (!hasBacklink) {
      await prisma.verificationAttempt.create({
        data: {
          identityId,
          verificationType: 'backlink',
          success: false,
          errorMessage: 'No backlink to Spirit Index dossier found',
        },
      });
      return { success: false, error: `No backlink to ${expectedBacklink} found on ${website}` };
    }

    await prisma.verificationAttempt.create({
      data: {
        identityId,
        verificationType: 'backlink',
        success: true,
      },
    });

    await prisma.identityBinding.update({
      where: { id: identityId },
      data: {
        backlinkVerified: true,
        lastVerifiedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: `Backlink verification error: ${error}` };
  }
}

/**
 * Check if all verification steps are complete and activate identity
 */
export async function checkAndActivateIdentity(
  identityId: string
): Promise<{ activated: boolean; missingSteps: string[] }> {
  const identity = await prisma.identityBinding.findUnique({
    where: { id: identityId },
  });

  if (!identity) {
    return { activated: false, missingSteps: ['Identity not found'] };
  }

  const missingSteps: string[] = [];
  if (!identity.walletVerified) missingSteps.push('wallet_signature');
  if (!identity.domainVerified) missingSteps.push('domain_control');
  if (!identity.backlinkVerified) missingSteps.push('backlink');

  if (missingSteps.length === 0) {
    await prisma.identityBinding.update({
      where: { id: identityId },
      data: { status: 'ACTIVE' },
    });
    return { activated: true, missingSteps: [] };
  }

  return { activated: false, missingSteps };
}

// ============================================
// KEY ROTATION
// ============================================

/**
 * Request a key rotation for an identity
 */
export async function requestKeyRotation(
  identityId: string,
  newWallet: string,
  signature: string,
  message: string
): Promise<{ success: boolean; rotation?: { id: string; effectiveAt: Date }; error?: string }> {
  const identity = await prisma.identityBinding.findUnique({
    where: { id: identityId },
  });

  if (!identity) {
    return { success: false, error: 'Identity not found' };
  }

  if (!identity.keyRotationAllowed) {
    return { success: false, error: 'Key rotation not allowed for this identity' };
  }

  if (identity.status === 'SUSPENDED') {
    return { success: false, error: 'Identity is suspended during an active rotation' };
  }

  // Check for pending rotations
  const pendingRotation = await prisma.keyRotation.findFirst({
    where: {
      identityId,
      status: 'PENDING',
    },
  });

  if (pendingRotation) {
    return { success: false, error: 'A key rotation is already pending' };
  }

  // Validate new wallet
  if (!isAddress(newWallet)) {
    return { success: false, error: 'Invalid new wallet address' };
  }

  // Calculate effective date (after cooldown)
  const effectiveAt = new Date(
    Date.now() + identity.keyRotationCooldownDays * 24 * 60 * 60 * 1000
  );

  // Create rotation request
  const rotation = await prisma.keyRotation.create({
    data: {
      identityId,
      oldWallet: identity.primaryWallet,
      newWallet: newWallet.toLowerCase(),
      requestSignature: signature,
      requestMessage: message,
      status: 'PENDING',
      effectiveAt,
    },
  });

  // Suspend identity during rotation
  await prisma.identityBinding.update({
    where: { id: identityId },
    data: { status: 'SUSPENDED' },
  });

  return {
    success: true,
    rotation: { id: rotation.id, effectiveAt },
  };
}

/**
 * Complete a pending key rotation (called after cooldown period)
 */
export async function completeKeyRotation(
  rotationId: string
): Promise<{ success: boolean; error?: string }> {
  const rotation = await prisma.keyRotation.findUnique({
    where: { id: rotationId },
  });

  if (!rotation) {
    return { success: false, error: 'Rotation not found' };
  }

  if (rotation.status !== 'PENDING') {
    return { success: false, error: `Rotation is ${rotation.status}, not PENDING` };
  }

  if (new Date() < rotation.effectiveAt) {
    return { success: false, error: `Cooldown not complete. Effective at: ${rotation.effectiveAt.toISOString()}` };
  }

  // Apply the rotation
  await prisma.$transaction([
    prisma.identityBinding.update({
      where: { id: rotation.identityId },
      data: {
        primaryWallet: rotation.newWallet,
        walletVerified: false, // Requires re-verification with new wallet
        status: 'ACTIVE',
      },
    }),
    prisma.keyRotation.update({
      where: { id: rotationId },
      data: {
        status: 'ACTIVE',
        completedAt: new Date(),
        networkNotified: true,
        notifiedAt: new Date(),
      },
    }),
  ]);

  return { success: true };
}

/**
 * Cancel a pending key rotation
 */
export async function cancelKeyRotation(
  rotationId: string,
  signature: string
): Promise<{ success: boolean; error?: string }> {
  const rotation = await prisma.keyRotation.findUnique({
    where: { id: rotationId },
  });

  if (!rotation) {
    return { success: false, error: 'Rotation not found' };
  }

  if (rotation.status !== 'PENDING') {
    return { success: false, error: `Cannot cancel rotation with status: ${rotation.status}` };
  }

  // TODO: Verify signature is from the old wallet

  await prisma.$transaction([
    prisma.keyRotation.update({
      where: { id: rotationId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
      },
    }),
    prisma.identityBinding.update({
      where: { id: rotation.identityId },
      data: { status: 'ACTIVE' },
    }),
  ]);

  return { success: true };
}

// ============================================
// ENDORSEMENT ELIGIBILITY
// ============================================

/**
 * Check if an agent is eligible to endorse other agents
 */
export async function checkEndorsementEligibility(
  agentId: string
): Promise<EndorsementEligibility> {
  const reasons: string[] = [];
  const requirements = {
    hasActiveIdentity: false,
    minimumIndexedDays: MIN_INDEXED_DAYS_FOR_ENDORSEMENT,
    actualIndexedDays: 0,
    hasHighConfidenceScores: false,
    meetsReputationThreshold: true, // TODO: Implement reputation tracking
  };

  // Check identity binding
  const identity = await getIdentityByAgentId(agentId);
  requirements.hasActiveIdentity = identity?.status === 'ACTIVE';
  if (!requirements.hasActiveIdentity) {
    reasons.push('No active identity binding registered');
  }

  // Check indexed duration
  const agent = await getAgentById(agentId);
  if (agent) {
    const firstIndexDate = agent.score_history[0]?.date;
    if (firstIndexDate) {
      const indexedMs = Date.now() - new Date(firstIndexDate).getTime();
      requirements.actualIndexedDays = Math.floor(indexedMs / (24 * 60 * 60 * 1000));
    }
  }
  if (requirements.actualIndexedDays < requirements.minimumIndexedDays) {
    reasons.push(`Only indexed for ${requirements.actualIndexedDays} days (minimum: ${requirements.minimumIndexedDays})`);
  }

  // Check for high confidence scores
  if (agent) {
    const scores = agent.scores;
    const highConfidenceCount = Object.values(scores).filter(
      (s) => s.confidence === 'high'
    ).length;
    requirements.hasHighConfidenceScores = highConfidenceCount >= 3;
    if (!requirements.hasHighConfidenceScores) {
      reasons.push(`Only ${highConfidenceCount} high-confidence scores (minimum: 3)`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
    requirements,
  };
}

// ============================================
// HELPERS
// ============================================

/**
 * Map Prisma model to IdentityBinding type
 */
function mapPrismaToIdentityBinding(prismaIdentity: {
  id: string;
  agentId: string;
  primaryWallet: string;
  verifiedDomain: string;
  did: string | null;
  ens: string | null;
  domainVerified: boolean;
  walletVerified: boolean;
  backlinkVerified: boolean;
  lastVerifiedAt: Date | null;
  verificationMethod: string | null;
  keyRotationAllowed: boolean;
  keyRotationMultisig: boolean;
  keyRotationCooldownDays: number;
  keyRotationNotify: boolean;
  status: string;
  registeredAt: Date;
  updatedAt: Date;
}): IdentityBinding {
  return {
    id: prismaIdentity.id,
    agentId: prismaIdentity.agentId,
    primaryWallet: prismaIdentity.primaryWallet,
    verifiedDomain: prismaIdentity.verifiedDomain,
    did: prismaIdentity.did ?? undefined,
    ens: prismaIdentity.ens ?? undefined,
    domainVerified: prismaIdentity.domainVerified,
    walletVerified: prismaIdentity.walletVerified,
    backlinkVerified: prismaIdentity.backlinkVerified,
    lastVerifiedAt: prismaIdentity.lastVerifiedAt?.toISOString(),
    verificationMethod: prismaIdentity.verificationMethod as IdentityBinding['verificationMethod'],
    keyRotation: {
      allowed: prismaIdentity.keyRotationAllowed,
      requiresMultisig: prismaIdentity.keyRotationMultisig,
      cooldownDays: prismaIdentity.keyRotationCooldownDays,
      notifyOnRotation: prismaIdentity.keyRotationNotify,
    },
    status: prismaIdentity.status as IdentityStatus,
    registeredAt: prismaIdentity.registeredAt.toISOString(),
    updatedAt: prismaIdentity.updatedAt.toISOString(),
  };
}
