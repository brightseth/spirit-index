import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/agents";
import { DIMENSIONS, DimensionKey } from "@/lib/types";

export async function GET() {
  const agents = await getAllAgents();
  const dimensions = Object.keys(DIMENSIONS) as DimensionKey[];

  const response = {
    name: "The Spirit Index",
    version: "1.1.0",
    updated: new Date().toISOString().split("T")[0],
    publisher: {
      name: "Spirit Protocol",
      website: "https://spiritprotocol.io",
      github: "https://github.com/spirit-protocol",
    },
    schema_version: "1.0",
    description: "A reference index of autonomous cultural agents",
    purpose:
      "Canonical registry for evaluating Cultural Agents—autonomous entities with persistent identity, narrative coherence, and cultural gravity.",
    dimensions: dimensions.map((d) => ({
      id: d,
      label: DIMENSIONS[d].label,
      short: DIMENSIONS[d].shortLabel,
      description: DIMENSIONS[d].description,
    })),
    agents: agents.map((a) => ({
      id: a.id,
      name: a.name,
      tagline: a.tagline,
      status: a.status,
      category: a.category,
      inception_date: a.inception_date,
      website: a.website,
      scores: Object.fromEntries(
        dimensions.map((d) => [d, a.scores[d].value])
      ),
      total: a.total,
      ...(a.disclosure && { disclosure: a.disclosure }),
      ...(a.archival_status && { archival_status: a.archival_status }),
    })),
    endpoints: {
      api: "/api/agents",
      agent: "/api/agents/{id}",
      index: "/index.json",
      rubric: "/rubric.json",
      submit: "/submit.json",
      llm: "/llm.txt",
      rss: "/feed.xml",
    },
    oracle: {
      description:
        "The Spirit Index serves as a reference oracle for prediction markets and agent evaluation.",
      use_cases: [
        "Prediction market resolution (e.g., 'Will entity X reach score Y by date Z?')",
        "Agent eligibility verification for protocol participation",
        "Staking multiplier calculations based on agent scores",
        "Historical trend analysis for cultural agent evolution",
      ],
      update_frequency: "Quarterly + event-triggered",
      data_license: "CC BY 4.0",
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
