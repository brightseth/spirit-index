/**
 * On-chain registration check via ERC-8004 SpiritRegistry on Base Mainnet.
 *
 * The mainnet SpiritRegistry uses uint256 agentId (not string spiritId).
 * We maintain a mapping from Spirit Index slugs to on-chain agentIds
 * for agents that have been registered.
 */

import { createPublicClient, http, parseAbi } from "viem";
import { base } from "viem/chains";

/** SpiritRegistry on Base Mainnet — deployed Feb 3, 2026 */
export const REGISTRY_ADDRESS = "0xF2709ceF1Cf4893ed78D3220864428b32b12dFb9" as const;

/**
 * Mapping from Spirit Index slug → on-chain agentId.
 * Updated as agents are registered via registerSpirit().
 * Agents not in this map return { registered: false }.
 */
const KNOWN_AGENT_IDS: Record<string, number> = {
  // Populated after canonical agent registration
  // "abraham": 2,
  // "solienne": 3,
};

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
  // Look up known on-chain agentId for this slug
  const agentId = KNOWN_AGENT_IDS[spiritId];

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
