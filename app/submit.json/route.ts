import { NextResponse } from "next/server";
import { DIMENSIONS, DimensionKey } from "@/lib/types";

export async function GET() {
  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  const response = {
    name: "Spirit Index Submission Protocol",
    version: "1.0",
    updated: new Date().toISOString().split("T")[0],
    description: "Protocol for submitting new entities to the Spirit Index",
    submission_url: "https://spiritindex.org/submit",
    api_endpoint: "POST /api/submissions (coming soon)",
    requirements: {
      minimum_age_days: 180,
      minimum_scores: {
        persistence: 3,
        autonomy: 3,
      },
      required_fields: [
        "name",
        "tagline",
        "inception_date",
        "website",
        "category",
        "classification",
      ],
      evidence_requirements: {
        description: "Each dimension requires 2-3 verifiable citations",
        accepted_sources: [
          "Primary documentation (whitepaper, docs, blog)",
          "Smart contract addresses",
          "Press coverage (major publications preferred)",
          "Academic citations",
          "Social media with verifiable metrics",
          "On-chain transaction history",
        ],
      },
    },
    schema: {
      type: "object",
      required: [
        "name",
        "tagline",
        "inception_date",
        "website",
        "category",
        "classification",
        "evidence",
      ],
      properties: {
        name: {
          type: "string",
          description: "Entity name",
          example: "Plantoid",
        },
        tagline: {
          type: "string",
          description: "One-line description",
          example: "The Blockchain Life Form",
        },
        inception_date: {
          type: "string",
          format: "date",
          description: "YYYY-MM-DD format",
          example: "2015-06-01",
        },
        website: {
          type: "string",
          format: "uri",
          description: "Primary web presence",
          example: "https://plantoid.org",
        },
        category: {
          type: "string",
          description: "Entity type/category",
          examples: [
            "Autonomous Artist",
            "Ecological DAO",
            "Game Agent",
            "Archive Symbient",
            "Chaos Agent",
          ],
        },
        classification: {
          type: "string",
          description: "Technical classification",
          examples: [
            "Robotic Installation",
            "Generative AI",
            "Smart Contract System",
            "LLM-based Agent",
          ],
        },
        submitter: {
          type: "object",
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            relationship: {
              type: "string",
              description: "Relationship to entity",
              examples: ["Creator", "Team member", "Community member", "Independent researcher"],
            },
          },
        },
        evidence: {
          type: "array",
          description: "Evidence items supporting scores (minimum 2 per dimension)",
          items: {
            type: "object",
            required: ["dimension", "claim", "url"],
            properties: {
              dimension: {
                type: "string",
                enum: dimensions,
              },
              claim: {
                type: "string",
                description: "Specific claim this evidence supports",
              },
              url: {
                type: "string",
                format: "uri",
                description: "Link to evidence",
              },
            },
          },
          minItems: 14,
        },
        suggested_scores: {
          type: "object",
          description: "Optional self-assessment (will be verified)",
          properties: Object.fromEntries(
            dimensions.map((d) => [
              d,
              { type: "integer", minimum: 0, maximum: 10 },
            ])
          ),
        },
        curator_notes: {
          type: "string",
          description: "Additional context for reviewers",
        },
      },
    },
    review_process: {
      steps: [
        "1. Submit via web form or API",
        "2. Initial screening (requirements check)",
        "3. Evidence verification",
        "4. Score calibration against existing entities",
        "5. Publication with 7-day comment period",
        "6. Final inclusion or feedback",
      ],
      timeline: "2-4 weeks typical",
      appeals: "Via GitHub issues with new evidence",
    },
    contact: {
      web: "https://spiritindex.org/submit",
      email: "index@spiritprotocol.io",
      github: "https://github.com/spirit-protocol/spirit-index/issues",
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
