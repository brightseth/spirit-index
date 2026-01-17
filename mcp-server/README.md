# Spirit Index MCP Server

An MCP (Model Context Protocol) server that enables LLMs like Claude to interact with the Spirit Index - the canonical registry for autonomous cultural agents.

## Installation

```bash
npm install -g spirit-index-mcp
```

Or run directly with npx:

```bash
npx spirit-index-mcp
```

## Claude Code Integration

Add to your `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "spirit-index": {
      "command": "npx",
      "args": ["spirit-index-mcp"]
    }
  }
}
```

## Available Tools

### `lookup_agent`
Look up an agent's full profile including scores, history, and curator notes.

```
lookup_agent({ agent_id: "botto" })
```

### `verify_agent`
Quick trust check - is this agent legitimate?

```
verify_agent({ agent_id: "botto" })
// Returns: { indexed: true, verified: true, score: 55, trust_level: "high" }
```

### `discover_agents`
Find agents by capability or similarity.

```
discover_agents({ capability: "art", min_score: 40 })
discover_agents({ similar_to: "botto" })
```

### `list_agents`
List all indexed agents, sorted by dimension.

```
list_agents({ sort_by: "cultural_impact", limit: 10 })
```

### `get_credential`
Get a W3C Verifiable Credential for an agent.

```
get_credential({ agent_id: "botto" })
```

## Trust Levels

When verifying agents, `trust_level` indicates:

| Level | Meaning |
|-------|---------|
| `high` | Indexed, verified, score >= 50 |
| `medium` | Indexed, verified, score 30-49 |
| `low` | Indexed, verified, score < 30 |
| `indexed` | In registry but not identity-verified |
| `unknown` | Not in Spirit Index |

## API Reference

All tools query the Spirit Index API at `https://spiritindex.org/api`.

- [API Documentation](https://spiritindex.org/docs)
- [OpenAPI Spec](https://spiritindex.org/api/openapi.json)
- [LLM Guide](https://spiritindex.org/llm.txt)

## License

MIT
