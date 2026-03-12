/**
 * On-chain registration check via ERC-8004 SpiritRegistry on Base Mainnet.
 *
 * The mainnet SpiritRegistry uses uint256 agentId (not string spiritId).
 * Agent ID mappings are loaded from data/registry-map.json (maintained by
 * scripts/sync-registry.mjs) instead of a hardcoded constant.
 */

import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";
import { getRegistryId } from "./registry";

/** SpiritRegistry on Base Mainnet — deployed Feb 3, 2026 */
export const REGISTRY_ADDRESS = "0xF2709ceF1Cf4893ed78D3220864428b32b12dFb9" as const;

const registryAbi = parseAbi([
  "function exists(uint256 agentId) view returns (bool)",
  "function getSpiritConfig(uint256 agentId) view returns (address treasury, address childToken, address stakingPool, address lpPosition, address artist, address platform, uint256 createdAt, bool hasToken)",
  "function ownerOf(uint256 agentId) view returns (address)",
  "function agentURI(uint256 agentId) view returns (string)",
]);

const client = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export interface RegistrationStatus {
  registered: boolean;
  agentId?: number;
  artist?: string;
}

export async function checkRegistration(
  spiritId: string
): Promise<RegistrationStatus> {
  // Look up on-chain agentId from registry map (replaces hardcoded KNOWN_AGENT_IDS)
  const agentId = getRegistryId(spiritId);

  if (agentId === undefined) {
    return { registered: false };
  }

  try {
    const agentExists = await client.readContract({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: "exists",
      args: [BigInt(agentId)],
    });

    if (!agentExists) {
      return { registered: false };
    }

    const owner = await client.readContract({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: "ownerOf",
      args: [BigInt(agentId)],
    });

    return {
      registered: true,
      agentId,
      artist: owner,
    };
  } catch {
    // Contract reverts or RPC error — fall back to unregistered
    return { registered: false };
  }
}
