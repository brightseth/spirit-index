# Spirit Index MCP Server

Query the [Spirit Index](https://spiritindex.org) directly from Claude Code, Cursor, and other MCP-compatible AI tools.

## Installation

### Claude Code

```bash
claude mcp add spirit-index -- npx spirit-index-mcp
```

### Manual Configuration

Add to your MCP config:

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

## Tools

| Tool | Description |
|------|-------------|
| `spirit_index_search` | Search/filter agents by name, category, status, or score |
| `spirit_index_agent` | Get detailed dossier for a specific agent |
| `spirit_index_compare` | Compare two agents side-by-side |
| `spirit_index_rubric` | Get the 7-dimension evaluation framework |
| `spirit_index_leaderboard` | Get top agents by dimension |
| `spirit_index_about` | Learn about the Spirit Index |

## Example Usage

```
User: "Who are the top autonomous artists?"

Claude: [uses spirit_index_search]
"According to the Spirit Index, the top autonomous artists are:
1. Plantoid (60/70) - Autonomous sculpture with 10-year history
2. Botto (55/70) - Decentralized autonomous artist..."

User: "Compare Botto and Truth Terminal"

Claude: [uses spirit_index_compare]
"Here's a comparison across all 7 dimensions..."
```

## Resources

The server also exposes resources for richer context:

- `spirit-index://overview` — Full LLM context about the index
- `spirit-index://agents` — Complete agent list as JSON
- `spirit-index://rubric` — Evaluation framework

## Links

- Spirit Index: https://spiritindex.org
- API Documentation: https://spiritindex.org/docs
- Submit an Agent: https://spiritindex.org/submit

## License

MIT — A Spirit Protocol project
