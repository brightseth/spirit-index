#!/usr/bin/env node
/**
 * Spirit Index — ERC-8004 Registry Sync
 *
 * Reads the SpiritRegistry contract on Base Mainnet to discover all
 * registered agents via SpiritRegistered events, then maps them to
 * Spirit Index agent IDs where possible.
 *
 * Updates: data/registry-map.json
 *
 * How it works:
 *   1. Fetch all SpiritRegistered events from the contract
 *   2. For each event, read the agentURI to extract the agent name
 *   3. Match against existing Spirit Index agent JSON files
 *   4. Write the updated registry map
 *
 * Run:  node scripts/sync-registry.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const AGENTS_DIR = path.join(DATA_DIR, "agents");
const REGISTRY_MAP_PATH = path.join(DATA_DIR, "registry-map.json");

// ---------------------------------------------------------------------------
// Contract config
// ---------------------------------------------------------------------------

const REGISTRY_ADDRESS = "0xF2709ceF1Cf4893ed78D3220864428b32b12dFb9";
const RPC_URL = "https://mainnet.base.org";
const CHAIN_ID = 8453;

// SpiritRegistered event topic
// keccak256("SpiritRegistered(uint256,address,address,address)")
const SPIRIT_REGISTERED_TOPIC =
  "0x" +
  "b5f2c215b0cd09a8a0e81c945b98e4a444fa1ef2c151a6a8c47b0a6ee6dc8e8b";

// Registered event topic (from ERC8004IdentityRegistry)
// keccak256("Registered(uint256,string,address)")
const REGISTERED_TOPIC =
  "0x" +
  "d15cd1bac53e2d44d83b8bbd1c8c44e7f85b92a84c9bf65fb29dd3a13c5059f6";

// ---------------------------------------------------------------------------
// Known slug overrides (on-chain agentId -> Spirit Index slug)
// For agents whose on-chain name doesn't exactly match the file slug.
// Add entries here when the on-chain URI/name differs from the slug.
// ---------------------------------------------------------------------------

const SLUG_OVERRIDES = {
  // agentId: "spirit-index-slug"
  // 1: "some-agent",    // if agentId 1 is registered but name differs
};

// ---------------------------------------------------------------------------
// Minimal RPC helper (no viem dependency — this is a standalone script)
// ---------------------------------------------------------------------------

async function rpcCall(method, params) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(`RPC error: ${json.error.message}`);
  return json.result;
}

/**
 * Read a view function that returns a single value.
 */
async function readContract(address, functionSig, args = []) {
  // Encode function call (minimal ABI encoding)
  const selector = await getFunctionSelector(functionSig);
  let data = selector;
  for (const arg of args) {
    data += padHex(arg);
  }

  const result = await rpcCall("eth_call", [
    { to: address, data },
    "latest",
  ]);
  return result;
}

/**
 * Get function selector (first 4 bytes of keccak256)
 */
async function getFunctionSelector(sig) {
  // Use a simple keccak256 via the Web Crypto API workaround:
  // We'll hardcode the selectors we need since we only call a few functions
  const selectors = {
    "exists(uint256)": "0x4f558e79",
    "ownerOf(uint256)": "0x6352211e",
    "agentURI(uint256)": "0x82e1be77",
    "getSpiritConfig(uint256)": "0xc6f46e37",
  };
  return selectors[sig] || "0x00000000";
}

function padHex(value) {
  const hex =
    typeof value === "bigint"
      ? value.toString(16)
      : typeof value === "number"
        ? value.toString(16)
        : value;
  return hex.padStart(64, "0");
}

function hexToNumber(hex) {
  return parseInt(hex, 16);
}

function decodeAddress(hex) {
  // Address is the last 20 bytes of a 32-byte slot
  const clean = hex.replace(/^0x/, "");
  return "0x" + clean.slice(-40);
}

function decodeString(hex) {
  // ABI-encoded string: offset (32 bytes) + length (32 bytes) + data
  const clean = hex.replace(/^0x/, "");
  if (clean.length < 128) return "";

  // For a simple return of a single string:
  // First 32 bytes = offset to string data
  // Next 32 bytes = string length
  // Remaining = string bytes
  const offset = hexToNumber(clean.slice(0, 64)) * 2; // byte offset -> hex char offset
  const length = hexToNumber(clean.slice(offset, offset + 64));
  const strHex = clean.slice(offset + 64, offset + 64 + length * 2);

  let str = "";
  for (let i = 0; i < strHex.length; i += 2) {
    str += String.fromCharCode(parseInt(strHex.slice(i, i + 2), 16));
  }
  return str;
}

function decodeBool(hex) {
  const clean = hex.replace(/^0x/, "");
  return clean[clean.length - 1] !== "0";
}

// ---------------------------------------------------------------------------
// Discovery: scan events to find registered agent IDs
// ---------------------------------------------------------------------------

async function discoverRegisteredAgents() {
  console.log("Scanning SpiritRegistered events...");

  // Get the current block number
  const latestBlock = await rpcCall("eth_blockNumber", []);

  // Fetch SpiritRegistered events from contract creation to now
  // The contract was deployed ~Feb 3, 2026. Base block time is ~2s.
  // We'll scan from a reasonable start block.
  const logs = await rpcCall("eth_getLogs", [
    {
      address: REGISTRY_ADDRESS,
      topics: [SPIRIT_REGISTERED_TOPIC],
      fromBlock: "0x0",
      toBlock: "latest",
    },
  ]);

  console.log(`  Found ${logs.length} SpiritRegistered events`);

  const agents = [];

  for (const log of logs) {
    // SpiritRegistered(uint256 indexed agentId, address indexed treasury, address indexed artist, address platform)
    const agentId = hexToNumber(log.topics[1]);
    const treasury = decodeAddress(log.topics[2]);
    const artist = decodeAddress(log.topics[3]);

    // Get block timestamp for registeredAt
    const block = await rpcCall("eth_getBlockByNumber", [
      log.blockNumber,
      false,
    ]);
    const timestamp = new Date(hexToNumber(block.timestamp) * 1000)
      .toISOString()
      .split("T")[0];

    agents.push({
      agentId,
      treasury,
      artist,
      registeredAt: timestamp,
      blockNumber: hexToNumber(log.blockNumber),
      transactionHash: log.transactionHash,
    });
  }

  return agents;
}

// ---------------------------------------------------------------------------
// Fallback: iterate IDs sequentially if events are sparse
// ---------------------------------------------------------------------------

async function probeAgentIds(maxId = 50) {
  console.log(`Probing agent IDs 1..${maxId}...`);
  const agents = [];

  for (let id = 1; id <= maxId; id++) {
    try {
      const existsResult = await readContract(
        REGISTRY_ADDRESS,
        "exists(uint256)",
        [id]
      );
      const exists = decodeBool(existsResult);

      if (!exists) {
        // Once we hit a gap after finding agents, keep going a bit
        // but if we've had 5 consecutive misses after the first hit, stop
        if (agents.length > 0) {
          const consecutiveMisses = id - agents[agents.length - 1].agentId;
          if (consecutiveMisses > 5) break;
        }
        continue;
      }

      // Get owner
      const ownerResult = await readContract(
        REGISTRY_ADDRESS,
        "ownerOf(uint256)",
        [id]
      );
      const owner = decodeAddress(ownerResult);

      // Get agentURI
      const uriResult = await readContract(
        REGISTRY_ADDRESS,
        "agentURI(uint256)",
        [id]
      );
      const uri = decodeString(uriResult);

      agents.push({
        agentId: id,
        owner,
        uri,
        // We don't have the exact registration date from probing,
        // so we'll use the existing map or a default
        registeredAt: null,
      });

      console.log(`  Agent #${id}: owner=${owner.slice(0, 10)}... uri=${uri.slice(0, 60) || "(empty)"}`);
    } catch (err) {
      // RPC error or revert — skip this ID
      console.warn(`  Agent #${id}: error — ${err.message}`);
    }
  }

  return agents;
}

// ---------------------------------------------------------------------------
// Match on-chain agents to Spirit Index slugs
// ---------------------------------------------------------------------------

function buildSlugIndex() {
  // Build a map of agent slugs from the data/agents/ directory
  const files = fs.readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".json"));
  const index = {};

  for (const file of files) {
    const slug = file.replace(".json", "");
    try {
      const content = JSON.parse(
        fs.readFileSync(path.join(AGENTS_DIR, file), "utf-8")
      );
      index[slug] = {
        name: content.name,
        network: content.network,
        website: content.website,
      };
    } catch {
      // Skip malformed files
    }
  }

  return index;
}

function matchAgentToSlug(agent, slugIndex) {
  const { agentId, uri } = agent;

  // 1. Check explicit overrides first
  if (SLUG_OVERRIDES[agentId]) {
    return SLUG_OVERRIDES[agentId];
  }

  // 2. Try to match by URI (e.g., "https://spiritprotocol.io/agents/abraham/metadata.json")
  if (uri) {
    const uriMatch = uri.match(/\/agents\/([^/]+)\//);
    if (uriMatch && slugIndex[uriMatch[1]]) {
      return uriMatch[1];
    }
  }

  // 3. Try name-based matching from URI JSON (if it's a resolvable URL)
  // This is best-effort; the sync can be re-run after manual slug overrides

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Spirit Registry Sync ===");
  console.log(`Contract: ${REGISTRY_ADDRESS}`);
  console.log(`Chain: Base (${CHAIN_ID})`);
  console.log(`Date: ${new Date().toISOString().split("T")[0]}\n`);

  // Load existing map for merging
  let existingMap = { registrations: {} };
  try {
    existingMap = JSON.parse(fs.readFileSync(REGISTRY_MAP_PATH, "utf-8"));
  } catch {
    // First run — start fresh
  }

  // Build the slug index from agent JSON files
  const slugIndex = buildSlugIndex();
  console.log(`Loaded ${Object.keys(slugIndex).length} Spirit Index agents\n`);

  // Strategy: try events first, fall back to probing
  let onChainAgents = [];
  try {
    onChainAgents = await discoverRegisteredAgents();
  } catch (err) {
    console.warn(`Event scanning failed: ${err.message}`);
    console.log("Falling back to sequential ID probing...\n");
  }

  // If events returned nothing, probe sequentially
  if (onChainAgents.length === 0) {
    onChainAgents = await probeAgentIds(50);
  }

  console.log(`\nDiscovered ${onChainAgents.length} on-chain agents\n`);

  // Build reverse map from existing registrations (registryId -> slug)
  const existingByRegistryId = {};
  for (const [slug, info] of Object.entries(existingMap.registrations)) {
    existingByRegistryId[info.registryId] = slug;
  }

  // Build new registrations map
  const registrations = {};
  let matched = 0;
  let unmatched = 0;

  for (const agent of onChainAgents) {
    // Try to match to a Spirit Index slug
    let slug = existingByRegistryId[agent.agentId]; // Preserve existing mappings

    if (!slug) {
      slug = matchAgentToSlug(agent, slugIndex);
    }

    if (slug) {
      registrations[slug] = {
        registryId: agent.agentId,
        wallet: agent.treasury || agent.owner || agent.artist,
        registeredAt:
          agent.registeredAt ||
          existingMap.registrations[slug]?.registeredAt ||
          new Date().toISOString().split("T")[0],
      };
      matched++;
      console.log(`  Matched: #${agent.agentId} -> ${slug}`);
    } else {
      unmatched++;
      console.log(
        `  Unmatched: #${agent.agentId} (uri: ${agent.uri || "none"}) — add to SLUG_OVERRIDES if needed`
      );
    }
  }

  // Also preserve any existing registrations that weren't in the on-chain scan
  // (in case events were missed due to RPC limits)
  for (const [slug, info] of Object.entries(existingMap.registrations)) {
    if (!registrations[slug]) {
      registrations[slug] = info;
      console.log(`  Preserved: #${info.registryId} -> ${slug} (from previous sync)`);
    }
  }

  // Write updated map
  const updatedMap = {
    lastUpdated: new Date().toISOString(),
    contractAddress: REGISTRY_ADDRESS,
    chain: "base",
    chainId: CHAIN_ID,
    registrations,
  };

  fs.writeFileSync(REGISTRY_MAP_PATH, JSON.stringify(updatedMap, null, 2) + "\n");

  console.log(`\n=== Registry Sync Complete ===`);
  console.log(`Matched: ${matched}, Unmatched: ${unmatched}`);
  console.log(`Total registrations in map: ${Object.keys(registrations).length}`);
  console.log(`Written to: ${REGISTRY_MAP_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
