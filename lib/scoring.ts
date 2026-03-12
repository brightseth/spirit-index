/**
 * Auto-scoring formulas for tracked agents
 * Maps platform API data to Spirit Index 0-10 dimension scores
 */

import { DimensionScore } from './types';

// --- Persistence ---
// Based on months since inception
const PERSISTENCE_TIERS = [
  [96, 10], [60, 9], [36, 8], [24, 7], [18, 6],
  [12, 5], [9, 4], [6, 3], [3, 2], [0, 1],
] as const;

export function scorePersistence(inceptionDate: string): DimensionScore {
  const months = Math.floor(
    (Date.now() - new Date(inceptionDate).getTime()) / (30.44 * 24 * 60 * 60 * 1000)
  );
  const value = PERSISTENCE_TIERS.find(([threshold]) => months >= threshold)?.[1] ?? 1;
  return { value, confidence: "high", method: "auto" };
}

// --- Economic Reality ---
// Based on market cap (USD)
const ECONOMIC_TIERS = [
  [1_000_000_000, 10], [500_000_000, 9], [100_000_000, 8], [50_000_000, 7],
  [10_000_000, 6], [5_000_000, 5], [1_000_000, 4], [500_000, 3],
  [100_000, 2], [1, 1], [0, 0],
] as const;

export function scoreEconomicReality(marketCapUsd: number): DimensionScore {
  const value = ECONOMIC_TIERS.find(([threshold]) => marketCapUsd >= threshold)?.[1] ?? 0;
  return { value, confidence: "medium", method: "auto" };
}

// --- Economic Infrastructure ---
// Checklist-based
export interface InfraSignals {
  hasWallet: boolean;
  walletHasBalance: boolean;
  hasToken: boolean;
  tokenOnDex: boolean;
  multiChainPresence: boolean;
  onChainTreasury: boolean; // +2
  revenueRouting: boolean;  // +2
  stakingMechanism: boolean;
}

export function scoreEconomicInfrastructure(signals: InfraSignals): DimensionScore {
  let value = 0;
  if (signals.hasWallet) value += 1;
  if (signals.walletHasBalance) value += 1;
  if (signals.hasToken) value += 1;
  if (signals.tokenOnDex) value += 1;
  if (signals.multiChainPresence) value += 1;
  if (signals.onChainTreasury) value += 2;
  if (signals.revenueRouting) value += 2;
  if (signals.stakingMechanism) value += 1;
  return { value: Math.min(10, value), confidence: "low", method: "auto" };
}

// --- Identity Sovereignty ---
// Checklist-based, ERC-8004 = +3
export interface IdentitySignals {
  hasOwnDomain: boolean;     // +2
  erc8004Registered: boolean; // +3
  portableWallet: boolean;    // +1
  ensOrNaming: boolean;       // +1
  multiChainIdentity: boolean; // +1
  spiritIndexVerified: boolean; // +1
  aircOrCrossRegistry: boolean; // +1
}

export function scoreIdentitySovereignty(signals: IdentitySignals): DimensionScore {
  let value = 0;
  if (signals.hasOwnDomain) value += 2;
  if (signals.erc8004Registered) value += 3;
  if (signals.portableWallet) value += 1;
  if (signals.ensOrNaming) value += 1;
  if (signals.multiChainIdentity) value += 1;
  if (signals.spiritIndexVerified) value += 1;
  if (signals.aircOrCrossRegistry) value += 1;
  return { value: Math.min(10, value), confidence: "medium", method: "auto" };
}

// --- Autonomy ---
// Heuristic base + signals
export interface AutonomySignals {
  platformIsAgentic: boolean;  // base 5 if true
  autonomousSocialPosting: boolean; // +1
  onChainTransactions: boolean;     // +2
  requiresPromptToAct: boolean;     // caps at 3
}

export function scoreAutonomy(signals: AutonomySignals): DimensionScore {
  if (signals.requiresPromptToAct) {
    return { value: 3, confidence: "low", method: "auto" };
  }
  let value = signals.platformIsAgentic ? 5 : 2;
  if (signals.autonomousSocialPosting) value += 1;
  if (signals.onChainTransactions) value += 2;
  return { value: Math.min(10, value), confidence: "low", method: "auto" };
}

// --- Unscored dimension helper ---
export function unscoredDimension(): DimensionScore {
  return { value: null, confidence: "low", method: "unscored" };
}
