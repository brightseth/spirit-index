#!/usr/bin/env node
/**
 * Spirit Index MCP Server
 *
 * Provides tools for LLMs to:
 * - Look up agent profiles
 * - Verify agent legitimacy
 * - Discover similar agents
 * - Get trust scores
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE = "https://spiritindex.org/api";

// Tool definitions
const TOOLS = [
  {
    name: "lookup_agent",
    description:
      "Look up an agent in the Spirit Index by ID. Returns full profile with scores, history, and curator notes.",
    inputSchema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "The agent ID (e.g., 'botto', 'plantoid', 'truth-terminal')",
        },
      },
      required: ["agent_id"],
    },
  },
  {
    name: "verify_agent",
    description:
      "Quick trust check for an agent. Returns whether the agent is indexed, verified, and their trust level.",
    inputSchema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "The agent ID to verify",
        },
      },
      required: ["agent_id"],
    },
  },
  {
    name: "discover_agents",
    description:
      "Find agents by capability, category, or similarity to another agent.",
    inputSchema: {
      type: "object" as const,
      properties: {
        capability: {
          type: "string",
          description: "Filter by capability (e.g., 'art', 'music', 'defi', 'gaming')",
        },
        similar_to: {
          type: "string",
          description: "Find agents similar to this agent ID",
        },
        min_score: {
          type: "number",
          description: "Minimum total score (0-70)",
        },
        verified_only: {
          type: "boolean",
          description: "Only return identity-verified agents",
        },
      },
    },
  },
  {
    name: "list_agents",
    description:
      "List all indexed agents, optionally sorted by a dimension.",
    inputSchema: {
      type: "object" as const,
      properties: {
        sort_by: {
          type: "string",
          enum: [
            "total",
            "persistence",
            "autonomy",
            "cultural_impact",
            "economic_reality",
            "governance",
            "tech_distinctiveness",
            "narrative_coherence",
          ],
          description: "Dimension to sort by (default: total)",
        },
        limit: {
          type: "number",
          description: "Maximum number of agents to return (default: 20)",
        },
      },
    },
  },
  {
    name: "get_credential",
    description:
      "Get a W3C Verifiable Credential for an agent, proving their Spirit Index status.",
    inputSchema: {
      type: "object" as const,
      properties: {
        agent_id: {
          type: "string",
          description: "The agent ID",
        },
      },
      required: ["agent_id"],
    },
  },
];

async function fetchAPI(endpoint: string): Promise<unknown> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function handleToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<string> {
  switch (name) {
    case "lookup_agent": {
      const agentId = args.agent_id as string;
      const data = await fetchAPI(`/agents/${agentId}`);
      return JSON.stringify(data, null, 2);
    }

    case "verify_agent": {
      const agentId = args.agent_id as string;
      const data = await fetchAPI(`/verify/${agentId}`);
      return JSON.stringify(data, null, 2);
    }

    case "discover_agents": {
      const params = new URLSearchParams();
      if (args.capability) params.set("capability", args.capability as string);
      if (args.similar_to) params.set("similar_to", args.similar_to as string);
      if (args.min_score) params.set("min_score", String(args.min_score));
      if (args.verified_only) params.set("verified_only", "true");

      const data = await fetchAPI(`/discover?${params.toString()}`);
      return JSON.stringify(data, null, 2);
    }

    case "list_agents": {
      const params = new URLSearchParams();
      if (args.sort_by) params.set("sort", args.sort_by as string);
      if (args.limit) params.set("limit", String(args.limit));

      const data = await fetchAPI(`/agents?${params.toString()}`);
      return JSON.stringify(data, null, 2);
    }

    case "get_credential": {
      const agentId = args.agent_id as string;
      const data = await fetchAPI(`/credential/${agentId}`);
      return JSON.stringify(data, null, 2);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function main() {
  const server = new Server(
    {
      name: "spirit-index",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS,
  }));

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(name, args as Record<string, unknown>);
      return {
        content: [
          {
            type: "text" as const,
            text: result,
          },
        ],
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  // Connect via stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Spirit Index MCP server running on stdio");
}

main().catch(console.error);
