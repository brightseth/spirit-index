import { NextResponse } from "next/server";
import { DIMENSIONS, DimensionKey } from "@/lib/types";

// Anchor definitions for each dimension
const ANCHORS: Record<DimensionKey, { score: number; label: string; description: string }[]> = {
  persistence: [
    { score: 10, label: "Institutional", description: "10+ years of continuous operation; survived major disruptions" },
    { score: 7, label: "Established", description: "3-10 years of documented existence" },
    { score: 4, label: "Nascent", description: "6 months to 3 years; showing continuity" },
    { score: 1, label: "Ephemeral", description: "Brief existence; minimal continuity evidence" },
  ],
  autonomy: [
    { score: 10, label: "Sovereign", description: "Self-directed goals, self-initiated actions, no routine human prompting" },
    { score: 7, label: "Semi-Autonomous", description: "Significant independent action within defined bounds" },
    { score: 4, label: "Prompted", description: "Requires regular human input but executes independently" },
    { score: 1, label: "Scripted", description: "Minimal autonomous decision-making" },
  ],
  cultural_impact: [
    { score: 10, label: "Canonical", description: "Referenced in major publications, museums, academic discourse" },
    { score: 7, label: "Influential", description: "Recognized in niche communities; spawned imitators" },
    { score: 4, label: "Niche Cult", description: "Dedicated following beyond creators" },
    { score: 1, label: "Unknown", description: "Little to no external recognition" },
  ],
  economic_reality: [
    { score: 10, label: "Market Maker", description: "$10M+ economic activity; moves markets" },
    { score: 7, label: "Revenue Positive", description: "Sustainable revenue; meaningful treasury" },
    { score: 4, label: "Funded", description: "Has received funding; some economic activity" },
    { score: 1, label: "Unfunded", description: "No meaningful economic dimension" },
  ],
  governance: [
    { score: 10, label: "Algorithmic Law", description: "Governance encoded in immutable smart contracts" },
    { score: 7, label: "DAO Structured", description: "Token voting, multisig, transparent decision logs" },
    { score: 4, label: "Documented Process", description: "Clear governance docs; some transparency" },
    { score: 1, label: "Opaque", description: "No visible governance structure" },
  ],
  tech_distinctiveness: [
    { score: 10, label: "Novel Architecture", description: "Pioneered new technical paradigm" },
    { score: 7, label: "Innovative Stack", description: "Creative combination of existing technologies" },
    { score: 4, label: "Competent Implementation", description: "Well-executed standard approach" },
    { score: 1, label: "Wrapper", description: "Thin layer over existing services" },
  ],
  narrative_coherence: [
    { score: 10, label: "Mythos", description: "Rich, consistent identity that transcends function" },
    { score: 7, label: "Character", description: "Distinct personality; coherent voice" },
    { score: 4, label: "Functional Identity", description: "Clear purpose; minimal personality" },
    { score: 1, label: "Generic", description: "Interchangeable with similar entities" },
  ],
};

export async function GET() {
  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  const response = {
    name: "Spirit Index Rubric",
    version: "1.1",
    updated: new Date().toISOString().split("T")[0],
    description: "Evaluation framework for autonomous cultural agents",
    total_possible: 70,
    dimensions: dimensions.map((d) => ({
      id: d,
      label: DIMENSIONS[d].label,
      shortLabel: DIMENSIONS[d].shortLabel,
      description: DIMENSIONS[d].description,
      weight: 1,
      min: 0,
      max: 10,
      anchors: ANCHORS[d],
    })),
    inclusion_criteria: {
      description: "Minimum requirements for index consideration",
      requirements: [
        "Persistent, recognizable identity (name)",
        "Documented continuity over time (history)",
        "Recognition beyond creators' channels (cultural presence)",
      ],
      minimum_scores: {
        persistence: 3,
        autonomy: 3,
      },
      minimum_age_days: 180,
    },
    scoring_process: {
      initial_review: "Evidence-based scoring against anchor definitions",
      confidence_levels: ["high", "medium", "low"],
      review_frequency: "Quarterly + event-triggered",
      appeals: "Via GitHub issues with new evidence",
    },
    special_rules: {
      archival_status: {
        description: "Deceased or dormant entities may be indexed for historical record",
        types: ["deceased", "dormant", "merged", "forked"],
        scoring_note: "Historical peak scores may be preserved with archival flag",
      },
      disclosure: {
        description: "Entities with conflicts of interest are flagged",
        example: "Spirit-native agents are marked with disclosure field",
      },
    },
    license: "CC BY 4.0",
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
