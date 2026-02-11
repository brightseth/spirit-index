# ERC-8004 Integration Status — Spirit Index x Spirit Protocol

**Date:** February 11, 2026 (updated from Jan 28)
**Status:** Shipped (Phase 1 complete, upgraded to Base Mainnet)

---

## Current State

### Spirit Protocol (registrar)
- URL prefill works: `spiritId`, `name`, `tagline` only
- Sanitized, bounded, no auto-advance
- Registration flow: explicit, human-readable, safe
- No new coupling introduced, no UX regressions
- Purely a registrar — not a crawler or importer

### Spirit Index (distribution + discovery)
- Server-side on-chain check (`exists`) on **Base Mainnet** (upgraded from Sepolia Feb 11)
- Registry: `0xF2709ceF1Cf4893ed78D3220864428b32b12dFb9`
- Slug → agentId mapping via `KNOWN_AGENT_IDS` in `lib/chain.ts`
- Graceful handling of reverts and unregistered agents
- Visual semantics: green badge = registered, CTA = not registered
- Direct, parameterized handoff to Spirit Protocol

---

## Canonical Flow

1. Agent is discovered on `spiritindex.org/<agent-id>`
2. Spirit Index checks SpiritRegistry on Base Mainnet, determines registration status
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

## Feb 11, 2026 Update — Gene Pivot

Per Gene/Seth call: Spirit = **gated community within ERC-8004**, not a separate system.

**Changes:**
- Upgraded `lib/chain.ts` from Base Sepolia → **Base Mainnet**
- Registry address: `0x4a0e...` (old Sepolia) → `0xF270...` (mainnet)
- ABI: `getAgent(string)` (old) → `exists(uint256)` + `ownerOf(uint256)` (mainnet)
- ID resolution: slug → numeric agentId via `KNOWN_AGENT_IDS` mapping
- BaseScan link in `page.tsx` updated to mainnet
- Registration model: **identity + daily practice only** (no revenue routing at launch)

**See:** `spirit-contracts-core/GENE_PIVOT_FEB_2026.md` for full strategy

---

## What Comes Next

- Register Abraham + Solienne on mainnet (uncomment KNOWN_AGENT_IDS entries)
- Deploy SpiritPractice contracts per agent
- Link practice → identity via `setMetadata()`
- "Agents registered via Spirit: X" counter
- Revenue routing added later (post-traction, not at launch)
