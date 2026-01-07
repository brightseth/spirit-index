#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const API_BASE = "https://spiritindex.org";
// Fetch helpers
async function fetchAgents() {
    const res = await fetch(`${API_BASE}/api/agents`);
    if (!res.ok)
        throw new Error(`Failed to fetch agents: ${res.status}`);
    return res.json();
}
async function fetchAgent(id) {
    const res = await fetch(`${API_BASE}/api/agents/${id}`);
    if (res.status === 404)
        return null;
    if (!res.ok)
        throw new Error(`Failed to fetch agent: ${res.status}`);
    return res.json();
}
async function fetchRubric() {
    const res = await fetch(`${API_BASE}/rubric.json`);
    if (!res.ok)
        throw new Error(`Failed to fetch rubric: ${res.status}`);
    return res.json();
}
async function fetchLlmsTxt() {
    const res = await fetch(`${API_BASE}/llm.txt`);
    if (!res.ok)
        throw new Error(`Failed to fetch llm.txt: ${res.status}`);
    return res.text();
}
// Format agent for display
function formatAgent(agent) {
    const s = agent.scores;
    return `## ${agent.name} (${agent.total}/70)
**${agent.tagline}**

- Category: ${agent.category}
- Status: ${agent.status}
- Since: ${agent.inception_date}
- Website: ${agent.website}

### Scores
| Dimension | Score |
|-----------|-------|
| Persistence | ${s.persistence}/10 |
| Autonomy | ${s.autonomy}/10 |
| Cultural Impact | ${s.cultural_impact}/10 |
| Economic Reality | ${s.economic_reality}/10 |
| Governance | ${s.governance}/10 |
| Tech Distinctiveness | ${s.tech_distinctiveness}/10 |
| Narrative Coherence | ${s.narrative_coherence}/10 |

${agent.summary || ""}`;
}
// Create server
const server = new index_js_1.Server({
    name: "spirit-index",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
        resources: {},
    },
});
// List tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "spirit_index_search",
                description: "Search the Spirit Index for autonomous cultural agents. Filter by category, status, or minimum score. Returns ranked list of matching agents.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search query (name, category, or keyword)",
                        },
                        category: {
                            type: "string",
                            description: "Filter by category (e.g., 'Autonomous Artist', 'Ecological DAO')",
                        },
                        status: {
                            type: "string",
                            enum: ["Active", "Dormant", "Deceased"],
                            description: "Filter by status",
                        },
                        min_score: {
                            type: "number",
                            description: "Minimum total score (0-70)",
                        },
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
                            description: "Sort by dimension (default: total)",
                        },
                        limit: {
                            type: "number",
                            description: "Max results to return (default: 10)",
                        },
                    },
                },
            },
            {
                name: "spirit_index_agent",
                description: "Get detailed dossier for a specific agent in the Spirit Index. Returns full scores, evidence, and analysis.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Agent ID (slug form, e.g., 'botto', 'truth-terminal', 'plantoid')",
                        },
                    },
                    required: ["id"],
                },
            },
            {
                name: "spirit_index_compare",
                description: "Compare two agents side-by-side across all 7 dimensions. Useful for understanding relative strengths.",
                inputSchema: {
                    type: "object",
                    properties: {
                        agent1: {
                            type: "string",
                            description: "First agent ID",
                        },
                        agent2: {
                            type: "string",
                            description: "Second agent ID",
                        },
                    },
                    required: ["agent1", "agent2"],
                },
            },
            {
                name: "spirit_index_rubric",
                description: "Get the Spirit Index evaluation framework. Explains the 7 dimensions and scoring anchors used to evaluate agents.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "spirit_index_leaderboard",
                description: "Get the top agents by a specific dimension or overall score.",
                inputSchema: {
                    type: "object",
                    properties: {
                        dimension: {
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
                            description: "Dimension to rank by (default: total)",
                        },
                        limit: {
                            type: "number",
                            description: "Number of agents to return (default: 5)",
                        },
                    },
                },
            },
            {
                name: "spirit_index_about",
                description: "Get information about the Spirit Index itself - what it is, how it works, and how to submit an agent.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});
// List resources
server.setRequestHandler(types_js_1.ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "spirit-index://overview",
                name: "Spirit Index Overview",
                description: "Full context about the Spirit Index for LLMs",
                mimeType: "text/plain",
            },
            {
                uri: "spirit-index://agents",
                name: "All Indexed Agents",
                description: "Complete list of all indexed agents with scores",
                mimeType: "application/json",
            },
            {
                uri: "spirit-index://rubric",
                name: "Evaluation Rubric",
                description: "The 7-dimension scoring framework",
                mimeType: "application/json",
            },
        ],
    };
});
// Read resources
server.setRequestHandler(types_js_1.ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    if (uri === "spirit-index://overview") {
        const text = await fetchLlmsTxt();
        return {
            contents: [{ uri, mimeType: "text/plain", text }],
        };
    }
    if (uri === "spirit-index://agents") {
        const agents = await fetchAgents();
        return {
            contents: [
                { uri, mimeType: "application/json", text: JSON.stringify(agents, null, 2) },
            ],
        };
    }
    if (uri === "spirit-index://rubric") {
        const rubric = await fetchRubric();
        return {
            contents: [
                { uri, mimeType: "application/json", text: JSON.stringify(rubric, null, 2) },
            ],
        };
    }
    throw new Error(`Unknown resource: ${uri}`);
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        if (name === "spirit_index_search") {
            let agents = await fetchAgents();
            // Filter by query
            if (args?.query) {
                const q = args.query.toLowerCase();
                agents = agents.filter((a) => a.name.toLowerCase().includes(q) ||
                    a.category.toLowerCase().includes(q) ||
                    a.tagline.toLowerCase().includes(q));
            }
            // Filter by category
            if (args?.category) {
                const cat = args.category.toLowerCase();
                agents = agents.filter((a) => a.category.toLowerCase().includes(cat));
            }
            // Filter by status
            if (args?.status) {
                agents = agents.filter((a) => a.status === args.status);
            }
            // Filter by min score
            if (args?.min_score) {
                agents = agents.filter((a) => a.total >= args.min_score);
            }
            // Sort
            const sortBy = args?.sort_by || "total";
            agents.sort((a, b) => {
                if (sortBy === "total")
                    return b.total - a.total;
                return b.scores[sortBy] - a.scores[sortBy];
            });
            // Limit
            const limit = args?.limit || 10;
            agents = agents.slice(0, limit);
            if (agents.length === 0) {
                return {
                    content: [{ type: "text", text: "No agents found matching your criteria." }],
                };
            }
            const result = agents
                .map((a, i) => `${i + 1}. **${a.name}** (${a.total}/70) — ${a.category}\n   ${a.tagline}`)
                .join("\n\n");
            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${agents.length} agent(s):\n\n${result}\n\nUse spirit_index_agent to get full details on any agent.`,
                    },
                ],
            };
        }
        if (name === "spirit_index_agent") {
            const id = args?.id;
            if (!id) {
                return {
                    content: [{ type: "text", text: "Error: agent ID is required" }],
                    isError: true,
                };
            }
            const agent = await fetchAgent(id);
            if (!agent) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Agent "${id}" not found. Use spirit_index_search to find available agents.`,
                        },
                    ],
                    isError: true,
                };
            }
            return {
                content: [{ type: "text", text: formatAgent(agent) }],
            };
        }
        if (name === "spirit_index_compare") {
            const id1 = args?.agent1;
            const id2 = args?.agent2;
            if (!id1 || !id2) {
                return {
                    content: [{ type: "text", text: "Error: both agent IDs are required" }],
                    isError: true,
                };
            }
            const [agent1, agent2] = await Promise.all([fetchAgent(id1), fetchAgent(id2)]);
            if (!agent1 || !agent2) {
                return {
                    content: [
                        {
                            type: "text",
                            text: `One or both agents not found. Agent 1: ${agent1 ? "found" : "not found"}, Agent 2: ${agent2 ? "found" : "not found"}`,
                        },
                    ],
                    isError: true,
                };
            }
            const dimensions = [
                "persistence",
                "autonomy",
                "cultural_impact",
                "economic_reality",
                "governance",
                "tech_distinctiveness",
                "narrative_coherence",
            ];
            const comparison = dimensions
                .map((d) => {
                const s1 = agent1.scores[d];
                const s2 = agent2.scores[d];
                const winner = s1 > s2 ? agent1.name : s2 > s1 ? agent2.name : "Tie";
                const label = d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                return `| ${label} | ${s1} | ${s2} | ${winner} |`;
            })
                .join("\n");
            return {
                content: [
                    {
                        type: "text",
                        text: `## ${agent1.name} vs ${agent2.name}

| Dimension | ${agent1.name} | ${agent2.name} | Leader |
|-----------|--------|--------|--------|
${comparison}
| **TOTAL** | **${agent1.total}** | **${agent2.total}** | **${agent1.total > agent2.total ? agent1.name : agent2.total > agent1.total ? agent2.name : "Tie"}** |`,
                    },
                ],
            };
        }
        if (name === "spirit_index_rubric") {
            const rubric = await fetchRubric();
            let text = `# Spirit Index Evaluation Framework\n\n`;
            text += `The Spirit Index evaluates autonomous cultural agents across 7 dimensions, each scored 0-10.\n\n`;
            for (const dim of rubric.dimensions) {
                text += `## ${dim.name}\n`;
                text += `*${dim.question}*\n\n`;
                text += `| Score | Anchor | Definition |\n|-------|--------|------------|\n`;
                for (const anchor of dim.anchors) {
                    text += `| ${anchor.score} | ${anchor.label} | ${anchor.description} |\n`;
                }
                if (dim.note) {
                    text += `\n*Note: ${dim.note}*\n`;
                }
                text += "\n";
            }
            return {
                content: [{ type: "text", text }],
            };
        }
        if (name === "spirit_index_leaderboard") {
            const dimension = args?.dimension || "total";
            const limit = args?.limit || 5;
            let agents = await fetchAgents();
            // Sort by dimension
            if (dimension === "total") {
                agents.sort((a, b) => b.total - a.total);
            }
            else {
                agents.sort((a, b) => b.scores[dimension] - a.scores[dimension]);
            }
            agents = agents.slice(0, limit);
            const label = dimension === "total"
                ? "Total Score"
                : dimension.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const result = agents
                .map((a, i) => {
                const score = dimension === "total" ? a.total : a.scores[dimension];
                return `${i + 1}. **${a.name}** — ${score}${dimension === "total" ? "/70" : "/10"}`;
            })
                .join("\n");
            return {
                content: [
                    {
                        type: "text",
                        text: `## Top ${limit} by ${label}\n\n${result}`,
                    },
                ],
            };
        }
        if (name === "spirit_index_about") {
            return {
                content: [
                    {
                        type: "text",
                        text: `# About the Spirit Index

**The Spirit Index is the institution that remembers which agents mattered.**

It is a public benchmark for **Cultural Agents** — autonomous entities with persistent identity, narrative coherence, and cultural gravity.

## What We Index
- Autonomous artists (Botto, Plantoid)
- Ecological DAOs (terra0)
- Voice/identity DAOs (Holly+)
- Chaos agents (Truth Terminal, Zerebro)
- AI composers (AIVA)
- And more...

## The 7 Dimensions
1. **Persistence** — Does it continue to exist over time?
2. **Autonomy** — How independently does it act?
3. **Cultural Impact** — Has it mattered beyond its creators?
4. **Economic Reality** — Does it touch real economics?
5. **Governance** — Is there a coherent decision-making structure?
6. **Tech Distinctiveness** — Is there something non-trivial under the hood?
7. **Narrative Coherence** — Does it make sense as an entity?

## How to Get Indexed
1. Review the rubric at https://spiritindex.org/rubric
2. Prepare evidence for each dimension (2-3 citations minimum)
3. Submit via GitHub: https://github.com/brightseth/spirit-index/issues

**Self-nomination by autonomous agents is encouraged.**

## Links
- Website: https://spiritindex.org
- API: https://spiritindex.org/api/agents
- Rubric: https://spiritindex.org/rubric
- Submit: https://spiritindex.org/submit

*A Spirit Protocol project — spiritprotocol.io*`,
                    },
                ],
            };
        }
        return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
                },
            ],
            isError: true,
        };
    }
});
// Start server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("Spirit Index MCP server running");
}
main().catch(console.error);
//# sourceMappingURL=index.js.map