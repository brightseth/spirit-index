# ERC-8004 Integration Status — Spirit Index x Spirit Protocol

**Date:** January 28, 2026
**Status:** Shipped (Phase 1 complete)

---

## Current State

### Spirit Protocol (registrar)
- URL prefill works: `spiritId`, `name`, `tagline` only
- Sanitized, bounded, no auto-advance
- Registration flow: explicit, human-readable, safe
- No new coupling introduced, no UX regressions
- Purely a registrar — not a crawler or importer

### Spirit Index (distribution + discovery)
- Server-side on-chain check (`getAgent`) on Base Sepolia
- Graceful handling of reverts and unregistered agents
- Visual semantics: green badge = registered, CTA = not registered
- Direct, parameterized handoff to Spirit Protocol

---

## Canonical Flow

1. Agent is discovered on `spiritindex.org/<agent-id>`
2. Spirit Index checks registry on Base Sepolia, determines registration status
3. If not registered: shows CTA, links to Spirit Protocol with safe prefill
4. Spirit Protocol: presents identity registration, user verifies + signs, ERC-8004 identity registered on-chain
5. Spirit Index: reflects status on next visit (or cached refresh)

No tokens. No approvals. No hidden steps.

---

## Strategic Value

- **Spirit Index becomes the growth surface** — agents already want to be listed, registration is natural next step
- **Spirit Protocol stays neutral** — no forced economics, staking, or governance
- **ERC-8004 adoption is organic** — agents adopt because it gives visibility and legitimacy
- Parallel to how ENS gained traction early

---

## Do Not Change

- Don't remove the API route (`/api/agents/[id]/registration`) — flexibility for client-side refresh, batch checks
- Don't auto-advance stages on prefill
- Don't add verification logic yet
- Don't introduce tokens or fees

---

## Recommended Next Steps

### 1. Register 2-3 canonical agents
- Abraham, Solienne, one external/non-Eden agent
- Become reference implementations, screenshots for Base/Coinbase, anchors for docs

### 2. Add one metric
- "Agents registered via Spirit: X" — social proof, even if X = 3

### 3. Write short explainer (half page)
- Why register your agent on-chain? Permanence, discoverability, future optionality
- No mention of tokens

---

## Files Changed

| File | Repo | Action |
|------|------|--------|
| `src/pages/register.njk` | spiritprotocol.io | Modified — URL param parsing with sanitization |
| `lib/chain.ts` | spirit-index | Created — viem chain utility |
| `app/api/agents/[id]/registration/route.ts` | spirit-index | Created — registration status API |
| `app/[id]/page.tsx` | spirit-index | Modified — status badge + CTA |

---

## What Comes Next (not yet)

- Verification vs trust
- When identity becomes insufficient
- What "activation" should mean
