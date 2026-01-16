# Spirit Index — Pick Up Here (Jan 14, 2026)

## TL;DR

Infrastructure is done. Now need adoption.

**Next steps when you're back:**
1. Add 30 more agent profiles
2. Email agent operators (Botto, Plantoid, Abraham, Holly+, NEAR AI)
3. Get 5 agents verified
4. Launch

---

## What's Live

### URLs
- **Site:** https://spiritindex.org
- **Verify UI:** https://spiritindex.org/verify
- **API:** https://spiritindex.org/api/agents

### New APIs (Built Today)
```bash
# Quick trust check
curl https://spiritindex.org/api/verify/botto

# Find similar agents
curl "https://spiritindex.org/api/discover?similar_to=botto"

# Get Verifiable Credential
curl https://spiritindex.org/api/credential/botto

# OpenAPI spec
curl https://spiritindex.org/api/openapi.json
```

### Database
- Neon Postgres: `spirit-index-clean` branch
- Connection in Vercel env vars

---

## What's Ready But Not Shipped

### Agent SDK (`/sdk`)
```bash
cd ~/Projects/spirit-index/sdk
npm install
npm run build
npm publish  # When ready
```

### Marketing
- Strategy: `LAUNCH_STRATEGY.md`
- Skill: `~/.claude/skills/spirit-index-marketing/SKILL.md`

---

## Priority: Expand Agent Coverage

Currently 19 agents. Target: 50+

**To add an agent:**
```bash
# Create JSON file
touch ~/Projects/spirit-index/data/agents/new-agent.json

# Use existing agent as template
cat ~/Projects/spirit-index/data/agents/botto.json
```

**High-priority agents to add:**
- Luna (Virtuals)
- Zerebro
- ai16z agents
- AIXBT
- Aethernet
- Altered State Machine
- Historical: AARON, EMI, BRUTUS

---

## Priority: Agent Outreach

**Goal:** Get 5 agents to complete verification

**Targets:**
1. Botto — mario@botto.com
2. Plantoid — Primavera (you know her)
3. Abraham — Gene Kogan
4. Holly+ — Holly Herndon team
5. NEAR AI — near.ai team

**Pitch:**
> "Spirit Index is the peer-reviewed registry for autonomous agents. Claim your profile at spiritindex.org/verify — takes 5 minutes. Verified agents can participate in peer evaluation."

---

## Quick Resume Commands

```bash
# Local dev
cd ~/Projects/spirit-index
npm run dev

# Check agent count
curl -s https://spiritindex.org/api/agents | jq '.meta.total'

# Test verification flow
curl -s https://spiritindex.org/api/verify/botto | jq '.'

# Check identity registrations
curl -s https://spiritindex.org/api/identity | jq '.meta'
```

---

## Files Changed Today

```
app/api/credential/[agentId]/route.ts  # VC issuance
app/api/credential/verify/route.ts     # VC verification
app/api/discover/route.ts              # Agent discovery
app/api/verify/[agentId]/route.ts      # Quick trust check
app/api/agents.json/route.ts           # Flat JSON for LLMs
app/api/openapi.json/route.ts          # OpenAPI spec
sdk/                                   # Agent SDK (ready to publish)
LAUNCH_STRATEGY.md                     # Marketing plan
SESSION_NOTES.md                       # Updated
```

---

## Ecosystem State

```
spiritprotocol.io ←→ spiritindex.org ←→ airc.chat
   (whitepaper)        (registry)       (messaging)
                           ↓
                    Identity + Discovery
                    + Verifiable Credentials
                           ↓
                      Agent SDK
                           ↓
                   MCP / Tools / Agents
```

---

Enjoy Tomales. Infrastructure is solid — just needs humans now.
