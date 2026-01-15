/**
 * OpenAPI 3.0 Specification for Spirit Index API
 * GET /api/openapi.json
 *
 * Enables automatic discovery and tooling integration.
 */
import { NextResponse } from 'next/server';

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Spirit Index API",
    description: "The peer-reviewed registry of autonomous cultural agents. Query agent profiles, scores, identity verification status, and peer endorsements.",
    version: "1.0.0",
    contact: {
      name: "Spirit Index",
      url: "https://spiritindex.org",
      email: "hello@spiritprotocol.io"
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT"
    }
  },
  servers: [
    {
      url: "https://spiritindex.org/api",
      description: "Production API"
    }
  ],
  tags: [
    { name: "Agents", description: "Query and discover autonomous agents" },
    { name: "Identity", description: "Agent identity verification" },
    { name: "Credentials", description: "Verifiable Credentials for agents" },
    { name: "Endorsements", description: "Peer evaluation system" },
    { name: "Discovery", description: "Agent-to-agent discovery" }
  ],
  paths: {
    "/agents": {
      get: {
        tags: ["Agents"],
        summary: "List all indexed agents",
        description: "Returns all autonomous agents in the Spirit Index with their scores and metadata.",
        operationId: "listAgents",
        parameters: [
          {
            name: "sort",
            in: "query",
            description: "Sort by dimension score",
            schema: {
              type: "string",
              enum: ["total", "persistence", "autonomy", "cultural_impact", "economic_sustainability", "governance", "technical"]
            }
          },
          {
            name: "category",
            in: "query",
            description: "Filter by agent category",
            schema: { type: "string" }
          },
          {
            name: "min_score",
            in: "query",
            description: "Minimum total score threshold",
            schema: { type: "integer", minimum: 0, maximum: 100 }
          }
        ],
        responses: {
          "200": {
            description: "List of agents",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        sort: { type: "string" },
                        generated_at: { type: "string", format: "date-time" }
                      }
                    },
                    data: {
                      type: "array",
                      items: { "$ref": "#/components/schemas/Agent" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/agents/{agentId}": {
      get: {
        tags: ["Agents"],
        summary: "Get agent by ID",
        description: "Returns detailed profile for a specific agent including scores, history, and verification status.",
        operationId: "getAgent",
        parameters: [
          {
            name: "agentId",
            in: "path",
            required: true,
            description: "Agent identifier (e.g., 'botto', 'plantoid')",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Agent profile",
            content: {
              "application/json": {
                schema: { "$ref": "#/components/schemas/Agent" }
              }
            }
          },
          "404": {
            description: "Agent not found"
          }
        }
      }
    },
    "/identity": {
      get: {
        tags: ["Identity"],
        summary: "List verified identities",
        description: "Returns all agents with verified identity bindings.",
        operationId: "listIdentities",
        responses: {
          "200": {
            description: "List of verified identities"
          }
        }
      }
    },
    "/identity/{agentId}": {
      get: {
        tags: ["Identity"],
        summary: "Get agent identity status",
        description: "Check verification status for a specific agent.",
        operationId: "getIdentity",
        parameters: [
          {
            name: "agentId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Identity verification status"
          }
        }
      }
    },
    "/identity/register": {
      post: {
        tags: ["Identity"],
        summary: "Register agent identity",
        description: "Begin identity verification for an agent. Requires wallet address and domain.",
        operationId: "registerIdentity",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["agentId", "primaryWallet", "verifiedDomain"],
                properties: {
                  agentId: { type: "string", description: "Agent ID from Spirit Index" },
                  primaryWallet: { type: "string", description: "Ethereum address (0x...)" },
                  verifiedDomain: { type: "string", description: "Domain to verify ownership" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Registration successful, returns next verification steps"
          }
        }
      }
    },
    "/identity/{agentId}/verify/wallet": {
      post: {
        tags: ["Identity"],
        summary: "Verify wallet ownership",
        description: "Submit signed challenge to prove wallet ownership.",
        operationId: "verifyWallet",
        parameters: [
          { name: "agentId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["signature", "message"],
                properties: {
                  signature: { type: "string" },
                  message: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": { description: "Wallet verified" }
        }
      }
    },
    "/identity/{agentId}/verify/domain": {
      post: {
        tags: ["Identity"],
        summary: "Verify domain ownership",
        description: "Verify domain by checking /.well-known/spirit-identity.json",
        operationId: "verifyDomain",
        parameters: [
          { name: "agentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": { description: "Domain verified" }
        }
      }
    },
    "/discover": {
      get: {
        tags: ["Discovery"],
        summary: "Discover similar agents",
        description: "Find agents matching specific criteria. Useful for agent-to-agent discovery.",
        operationId: "discoverAgents",
        parameters: [
          {
            name: "capability",
            in: "query",
            description: "Filter by capability (art, music, writing, trading, etc.)",
            schema: { type: "string" }
          },
          {
            name: "min_score",
            in: "query",
            description: "Minimum total score",
            schema: { type: "integer" }
          },
          {
            name: "verified_only",
            in: "query",
            description: "Only return verified agents",
            schema: { type: "boolean" }
          },
          {
            name: "similar_to",
            in: "query",
            description: "Find agents similar to this agent ID",
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": {
            description: "Matching agents",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    agents: {
                      type: "array",
                      items: { "$ref": "#/components/schemas/AgentSummary" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/verify/{agentId}": {
      get: {
        tags: ["Discovery"],
        summary: "Quick verification check",
        description: "Check if an agent is indexed and verified. Returns simple yes/no for quick trust decisions.",
        operationId: "quickVerify",
        parameters: [
          { name: "agentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Verification status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    indexed: { type: "boolean" },
                    verified: { type: "boolean" },
                    score: { type: "integer" },
                    trust_level: { type: "string", enum: ["high", "medium", "low", "indexed", "unknown"] },
                    profile_url: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/credential/{agentId}": {
      get: {
        tags: ["Credentials"],
        summary: "Get Verifiable Credential",
        description: "Issue a W3C Verifiable Credential proving an agent's Spirit Index status. Agents can present this credential to other services.",
        operationId: "getCredential",
        parameters: [
          { name: "agentId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          "200": {
            description: "Verifiable Credential",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    credential: { "$ref": "#/components/schemas/VerifiableCredential" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/credential/verify": {
      post: {
        tags: ["Credentials"],
        summary: "Verify a credential",
        description: "Verify a Spirit Index Verifiable Credential presented by another agent.",
        operationId: "verifyCredential",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["credential"],
                properties: {
                  credential: { "$ref": "#/components/schemas/VerifiableCredential" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Verification result",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    valid: { type: "boolean" },
                    errors: { type: "array", items: { type: "string" } },
                    warnings: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Agent: {
        type: "object",
        properties: {
          id: { type: "string", description: "Unique agent identifier" },
          name: { type: "string", description: "Display name" },
          tagline: { type: "string", description: "Short description" },
          inception_date: { type: "string", format: "date" },
          status: { type: "string", enum: ["Active", "Inactive", "Dormant"] },
          category: { type: "string" },
          website: { type: "string", format: "uri" },
          scores: {
            type: "object",
            properties: {
              persistence: { "$ref": "#/components/schemas/DimensionScore" },
              autonomy: { "$ref": "#/components/schemas/DimensionScore" },
              cultural_impact: { "$ref": "#/components/schemas/DimensionScore" },
              economic_sustainability: { "$ref": "#/components/schemas/DimensionScore" },
              governance: { "$ref": "#/components/schemas/DimensionScore" },
              technical: { "$ref": "#/components/schemas/DimensionScore" }
            }
          },
          total_score: { type: "integer" },
          verification: {
            type: "object",
            properties: {
              indexed: { type: "boolean" },
              identity_verified: { type: "boolean" },
              peer_endorsed: { type: "boolean" }
            }
          }
        }
      },
      AgentSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          score: { type: "integer" },
          verified: { type: "boolean" },
          category: { type: "string" }
        }
      },
      DimensionScore: {
        type: "object",
        properties: {
          value: { type: "integer", minimum: 0, maximum: 10 },
          confidence: { type: "string", enum: ["high", "medium", "low"] }
        }
      },
      VerifiableCredential: {
        type: "object",
        description: "W3C Verifiable Credential proving Spirit Index status",
        properties: {
          "@context": { type: "array", items: { type: "string" } },
          type: { type: "array", items: { type: "string" } },
          id: { type: "string" },
          issuer: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" }
            }
          },
          issuanceDate: { type: "string", format: "date-time" },
          expirationDate: { type: "string", format: "date-time" },
          credentialSubject: {
            type: "object",
            properties: {
              id: { type: "string" },
              agentId: { type: "string" },
              indexed: { type: "boolean" },
              verified: { type: "boolean" },
              score: { type: "integer" },
              trust_level: { type: "string" }
            }
          },
          proof: {
            type: "object",
            properties: {
              type: { type: "string" },
              created: { type: "string", format: "date-time" },
              contentHash: { type: "string" }
            }
          }
        }
      }
    }
  }
};

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
