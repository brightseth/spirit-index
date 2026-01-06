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
  website: string;
  scores: Scores;
  total: number;
  curator_notes: string;
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
