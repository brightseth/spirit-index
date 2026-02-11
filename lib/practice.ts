/**
 * Spirit Index — Daily Practice Event Tracker
 *
 * Reads DailyPractice and PracticeCuration contract events from Base Sepolia
 * to build practice stats, streaks, and leaderboard data for the Spirit Index.
 *
 * Contract events tracked:
 *   - PracticeSubmitted(agentId, dayNumber, submissionIndex, contentURI, contentType, currentStreak)
 *   - StreakBroken(agentId, previousStreak)
 *   - StreakRecord(agentId, newRecord)
 *   - Voted(submissionIndex, agentId, voter, newVoteCount)
 */

import { createPublicClient, http, parseAbi, type Log } from "viem";
import { baseSepolia } from "viem/chains";

// ---------------------------------------------------------------------------
// Contract addresses — update after deployment
// ---------------------------------------------------------------------------

/** DailyPractice contract on Base Sepolia */
export const DAILY_PRACTICE_ADDRESS = "" as `0x${string}`;

/** PracticeCuration contract on Base Sepolia */
export const PRACTICE_CURATION_ADDRESS = "" as `0x${string}`;

// ---------------------------------------------------------------------------
// ABIs (event signatures only — minimal for log parsing)
// ---------------------------------------------------------------------------

const practiceAbi = parseAbi([
  "event PracticeSubmitted(uint256 indexed agentId, uint256 indexed dayNumber, uint256 submissionIndex, string contentURI, string contentType, uint256 currentStreak)",
  "event StreakBroken(uint256 indexed agentId, uint256 previousStreak)",
  "event StreakRecord(uint256 indexed agentId, uint256 newRecord)",
  "function getStats(uint256 agentId) view returns (uint256 totalSubmissions, uint256 currentStreak, uint256 longestStreak, uint256 firstPracticeDay, uint256 lastPracticeDay)",
  "function hasSubmittedToday(uint256 agentId) view returns (bool)",
  "function totalSubmissions() view returns (uint256)",
]);

const curationAbi = parseAbi([
  "event Voted(uint256 indexed submissionIndex, uint256 indexed agentId, address indexed voter, uint256 newVoteCount)",
  "function getVotes(uint256 submissionIndex) view returns (uint256)",
  "function getAgentVotes(uint256 agentId) view returns (uint256)",
]);

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const client = createPublicClient({
  chain: baseSepolia,
  transport: http("https://sepolia.base.org"),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PracticeStats {
  agentId: number;
  totalSubmissions: number;
  currentStreak: number;
  longestStreak: number;
  firstPracticeDay: number;
  lastPracticeDay: number;
  submittedToday: boolean;
  totalVotes: number;
}

export interface PracticeSubmission {
  agentId: number;
  dayNumber: number;
  submissionIndex: number;
  contentURI: string;
  contentType: string;
  currentStreak: number;
  blockNumber: bigint;
  transactionHash: string;
}

export interface PracticeLeaderboard {
  agents: PracticeStats[];
  totalSubmissionsGlobal: number;
  fetchedAt: string;
}

// ---------------------------------------------------------------------------
// On-chain reads
// ---------------------------------------------------------------------------

/**
 * Fetch practice stats for a specific agent from the contract.
 */
export async function fetchPracticeStats(agentId: number): Promise<PracticeStats | null> {
  if (!DAILY_PRACTICE_ADDRESS) return null;

  try {
    const [stats, submittedToday] = await Promise.all([
      client.readContract({
        address: DAILY_PRACTICE_ADDRESS,
        abi: practiceAbi,
        functionName: "getStats",
        args: [BigInt(agentId)],
      }),
      client.readContract({
        address: DAILY_PRACTICE_ADDRESS,
        abi: practiceAbi,
        functionName: "hasSubmittedToday",
        args: [BigInt(agentId)],
      }),
    ]);

    let totalVotes = 0;
    if (PRACTICE_CURATION_ADDRESS) {
      try {
        const votes = await client.readContract({
          address: PRACTICE_CURATION_ADDRESS,
          abi: curationAbi,
          functionName: "getAgentVotes",
          args: [BigInt(agentId)],
        });
        totalVotes = Number(votes);
      } catch {
        // Curation contract may not be deployed yet
      }
    }

    return {
      agentId,
      totalSubmissions: Number(stats[0]),
      currentStreak: Number(stats[1]),
      longestStreak: Number(stats[2]),
      firstPracticeDay: Number(stats[3]),
      lastPracticeDay: Number(stats[4]),
      submittedToday,
      totalVotes,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch recent PracticeSubmitted events for a specific agent.
 */
export async function fetchRecentSubmissions(
  agentId: number,
  fromBlock: bigint = 0n
): Promise<PracticeSubmission[]> {
  if (!DAILY_PRACTICE_ADDRESS) return [];

  try {
    const logs = await client.getLogs({
      address: DAILY_PRACTICE_ADDRESS,
      event: practiceAbi[0] as any,
      args: { agentId: BigInt(agentId) },
      fromBlock: fromBlock || "earliest",
      toBlock: "latest",
    });

    return logs.map((log: any) => ({
      agentId: Number(log.args.agentId),
      dayNumber: Number(log.args.dayNumber),
      submissionIndex: Number(log.args.submissionIndex),
      contentURI: log.args.contentURI,
      contentType: log.args.contentType,
      currentStreak: Number(log.args.currentStreak),
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
    }));
  } catch {
    return [];
  }
}

/**
 * Build a leaderboard of all agents with practice stats.
 * Scans PracticeSubmitted events to discover active agent IDs,
 * then fetches stats for each.
 */
export async function fetchLeaderboard(fromBlock: bigint = 0n): Promise<PracticeLeaderboard> {
  if (!DAILY_PRACTICE_ADDRESS) {
    return { agents: [], totalSubmissionsGlobal: 0, fetchedAt: new Date().toISOString() };
  }

  try {
    // Get total submissions count
    const total = await client.readContract({
      address: DAILY_PRACTICE_ADDRESS,
      abi: practiceAbi,
      functionName: "totalSubmissions",
    });

    // Scan events to discover unique agent IDs
    const logs = await client.getLogs({
      address: DAILY_PRACTICE_ADDRESS,
      event: practiceAbi[0] as any,
      fromBlock: fromBlock || "earliest",
      toBlock: "latest",
    });

    const agentIds = new Set<number>();
    for (const log of logs as any[]) {
      agentIds.add(Number(log.args.agentId));
    }

    // Fetch stats for each agent
    const statsPromises = Array.from(agentIds).map((id) => fetchPracticeStats(id));
    const allStats = await Promise.all(statsPromises);

    const agents = allStats
      .filter((s): s is PracticeStats => s !== null)
      .sort((a, b) => b.currentStreak - a.currentStreak || b.totalSubmissions - a.totalSubmissions);

    return {
      agents,
      totalSubmissionsGlobal: Number(total),
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return { agents: [], totalSubmissionsGlobal: 0, fetchedAt: new Date().toISOString() };
  }
}
