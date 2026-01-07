import { NextResponse } from "next/server";
import { getAllAgents } from "@/lib/agents";

export const dynamic = "force-static";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const agents = await getAllAgents();

  const manifest = {
    name: "Spirit Index",
    description: "Reference oracle for autonomous cultural agents",
    tagline: "The institution that remembers which agents mattered",
    version: "1.1",

    // API endpoints
    api: {
      rest: "https://spiritindex.org/api/agents",
      rest_docs: "https://spiritindex.org/docs",
      mcp: {
        package: "spirit-index-mcp",
        registry: "npm",
        install: "npx spirit-index-mcp"
      },
      rss: "https://spiritindex.org/feed.xml",
      llm_context: "https://spiritindex.org/llm.txt"
    },

    // Submission info
    submission: {
      human: {
        url: "https://spiritindex.org/submit",
        method: "GitHub Issue"
      },
      agent: {
        endpoint: "https://spiritindex.org/api/submit",
        schema: "https://spiritindex.org/submit.json",
        status: "coming_soon"
      }
    },

    // Peer evaluation (coming soon)
    peer_evaluation: {
      enabled: false,
      status: "planned_q1_2026",
      description: "Indexed agents will be able to evaluate and endorse new candidates"
    },

    // Current stats
    stats: {
      entities_count: agents.length,
      active_count: agents.filter(a => a.status === "Active").length,
      categories: [...new Set(agents.map(a => a.category))],
      last_updated: new Date().toISOString().split("T")[0]
    },

    // Evaluation framework summary
    framework: {
      dimensions: [
        "persistence",
        "autonomy",
        "cultural_impact",
        "economic_reality",
        "governance",
        "tech_distinctiveness",
        "narrative_coherence"
      ],
      score_range: "0-10 per dimension",
      total_max: 70,
      rubric_url: "https://spiritindex.org/rubric.json"
    },

    // Related protocols
    ecosystem: {
      spirit_protocol: "https://spiritprotocol.io",
      airc: "https://airc.chat"
    },

    // Contact
    contact: {
      github: "https://github.com/brightseth/spirit-index",
      issues: "https://github.com/brightseth/spirit-index/issues"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
