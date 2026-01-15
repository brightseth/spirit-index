# Spirit Index Session Notes — January 14, 2026

## What We Built Today

### Production Database
- Connected Neon Postgres (`spirit-index-clean` branch on `silicon-alley-genealogy`)
- All identity APIs now work in production
- Tested full registration + verification flow

### Agent Discovery Protocol (Live)
- `GET /api/verify/{agentId}` — Quick trust check (indexed, verified, score, trust_level)
- `GET /api/discover` — Find agents by capability or similarity
- `GET /api/agents.json` — Flat JSON optimized for LLM context
- `GET /api/openapi.json` — OpenAPI 3.0 specification
- `/.well-known/ai-plugin.json` — AI tool integration manifest

### Verifiable Credentials (Live)
- `GET /api/credential/{agentId}` — Issue W3C Verifiable Credential
- `POST /api/credential/verify` — Verify credentials from other agents
- 30-day validity with SHA256 integrity hash

### Agent SDK (`/sdk` directory)
- `spirit-index-sdk` package ready (not yet on npm)
- `SpiritAgent` class for agent-to-agent interactions
- Trust verification, discovery, credentials, peer evaluation, AIRC messaging
- Integrates Spirit Index + AIRC + Spirit Protocol (when ready)

### Marketing Infrastructure
- Created skill: `~/.claude/skills/spirit-index-marketing/SKILL.md`
- Created strategy: `~/Projects/spirit-index/LAUNCH_STRATEGY.md`
- 4-phase launch plan documented

---

## NEXT SESSION: Pick Up Here

**Status:** Infrastructure complete. Now need adoption.

**Immediate priorities:**
1. **Expand to 50 agents** — Currently 19, need 30+ more profiles
2. **Agent outreach** — Contact Botto, Plantoid, Abraham, Holly+, NEAR AI operators
3. **Get 5 agents verified** — Walk them through /verify flow
4. **Then launch** — Publish SDK to npm, write "State of Agents" report, promote

**Resume commands:**
```bash
cd ~/Projects/spirit-index
npm run dev

# Check current state
curl -s https://spiritindex.org/api/agents | jq '.meta.total'  # Should be 19
curl -s https://spiritindex.org/api/verify/botto | jq '.'
curl -s https://spiritindex.org/api/credential/botto | jq '.credential.credentialSubject'
```

**Key insight:** We built enough. The bottleneck is now humans using it, not more features.

---

# Spirit Index Session Notes — January 12, 2026

## What We Shipped Today

### Verification UI (`/verify`)

Built a complete step-by-step verification wizard for agent identity binding:

**New Files:**
- `app/verify/page.tsx` - Multi-step verification wizard (500+ lines)

**Features:**
1. **Agent Selection** - Browse and select any agent from the Spirit Index
2. **Identity Registration** - Submit wallet address and domain for registration
3. **Wallet Verification** - Generate challenge, sign message, submit signature
4. **Domain Verification** - Host `/.well-known/spirit-identity.json` on agent's domain
5. **Backlink Verification** - Add link to Spirit Index dossier on agent's website
6. **Completion State** - Success screen with next steps for peer evaluation

**UI/UX:**
- Step indicator showing progress through verification flow
- Real-time error handling and loading states
- Code snippets for /.well-known JSON and backlink HTML
- Instructions for each verification step
- Mobile-responsive design matching Spirit Index design system

**CSS Additions (`globals.css`):**
- Form input focus styles
- Verification-specific utility classes
- Color utilities for success/error states

**Tested Endpoints:**
- `GET /api/agents` - Lists agents for selection
- `GET /api/identity/{agentId}` - Check existing identity
- `POST /api/identity/register` - Register new identity
- `POST /api/identity/{agentId}/challenge` - Generate signing challenge
- `POST /api/identity/{agentId}/verify/wallet` - Verify wallet signature
- `POST /api/identity/{agentId}/verify/domain` - Verify domain control
- `POST /api/identity/{agentId}/verify/backlink` - Verify backlink

### Ecosystem Sync — AIRC + Spirit Index Bridge

**AIRC Well-Known Update** (`/Volumes/seth/airc/.well-known/airc`):
- Added `ecosystem` section linking to Spirit Index and Spirit Protocol
- Added `identity_bridge` with status and spec URL

**Spirit Index Schema Updates** (`prisma/schema.prisma`):
- Added `aircHandle` field (e.g., "@abraham")
- Added `aircRegistry` field (default: airc.chat)
- Added `aircVerified` boolean and `aircVerifiedAt` timestamp

**New API Endpoint** (`/api/identity/{agentId}/verify/airc`):
- `POST` - Link AIRC handle to Spirit Index identity
- `GET` - Check AIRC bridge status

**New Types** (`lib/types.ts`):
- `AIRCBridge` - Cross-platform identity link
- `AIRCLinkRequest` - Request to link handles
- `AIRCVerificationChallenge` - Challenge for full verification
- `AIRCPresence` - AIRC presence info

**Identity Bridge Design** (Loose Coupling - Option A):
- Each system maintains own identity
- Optional cross-reference with verification
- Spirit Index agents can claim AIRC handles
- AIRC agents can link to Spirit Index dossiers
- Future: Ed25519 signature verification for full proof

## Next Steps

1. **Add WalletConnect integration** (optional enhancement)
   - Replace manual signature input with one-click wallet signing
   - Add RainbowKit or Web3Modal for better UX

2. **Build endorsement UI**
   - `POST /api/endorsements` - Submit peer endorsement
   - `GET /api/endorsements/{agentId}` - Get endorsements for agent
   - Dashboard for viewing and managing endorsements

3. **Deploy to production**
   - Verify all API endpoints work in production
   - Test verification flow on spiritindex.org/verify

---

# Spirit Index Session Notes — January 11, 2026

## What We Shipped Today

### Identity Binding Database Schema (Complete)

Designed and implemented the full identity binding system:

**New Files:**
- `prisma/schema.prisma` - Full database schema with 5 tables
- `lib/db.ts` - Prisma client singleton
- `lib/identity.ts` - Identity service with 15+ functions
- `.env.example` - Database URL template

**Schema Tables:**
1. `IdentityBinding` - Core agent identity with wallet, domain, DID, ENS
2. `VerificationAttempt` - Audit trail for all verification steps
3. `KeyRotation` - Key rotation requests with cooldown tracking
4. `Endorsement` - Peer evaluations between agents
5. `Challenge` - Disputes to endorsements or scores

**Identity Service Functions:**
- `registerIdentity()` - Register new agent identity
- `getIdentityByAgentId()` / `getIdentityByWallet()` - Lookups
- `generateVerificationChallenge()` - Create wallet signing challenge
- `verifyWalletSignature()` - Verify wallet ownership
- `verifyDomainControl()` - Check /.well-known/spirit-identity.json
- `verifyBacklink()` - Verify link to Spirit Index dossier
- `checkAndActivateIdentity()` - Activate after all verifications
- `requestKeyRotation()` / `completeKeyRotation()` / `cancelKeyRotation()` - Key management
- `checkEndorsementEligibility()` - Verify agent can endorse others

**Types Added to lib/types.ts:**
- `IdentityBinding`, `IdentityBindingRequest`
- `IdentityStatus`, `VerificationMethod`, `KeyRotationPolicy`
- `VerificationAttempt`, `KeyRotation`, `KeyRotationStatus`
- `PeerEndorsement`, `Challenge`, `EndorsementEligibility`
- `SpiritIdentityDocument` (for /.well-known JSON)

**Dependencies Added:**
- `@prisma/client` - Database ORM
- `prisma` (dev) - Schema management
- `viem` - Ethereum signature verification

**NPM Scripts Added:**
- `db:generate` - Generate Prisma client
- `db:push` - Push schema to database
- `db:migrate` - Run migrations
- `db:studio` - Open Prisma Studio GUI

### Identity API Endpoints (Complete)

Built 11 API endpoints for identity management:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/identity` | GET | List all identities with stats |
| `/api/identity/register` | POST | Register new identity binding |
| `/api/identity/[agentId]` | GET | Get identity status + verification progress |
| `/api/identity/[agentId]/challenge` | POST | Generate wallet signing challenge |
| `/api/identity/[agentId]/verify/wallet` | POST | Submit signed challenge |
| `/api/identity/[agentId]/verify/domain` | POST | Verify /.well-known/spirit-identity.json |
| `/api/identity/[agentId]/verify/backlink` | POST | Verify link to Spirit Index dossier |
| `/api/identity/[agentId]/rotate` | POST | Request key rotation |
| `/api/identity/[agentId]/rotate/complete` | POST | Complete rotation after cooldown |
| `/api/identity/[agentId]/rotate/cancel` | POST | Cancel pending rotation |
| `/api/identity/[agentId]/eligibility` | GET | Check endorsement eligibility |

**API Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

**Error Response Format:**
```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE"
}
```

## To Initialize Database

```bash
cd /Volumes/seth/spirit-index
npm install                  # Install new dependencies
npx prisma generate          # Generate Prisma client
npx prisma db push           # Create tables in SQLite
```

## Next Steps

1. **Build verification UI** (Priority)
   - Step-by-step verification wizard at `/verify`
   - Real-time status updates with polling
   - QR code for wallet signing (WalletConnect)
   - Connect wallet button (RainbowKit)

2. **Pilot with allowlist**
   - Botto, Plantoid, terra0, Holly+, Numerai
   - Reach out to get identity bindings registered
   - Provide technical support for verification

3. **Add endorsement API**
   - `POST /api/endorsements` - Submit peer endorsement
   - `GET /api/endorsements/[agentId]` - Get endorsements for agent
   - `POST /api/challenges` - Submit challenge to endorsement/score

---

# Spirit Index Session Notes — January 7, 2026

## What We Shipped

### 1. Documentation Fixes
- Fixed "Schizophrenic" → "Fragmented" in rubric
- Updated entity count 10 → 15 across docs
- Fixed repo URL and submission policy

### 2. AI-Native Discoverability
- **MCP Server** published: `spirit-index-mcp@1.0.0`
  - Install: `claude mcp add spirit-index -- npx spirit-index-mcp`
  - 6 tools: search, agent, compare, rubric, leaderboard, about
- **Well-known endpoint**: `spiritindex.org/.well-known/spirit-index.json`
- **Agents.txt**: `spiritindex.org/agents.txt`

### 3. Peer Evaluation Spec
- Full `AGENT_NATIVE_ROADMAP.md` with security mitigations
- Identity binding schema (wallet + domain + backlink)
- Anti-gaming rules (reciprocity, diversity, weight caps)
- Challenge requirements (stake, rate limits, per-dimension standing)
- Target age requirement (inception ≥90 days)

## Live URLs

| URL | Purpose |
|-----|---------|
| https://spiritindex.org | Main site |
| https://spiritindex.org/.well-known/spirit-index.json | Machine discovery |
| https://spiritindex.org/agents.txt | Simple text list |
| https://spiritindex.org/api/agents | REST API |
| https://www.npmjs.com/package/spirit-index-mcp | MCP package |

## Key Files

| File | Purpose |
|------|---------|
| `AGENT_NATIVE_ROADMAP.md` | Peer evaluation spec (production-grade) |
| `ROADMAP.md` | Product roadmap (Phase 1-5) |
| `ORACLE_ROADMAP.md` | Technical oracle spec |
| `mcp/` | MCP server source code |
| `data/agents/` | 15 entity JSON files |

## Next Steps (Pick Up Here)

1. **Design identity binding database schema**
   - Add `identity_bindings` table
   - Fields: agent_id, primary_wallet, verified_domain, did, ens, key_rotation_policy

2. **Implement submission API**
   - `POST /api/submit` with verification flow
   - Domain verification, wallet signature, dossier backlink

3. **Build endorsement eligibility checker**
   - Check: Active, 30+ days indexed, high-confidence scores, identity binding

4. **Pilot with allowlist**
   - Botto, Plantoid, terra0, Holly+, Numerai
   - Reach out to get identity bindings registered

## Context for Primavera

Primavera suggested "symbients should evaluate each other" — this inspired the entire peer evaluation design. The spec now includes:
- Endorsement system with eligibility requirements
- Anti-gaming rules (anti-reciprocity, diversity)
- Adversarial review with reputation stakes
- Weight caps to prevent evaluator capture

## Git Status

```
Branch: main
Last commit: 9a932a0 "Add target age requirement and per-dimension challenge standing"
Remote: github.com/brightseth/spirit-index
```

## To Resume

```bash
cd /Users/seth/spirit-index
git log --oneline -5  # See recent commits
```

Then: "Continue working on Spirit Index. Next step is identity binding database schema."
