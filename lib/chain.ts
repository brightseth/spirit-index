/**
 * On-chain registration check via ERC-8004 registry on Base Sepolia.
 * Uses viem to call getAgent(string) on the Spirit Registry contract.
 */

import { createPublicClient, http, parseAbi } from "viem";
import { baseSepolia } from "viem/chains";

const REGISTRY_ADDRESS = "0x4a0e642e9aec25c5856987e95c0410ae10e8de5e" as const;

const registryAbi = parseAbi([
  "function getAgent(string spiritId) view returns (uint256 agentId, address trainer, address platform, address treasury, string metadataURI, uint256[4] split)",
]);

const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export interface RegistrationStatus {
  registered: boolean;
  agentId?: number;
  trainer?: string;
}

export async function checkRegistration(
  spiritId: string
): Promise<RegistrationStatus> {
  try {
    const result = await client.readContract({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: "getAgent",
      args: [spiritId],
    });

    const [agentId, trainer] = result;

    // agentId of 0 means not registered
    if (agentId === BigInt(0)) {
      return { registered: false };
    }

    return {
      registered: true,
      agentId: Number(agentId),
      trainer,
    };
  } catch {
    // Contract reverts if agent doesn't exist
    return { registered: false };
  }
}
