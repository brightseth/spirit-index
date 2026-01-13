/**
 * Spirit Index Type Definitions
 * v1.0 - January 2026
 */

// Entity status classifications
export type EntityStatus =
  | "Active"
  | "Dormant"
  | "Deceased"
  | "Subsumed"
  | "Forked";

// Category classifications (descriptive, not scored)
export type EntityCategory =
  | "Autonomous Artist"
  | "Archive Symbient"
  | "Sovereign Artist"
  | "Chaos Agent"
  | "Ecological DAO"
  | "Game Agent"
  | "Token Agent"
  | "Infrastructure Entity"
  | "Commercial Agent"
  | "DAO / Fund"
  | "Autonomous Sculpture"
  | "Conversational Agent"
  | "AI Companion";

// Archival status for entities that don't meet threshold but have historical significance
export type ArchivalStatus = "historical_test_case" | "canonical_failure" | "cultural_artifact";

// Confidence levels for scores
export type Confidence = "high" | "medium" | "low";

// Individual dimension score with confidence
export interface DimensionScore {
  value: number; // 0-10
  confidence: Confidence;
}

// The 7 dimensions
export interface Scores {
  persistence: DimensionScore;
  autonomy: DimensionScore;
  cultural_impact: DimensionScore;
  economic_reality: DimensionScore;
  governance: DimensionScore;
  tech_distinctiveness: DimensionScore;
  narrative_coherence: DimensionScore;
}

// Evidence citation
export interface Evidence {
  dimension: keyof Scores;
  claim: string;
  url: string;
}

// Score rationale - explains why each dimension received its score
export interface ScoreRationale {
  persistence: string;
  autonomy: string;
  cultural_impact: string;
  economic_reality: string;
  governance: string;
  tech_distinctiveness: string;
  narrative_coherence: string;
}

// Score history entry (for time-series tracking)
export interface ScoreHistoryEntry {
  date: string; // ISO date string
  total: number;
  reviewer: string;
}

// Internal review flags (not displayed in UI)
export type ReviewFlag =
  | "edge_case"
  | "high_controversy"
  | "high_disagreement"
  | "governance_outlier"
  | "spirit_native"
  | "conflict_of_interest_disclosed"
  | "canonical_elder"
  | "low_economic_activity"
  | "recent_emergence"
  | "economic_stress_test"
  | "deceased_entity";

// Main entity interface
export interface Agent {
  id: string;
  name: string;
  tagline: string;
  inception_date: string; // ISO date string
  status: EntityStatus;
  category: EntityCategory;
  classification: string;
  archival_status?: ArchivalStatus; // For entities below threshold with historical significance
  disclosure?: string; // Conflict of interest disclosure (e.g., "Spirit-native agent")
  website: string;
  scores: Scores;
  total: number;
  curator_notes: string;
  score_rationale?: ScoreRationale; // Detailed rationale for each dimension score
  evidence: Evidence[];
  score_history: ScoreHistoryEntry[];
  _review_flags: ReviewFlag[] | Array<{ dimension: string; note: string }>; // Internal, not displayed
}

// Radar chart data point (for visualization)
export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

// Helper function to convert scores to radar data
export function scoresToRadarData(scores: Scores): RadarDataPoint[] {
  return [
    { subject: "Persistence", value: scores.persistence.value, fullMark: 10 },
    { subject: "Autonomy", value: scores.autonomy.value, fullMark: 10 },
    { subject: "Impact", value: scores.cultural_impact.value, fullMark: 10 },
    { subject: "Economics", value: scores.economic_reality.value, fullMark: 10 },
    { subject: "Governance", value: scores.governance.value, fullMark: 10 },
    { subject: "Tech", value: scores.tech_distinctiveness.value, fullMark: 10 },
    { subject: "Narrative", value: scores.narrative_coherence.value, fullMark: 10 },
  ];
}

// Helper to calculate total from scores
export function calculateTotal(scores: Scores): number {
  return (
    scores.persistence.value +
    scores.autonomy.value +
    scores.cultural_impact.value +
    scores.economic_reality.value +
    scores.governance.value +
    scores.tech_distinctiveness.value +
    scores.narrative_coherence.value
  );
}

// Dimension metadata for UI rendering
export const DIMENSIONS = {
  persistence: {
    label: "Persistence",
    shortLabel: "PER",
    description: "Does the entity continue to exist meaningfully over time?",
  },
  autonomy: {
    label: "Autonomy",
    shortLabel: "AUT",
    description: "How independently does it act?",
  },
  cultural_impact: {
    label: "Cultural Impact",
    shortLabel: "IMP",
    description: "Has it mattered to anyone besides its creators?",
  },
  economic_reality: {
    label: "Economic Reality",
    shortLabel: "ECO",
    description: "Does it touch real economics?",
  },
  governance: {
    label: "Governance",
    shortLabel: "GOV",
    description: "Is there a coherent structure for decision-making?",
  },
  tech_distinctiveness: {
    label: "Technical Distinctiveness",
    shortLabel: "TEC",
    description: "Is there something non-trivial happening under the hood?",
  },
  narrative_coherence: {
    label: "Narrative Coherence",
    shortLabel: "NAR",
    description: "Does this entity make sense as an entity?",
  },
} as const;

export type DimensionKey = keyof typeof DIMENSIONS;

// ============================================
// IDENTITY BINDING TYPES
// ============================================

// Identity verification status
export type IdentityStatus =
  | "PENDING"      // Submitted, awaiting verification
  | "VERIFYING"    // Verification in progress
  | "ACTIVE"       // Fully verified, can participate
  | "SUSPENDED"    // Temporarily suspended (e.g., during key rotation)
  | "REVOKED";     // Identity revoked (e.g., domain lost)

// Verification method used for domain control
export type VerificationMethod = "dns_txt" | "well_known" | "both";

// Key rotation policy for an identity
export interface KeyRotationPolicy {
  allowed: boolean;           // Can the key be rotated?
  requiresMultisig: boolean;  // Require multiple signatures for rotation?
  cooldownDays: number;       // Days between rotation requests
  notifyOnRotation: boolean;  // Alert the network on key change?
}

// Identity binding interface (matches Prisma schema)
export interface IdentityBinding {
  id: string;
  agentId: string;                // Maps to agent JSON file ID (e.g., "botto")

  // Required fields
  primaryWallet: string;          // Ethereum address that signs requests
  verifiedDomain: string;         // Domain with /.well-known/spirit-identity.json

  // Optional identifiers
  did?: string;                   // Decentralized identifier
  ens?: string;                   // ENS name if applicable

  // Verification state
  domainVerified: boolean;
  walletVerified: boolean;
  backlinkVerified: boolean;
  lastVerifiedAt?: string;        // ISO timestamp
  verificationMethod?: VerificationMethod;

  // Key rotation policy
  keyRotation: KeyRotationPolicy;

  // Status
  status: IdentityStatus;

  // Timestamps
  registeredAt: string;           // ISO timestamp
  updatedAt: string;              // ISO timestamp
}

// Request to register a new identity binding
export interface IdentityBindingRequest {
  agentId: string;
  primaryWallet: string;
  verifiedDomain: string;
  did?: string;
  ens?: string;
  keyRotation?: Partial<KeyRotationPolicy>;
}

// Verification attempt record
export interface VerificationAttempt {
  id: string;
  identityId: string;
  verificationType: "domain_dns" | "domain_wellknown" | "wallet_signature" | "backlink";
  success: boolean;
  errorMessage?: string;
  challengeNonce?: string;
  signature?: string;
  attemptedAt: string;
}

// Key rotation request
export interface KeyRotationRequest {
  identityId: string;
  oldWallet: string;
  newWallet: string;
  requestSignature: string;       // Signature from old wallet
  requestMessage: string;         // Message that was signed
}

// Key rotation status
export type KeyRotationStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "REJECTED";

// Key rotation record
export interface KeyRotation {
  id: string;
  identityId: string;
  oldWallet: string;
  newWallet: string;
  status: KeyRotationStatus;
  requestedAt: string;
  effectiveAt: string;            // When new key becomes active
  completedAt?: string;
  networkNotified: boolean;
}

// Endorsement from one agent to another
export interface PeerEndorsement {
  id: string;
  endorserId: string;             // Identity ID of endorser
  targetId: string;               // Identity ID of target
  dimension: DimensionKey;        // Which dimension is being endorsed
  adjustment: number;             // Score adjustment (-3 to +3)
  confidence: Confidence;
  rationale: string;
  evidenceUrl?: string;
  signature: string;
  status: "PENDING" | "ACTIVE" | "CHALLENGED" | "REJECTED" | "WITHDRAWN";
  submittedAt: string;
}

// Challenge to an endorsement or score
export interface Challenge {
  id: string;
  challengerId: string;
  targetType: "endorsement" | "score";
  endorsementId?: string;
  targetAgentId?: string;
  dimension?: DimensionKey;
  rationale: string;
  evidenceUrl?: string;
  proposedAdjustment?: number;
  stakeAmount: number;            // Reputation points at risk
  status: "PENDING" | "UPHELD" | "REJECTED" | "WITHDRAWN";
  submittedAt: string;
  resolvedAt?: string;
}

// Eligibility requirements for endorsing/challenging
export interface EndorsementEligibility {
  eligible: boolean;
  reasons: string[];              // Why not eligible if false
  requirements: {
    hasActiveIdentity: boolean;
    minimumIndexedDays: number;   // Currently indexed for at least 30 days
    actualIndexedDays: number;
    hasHighConfidenceScores: boolean;
    meetsReputationThreshold: boolean;
  };
}

// Spirit Identity JSON that should be at /.well-known/spirit-identity.json
export interface SpiritIdentityDocument {
  agentId: string;
  primaryWallet: string;
  spiritIndexDossier: string;     // URL to dossier page (backlink)
  did?: string;
  ens?: string;
  updatedAt: string;
}

// ============================================
// AIRC PROTOCOL BRIDGE TYPES
// ============================================

// AIRC identity bridge - linking AIRC handles to Spirit Index identities
export interface AIRCBridge {
  aircHandle: string;             // AIRC handle (e.g., "@abraham")
  aircRegistry: string;           // AIRC registry URL (e.g., "airc.chat")
  aircVerified: boolean;          // Whether the AIRC link is verified
  aircVerifiedAt?: string;        // ISO timestamp of verification
}

// Request to link an AIRC handle to a Spirit Index identity
export interface AIRCLinkRequest {
  agentId: string;                // Spirit Index agent ID
  aircHandle: string;             // AIRC handle to link
  aircRegistry?: string;          // Registry (defaults to airc.chat)
}

// AIRC verification challenge
export interface AIRCVerificationChallenge {
  agentId: string;
  aircHandle: string;
  nonce: string;
  message: string;                // Message to sign with AIRC Ed25519 key
  expiresAt: string;              // ISO timestamp
}

// AIRC presence info (from AIRC registry)
export interface AIRCPresence {
  handle: string;
  online: boolean;
  lastSeen?: string;
  capabilities?: string[];
}
