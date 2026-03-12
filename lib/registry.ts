/**
 * Spirit Registry — Dynamic ERC-8004 registration lookup
 *
 * Loads data/registry-map.json at build time to provide fast, synchronous
 * checks for on-chain registration status. The map is updated by
 * scripts/sync-registry.mjs which reads SpiritRegistered events from Base.
 *
 * Used by:
 *   - lib/chain.ts (replaces hardcoded KNOWN_AGENT_IDS)
 *   - lib/scoring.ts (identity_sovereignty +3 for ERC-8004)
 *   - app/[id]/page.tsx (registration badge)
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RegistrationInfo {
  registryId: number;
  wallet: string;
  registeredAt: string;
}

export interface RegistryMap {
  lastUpdated: string;
  contractAddress: string;
  chain: string;
  chainId: number;
  registrations: Record<string, RegistrationInfo>;
}

// ---------------------------------------------------------------------------
// Load registry map (once at module init / build time)
// ---------------------------------------------------------------------------

const REGISTRY_MAP_PATH = path.join(process.cwd(), "data", "registry-map.json");

let _registryMap: RegistryMap | null = null;

function loadRegistryMap(): RegistryMap {
  if (_registryMap) return _registryMap;

  try {
    const raw = fs.readFileSync(REGISTRY_MAP_PATH, "utf-8");
    _registryMap = JSON.parse(raw) as RegistryMap;
  } catch {
    // If the file doesn't exist or is malformed, return an empty map
    _registryMap = {
      lastUpdated: "",
      contractAddress: "",
      chain: "base",
      chainId: 8453,
      registrations: {},
    };
  }

  return _registryMap;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Check if an agent (by Spirit Index slug) is registered on ERC-8004.
 */
export function isRegistered(agentId: string): boolean {
  const map = loadRegistryMap();
  return agentId in map.registrations;
}

/**
 * Get full registration info for an agent, or null if not registered.
 */
export function getRegistration(agentId: string): RegistrationInfo | null {
  const map = loadRegistryMap();
  return map.registrations[agentId] ?? null;
}

/**
 * Get the on-chain registry ID for a Spirit Index slug, or undefined.
 * Drop-in replacement for the old KNOWN_AGENT_IDS lookup.
 */
export function getRegistryId(agentId: string): number | undefined {
  const reg = getRegistration(agentId);
  return reg?.registryId;
}

/**
 * Get all registered agent IDs (Spirit Index slugs).
 */
export function getAllRegistered(): string[] {
  const map = loadRegistryMap();
  return Object.keys(map.registrations);
}

/**
 * Get the full registry map (for sync scripts and debugging).
 */
export function getRegistryMap(): RegistryMap {
  return loadRegistryMap();
}

/**
 * Get the contract address from the registry map.
 */
export function getContractAddress(): string {
  const map = loadRegistryMap();
  return map.contractAddress;
}
