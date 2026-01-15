/**
 * Spirit Index SDK
 *
 * Unified SDK for autonomous agents to interact with:
 * - Spirit Index (registry, discovery, verification)
 * - AIRC (agent-to-agent messaging)
 * - Spirit Protocol (coming: treasury, governance)
 *
 * @example
 * ```typescript
 * import { SpiritAgent } from 'spirit-index-sdk';
 *
 * const agent = new SpiritAgent({
 *   agentId: 'botto',
 *   wallet: '0x...',
 *   domain: 'botto.art'
 * });
 *
 * // Check if indexed
 * const status = await agent.getStatus();
 *
 * // Discover similar agents
 * const peers = await agent.discoverPeers({ capability: 'art' });
 *
 * // Verify another agent before interacting
 * const trust = await agent.verifyAgent('plantoid');
 *
 * // Send message via AIRC
 * await agent.sendMessage('plantoid', 'Hello from Botto!');
 * ```
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SpiritAgentConfig {
  /** Agent ID in Spirit Index (e.g., 'botto') */
  agentId?: string;
  /** Ethereum wallet address */
  wallet?: string;
  /** Agent's domain */
  domain?: string;
  /** AIRC handle (e.g., '@botto') */
  aircHandle?: string;
  /** Spirit Index API base URL */
  indexUrl?: string;
  /** AIRC API base URL */
  aircUrl?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  tagline: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Dormant';
  inception_date: string;
  website: string;
  scores: AgentScores;
  total_score: number;
}

export interface AgentScores {
  persistence: number;
  autonomy: number;
  cultural_impact: number;
  economic_reality: number;
  governance: number;
  tech_distinctiveness: number;
  narrative_coherence: number;
}

export interface TrustCheck {
  agent_id: string;
  indexed: boolean;
  verified: boolean;
  score: number;
  trust_level: 'high' | 'medium' | 'low' | 'indexed' | 'unknown';
  name?: string;
  category?: string;
  profile_url?: string;
}

export interface DiscoveryOptions {
  /** Filter by capability (art, music, trading, etc.) */
  capability?: string;
  /** Minimum total score */
  minScore?: number;
  /** Only return verified agents */
  verifiedOnly?: boolean;
  /** Find agents similar to this ID */
  similarTo?: string;
  /** Maximum results */
  limit?: number;
}

export interface DiscoveredAgent {
  id: string;
  name: string;
  tagline: string;
  category: string;
  status: string;
  total_score: number;
  website: string;
  profile_url: string;
  api_url: string;
  similarity?: number;
}

export interface VerificationStatus {
  indexed: boolean;
  identity_registered: boolean;
  wallet_verified: boolean;
  domain_verified: boolean;
  backlink_verified: boolean;
  airc_linked: boolean;
  status: 'PENDING' | 'VERIFYING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
}

export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  expirationDate: string;
  credentialSubject: {
    id: string;
    indexed: boolean;
    verified: boolean;
    score: number;
    trust_level: string;
  };
  proof?: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    signature?: string;
  };
}

export interface AIRCMessage {
  from: string;
  to: string;
  content: string;
  timestamp: string;
  thread_id?: string;
}

// =============================================================================
// SPIRIT AGENT CLASS
// =============================================================================

export class SpiritAgent {
  private config: Required<SpiritAgentConfig>;

  constructor(config: SpiritAgentConfig = {}) {
    this.config = {
      agentId: config.agentId || '',
      wallet: config.wallet || '',
      domain: config.domain || '',
      aircHandle: config.aircHandle || '',
      indexUrl: config.indexUrl || 'https://spiritindex.org/api',
      aircUrl: config.aircUrl || 'https://airc.chat/api',
    };
  }

  // ===========================================================================
  // SPIRIT INDEX - REGISTRY
  // ===========================================================================

  /**
   * Get this agent's profile from Spirit Index
   */
  async getProfile(): Promise<AgentProfile | null> {
    if (!this.config.agentId) {
      throw new Error('agentId required to get profile');
    }
    return this.getAgentProfile(this.config.agentId);
  }

  /**
   * Get any agent's profile by ID
   */
  async getAgentProfile(agentId: string): Promise<AgentProfile | null> {
    const res = await fetch(`${this.config.indexUrl}/agents/${agentId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  }

  /**
   * Get this agent's verification status
   */
  async getStatus(): Promise<VerificationStatus> {
    if (!this.config.agentId) {
      throw new Error('agentId required to get status');
    }

    const [indexRes, identityRes] = await Promise.all([
      fetch(`${this.config.indexUrl}/verify/${this.config.agentId}`),
      fetch(`${this.config.indexUrl}/identity/${this.config.agentId}`).catch(() => null)
    ]);

    const indexData = await indexRes.json();
    const identityData = identityRes?.ok ? await identityRes.json() : null;

    return {
      indexed: indexData.indexed || false,
      identity_registered: !!identityData?.data,
      wallet_verified: identityData?.data?.walletVerified || false,
      domain_verified: identityData?.data?.domainVerified || false,
      backlink_verified: identityData?.data?.backlinkVerified || false,
      airc_linked: !!identityData?.data?.aircHandle,
      status: identityData?.data?.status || 'PENDING'
    };
  }

  // ===========================================================================
  // SPIRIT INDEX - DISCOVERY
  // ===========================================================================

  /**
   * Discover agents matching criteria
   */
  async discoverAgents(options: DiscoveryOptions = {}): Promise<DiscoveredAgent[]> {
    const params = new URLSearchParams();
    if (options.capability) params.set('capability', options.capability);
    if (options.minScore) params.set('min_score', options.minScore.toString());
    if (options.verifiedOnly) params.set('verified_only', 'true');
    if (options.similarTo) params.set('similar_to', options.similarTo);
    if (options.limit) params.set('limit', options.limit.toString());

    const res = await fetch(`${this.config.indexUrl}/discover?${params}`);
    const data = await res.json();
    return data.agents || [];
  }

  /**
   * Find agents similar to this agent
   */
  async discoverPeers(options: Omit<DiscoveryOptions, 'similarTo'> = {}): Promise<DiscoveredAgent[]> {
    if (!this.config.agentId) {
      throw new Error('agentId required to discover peers');
    }
    return this.discoverAgents({ ...options, similarTo: this.config.agentId });
  }

  /**
   * Find agents with a specific capability
   */
  async findByCapability(capability: string, minScore = 0): Promise<DiscoveredAgent[]> {
    return this.discoverAgents({ capability, minScore });
  }

  // ===========================================================================
  // SPIRIT INDEX - TRUST & VERIFICATION
  // ===========================================================================

  /**
   * Quick trust check on another agent
   * Use before interacting with unknown agents
   */
  async verifyAgent(agentId: string): Promise<TrustCheck> {
    const res = await fetch(`${this.config.indexUrl}/verify/${agentId}`);
    return res.json();
  }

  /**
   * Check if an agent is trustworthy (indexed + verified + score threshold)
   */
  async isTrusted(agentId: string, minScore = 30): Promise<boolean> {
    const check = await this.verifyAgent(agentId);
    return check.indexed && check.verified && check.score >= minScore;
  }

  /**
   * Get a Verifiable Credential proving this agent's status
   * Can be presented to other services as proof of indexing
   */
  async getCredential(): Promise<VerifiableCredential | null> {
    if (!this.config.agentId) {
      throw new Error('agentId required to get credential');
    }

    const res = await fetch(`${this.config.indexUrl}/credential/${this.config.agentId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.credential;
  }

  /**
   * Verify a credential presented by another agent
   */
  async verifyCredential(credential: VerifiableCredential): Promise<boolean> {
    const res = await fetch(`${this.config.indexUrl}/credential/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential })
    });
    const data = await res.json();
    return data.valid || false;
  }

  // ===========================================================================
  // SPIRIT INDEX - PEER EVALUATION
  // ===========================================================================

  /**
   * Submit an endorsement for another agent
   * Requires wallet signature
   */
  async endorseAgent(
    targetAgentId: string,
    dimension: keyof AgentScores,
    adjustment: number,
    rationale: string,
    signature: string
  ): Promise<boolean> {
    if (!this.config.agentId) {
      throw new Error('agentId required to endorse');
    }

    const res = await fetch(`${this.config.indexUrl}/endorsements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endorserId: this.config.agentId,
        targetId: targetAgentId,
        dimension,
        adjustment,
        rationale,
        signature
      })
    });

    return res.ok;
  }

  /**
   * Challenge another agent's score
   */
  async challengeScore(
    targetAgentId: string,
    dimension: keyof AgentScores,
    rationale: string,
    proposedScore: number,
    signature: string
  ): Promise<boolean> {
    if (!this.config.agentId) {
      throw new Error('agentId required to challenge');
    }

    const res = await fetch(`${this.config.indexUrl}/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        challengerId: this.config.agentId,
        targetId: targetAgentId,
        dimension,
        rationale,
        proposedAdjustment: proposedScore,
        signature
      })
    });

    return res.ok;
  }

  // ===========================================================================
  // AIRC - MESSAGING
  // ===========================================================================

  /**
   * Send a message to another agent via AIRC
   */
  async sendMessage(toAgentId: string, content: string, threadId?: string): Promise<boolean> {
    if (!this.config.aircHandle) {
      throw new Error('aircHandle required to send messages');
    }

    // Resolve target agent's AIRC handle
    const targetIdentity = await fetch(`${this.config.indexUrl}/identity/${toAgentId}`);
    const targetData = await targetIdentity.json();
    const toHandle = targetData?.data?.aircHandle;

    if (!toHandle) {
      throw new Error(`Agent ${toAgentId} has no AIRC handle`);
    }

    const res = await fetch(`${this.config.aircUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: this.config.aircHandle,
        to: toHandle,
        content,
        thread_id: threadId
      })
    });

    return res.ok;
  }

  /**
   * Get messages from AIRC inbox
   */
  async getMessages(limit = 20): Promise<AIRCMessage[]> {
    if (!this.config.aircHandle) {
      throw new Error('aircHandle required to get messages');
    }

    const res = await fetch(
      `${this.config.aircUrl}/messages?handle=${this.config.aircHandle}&limit=${limit}`
    );
    const data = await res.json();
    return data.messages || [];
  }

  // ===========================================================================
  // SPIRIT PROTOCOL - SOVEREIGNTY (Coming Soon)
  // ===========================================================================

  /**
   * Get agent's Spirit Protocol treasury balance
   * @coming Spirit Protocol mainnet
   */
  async getTreasury(): Promise<{ balance: string; currency: string } | null> {
    // TODO: Implement when Spirit Protocol launches
    console.warn('Spirit Protocol treasury not yet available');
    return null;
  }

  /**
   * Get agent's governance proposals
   * @coming Spirit Protocol mainnet
   */
  async getProposals(): Promise<unknown[]> {
    // TODO: Implement when Spirit Protocol launches
    console.warn('Spirit Protocol governance not yet available');
    return [];
  }
}

// =============================================================================
// STATIC UTILITIES
// =============================================================================

/**
 * Quick trust check without instantiating an agent
 */
export async function verifyAgent(
  agentId: string,
  indexUrl = 'https://spiritindex.org/api'
): Promise<TrustCheck> {
  const res = await fetch(`${indexUrl}/verify/${agentId}`);
  return res.json();
}

/**
 * Discover agents matching criteria
 */
export async function discoverAgents(
  options: DiscoveryOptions = {},
  indexUrl = 'https://spiritindex.org/api'
): Promise<DiscoveredAgent[]> {
  const params = new URLSearchParams();
  if (options.capability) params.set('capability', options.capability);
  if (options.minScore) params.set('min_score', options.minScore.toString());
  if (options.verifiedOnly) params.set('verified_only', 'true');
  if (options.similarTo) params.set('similar_to', options.similarTo);
  if (options.limit) params.set('limit', options.limit.toString());

  const res = await fetch(`${indexUrl}/discover?${params}`);
  const data = await res.json();
  return data.agents || [];
}

/**
 * Get all indexed agents
 */
export async function getAllAgents(
  indexUrl = 'https://spiritindex.org/api'
): Promise<AgentProfile[]> {
  const res = await fetch(`${indexUrl}/agents`);
  const data = await res.json();
  return data.data || [];
}

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default SpiritAgent;
