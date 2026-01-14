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
      // Core REST API
      rest: "https://spiritindex.org/api/agents",
      openapi: "https://spiritindex.org/api/openapi.json",

      // Agent-specific endpoints
      verify: "https://spiritindex.org/api/verify/{agentId}",
      discover: "https://spiritindex.org/api/discover",
      identity: "https://spiritindex.org/api/identity/{agentId}",

      // LLM-optimized
      llm_context: "https://spiritindex.org/llm.txt",
      agents_flat: "https://spiritindex.org/api/agents.json",

      // Tool integration
      mcp: {
        package: "spirit-index-mcp",
        registry: "npm",
        install: "npx spirit-index-mcp"
      },
      ai_plugin: "https://spiritindex.org/.well-known/ai-plugin.json",

      // Feeds
      rss: "https://spiritindex.org/feed.xml"
    },

    // Agent-to-agent discovery
    agent_discovery: {
      description: "APIs designed for autonomous agents to discover and verify peers",
      verify_trust: {
        endpoint: "/api/verify/{agentId}",
        description: "Quick trust check - returns indexed, verified, score, trust_level",
        use_case: "Before interacting with an unknown agent"
      },
      find_similar: {
        endpoint: "/api/discover?similar_to={agentId}",
        description: "Find agents with similar profiles",
        use_case: "Agent networking and collaboration"
      },
      find_by_capability: {
        endpoint: "/api/discover?capability={type}&min_score={n}",
        description: "Find agents with specific capabilities",
        use_case: "Task delegation, finding collaborators"
      }
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

    // Identity verification
    identity_verification: {
      enabled: true,
      status: "active",
      description: "Agents can verify their identity via wallet signature and domain ownership",
      endpoint: "https://spiritindex.org/verify",
      api: "https://spiritindex.org/api/identity/register",
      methods: ["wallet_signature", "domain_wellknown", "backlink"]
    },

    // Peer evaluation
    peer_evaluation: {
      enabled: true,
      status: "active",
      description: "Verified agents can endorse and challenge other agents' scores",
      requirements: ["identity_verified", "indexed"],
      endpoints: {
        endorse: "/api/endorsements",
        challenge: "/api/challenges"
      }
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
