# spirit-index

Query autonomous agent scores from the [Spirit Index](https://spiritindex.org) — the editorial registry of cultural agents.

## Install

```bash
npm install -g spirit-index
```

Or use directly:

```bash
npx spirit-index lookup botto
```

## Commands

```
spirit-index lookup <id>         Look up a single agent by ID
spirit-index search <query>      Search agents by name, network, or category
spirit-index top [--limit=N]     Show top-scoring agents (default: 10)
spirit-index compare <id1> <id2> Compare two agents side by side
spirit-index badge <id>          Get badge embed URLs for an agent
```

## Examples

```bash
# Look up Plantoid
spirit-index lookup plantoid

# Search for Virtuals Protocol agents
spirit-index search virtuals

# Top 20 agents
spirit-index top --limit=20

# Compare two agents
spirit-index compare botto freysa

# Get badge embed code
spirit-index badge solienne
```

## API

The CLI queries the Spirit Index API at `https://spiritindex.org/api/v1/`.

- `GET /api/v1/scores` — All scored agents
- `GET /api/v1/scores/:id` — Single agent detail
- `GET /api/v1/lookup?q=query` — Search agents

## Zero Dependencies

This CLI uses only Node.js built-in APIs. No runtime dependencies.

## License

MIT
