#!/usr/bin/env node
/**
 * Fetch top Virtuals Protocol agents and create Spirit Index JSON files.
 *
 * Data sources:
 *   - CoinGecko  (market cap, volume, price — free tier, no key)
 *   - DexScreener (liquidity, pair data, creation date — free, 300 req/min)
 *
 * Run:  node scripts/fetch-virtuals.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, '..', 'data', 'agents');

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const DEXSCREENER_SEARCH_URL = 'https://api.dexscreener.com/latest/dex/search';

// CoinGecko IDs of agents already editorially indexed — never create virt- duplicates
const INDEXED_COINGECKO_IDS = new Set([
  'aixbt',                // -> data/agents/aixbt.json
  'luna-by-virtuals',     // -> data/agents/luna-virtuals.json
  'vaderai-by-virtuals',  // -> data/agents/vaderai.json
]);

// Market cap floor for inclusion
const MIN_MCAP = 100_000;
const MAX_AGENTS = 60;

// ---------- helpers ----------

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------- scoring (mirrors lib/scoring.ts — simplified auto-only) ----------

function scorePersistence(inceptionDate) {
  const months = Math.floor(
    (Date.now() - new Date(inceptionDate).getTime()) / (30.44 * 24 * 60 * 60 * 1000)
  );
  const tiers = [
    [96, 10], [60, 9], [36, 8], [24, 7], [18, 6],
    [12, 5], [9, 4], [6, 3], [3, 2], [0, 1],
  ];
  for (const [threshold, score] of tiers) {
    if (months >= threshold) return score;
  }
  return 1;
}

function scoreEconomicReality(mcap) {
  const tiers = [
    [1e9, 10], [5e8, 9], [1e8, 8], [5e7, 7], [1e7, 6],
    [5e6, 5], [1e6, 4], [5e5, 3], [1e5, 2], [1, 1], [0, 0],
  ];
  for (const [threshold, score] of tiers) {
    if (mcap >= threshold) return score;
  }
  return 0;
}

function scoreEconInfra(mcap) {
  // has token + on DEX + has wallet + wallet has balance + liquidity check
  let v = 4; // token, dex, wallet, balance
  if (mcap > 1e6) v += 1; // significant liquidity
  // No on-chain treasury or revenue routing for most Virtuals agents
  return Math.min(10, v);
}

function scoreIdentitySovereignty() {
  // Platform-dependent, no own domain, no ERC-8004, no portable identity
  return 1;
}

function scoreAutonomy() {
  // Virtuals agents are platform-agentic with autonomous social posting
  return 6;
}

// ---------- API fetchers ----------

async function fetchWithRetry(url, label, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
      });
      if (res.status === 429 || res.status === 403) {
        const wait = attempt === 0 ? 30_000 : 65_000;
        console.warn(`  [${label}] Rate limited (${res.status}). Waiting ${wait / 1000}s...`);
        await sleep(wait);
        continue;
      }
      if (!res.ok) {
        console.error(`  [${label}] HTTP ${res.status} ${res.statusText}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error(`  [${label}] Fetch error: ${err.message}`);
      if (attempt < retries) await sleep(5_000);
    }
  }
  return null;
}

async function fetchCoinGeckoVirtuals() {
  console.log('Fetching Virtuals ecosystem from CoinGecko...');
  const url = `${COINGECKO_URL}?vs_currency=usd&category=virtuals-protocol-ecosystem&order=market_cap_desc&per_page=100&page=1`;
  const data = await fetchWithRetry(url, 'CoinGecko');
  if (!data || !Array.isArray(data)) {
    console.error('CoinGecko returned no usable data.');
    return [];
  }
  console.log(`  Found ${data.length} tokens in Virtuals ecosystem.`);
  return data;
}

async function fetchDexScreenerCreationDate(tokenName) {
  // Try to find the token on DexScreener to get pair creation date
  const url = `${DEXSCREENER_SEARCH_URL}?q=${encodeURIComponent(tokenName)}`;
  const data = await fetchWithRetry(url, `DexScreener:${tokenName}`, 1);
  if (!data || !data.pairs || data.pairs.length === 0) return null;

  // Find a Base pair (Virtuals is on Base)
  const basePair = data.pairs.find((p) => p.chainId === 'base');
  if (basePair && basePair.pairCreatedAt) {
    return new Date(basePair.pairCreatedAt).toISOString().split('T')[0];
  }
  // Fallback: any pair
  if (data.pairs[0].pairCreatedAt) {
    return new Date(data.pairs[0].pairCreatedAt).toISOString().split('T')[0];
  }
  return null;
}

// ---------- main ----------

async function main() {
  // Ensure output dir exists
  if (!fs.existsSync(AGENTS_DIR)) {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
  }

  const tokens = await fetchCoinGeckoVirtuals();
  if (tokens.length === 0) {
    console.log('No tokens fetched. Exiting.');
    process.exit(1);
  }

  // Filter: market cap > threshold, not already editorially indexed
  const filtered = tokens.filter((t) => {
    if (t.market_cap < MIN_MCAP) return false;
    if (INDEXED_COINGECKO_IDS.has(t.id)) {
      console.log(`  Skipping ${t.id} (editorially indexed)`);
      return false;
    }
    return true;
  });

  console.log(
    `${filtered.length} tokens pass threshold (mcap > $${(MIN_MCAP / 1000).toFixed(0)}K, not already indexed)`
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const token of filtered.slice(0, MAX_AGENTS)) {
    const slug = `virt-${slugify(token.name)}`;
    const filePath = path.join(AGENTS_DIR, `${slug}.json`);

    // Don't overwrite files that were promoted to "indexed"
    if (fs.existsSync(filePath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (existing.index_tier === 'indexed') {
          skipped++;
          continue;
        }
      } catch {
        // corrupted file — overwrite it
      }
    }

    // Try to get creation date from DexScreener (rate-friendly: small delay)
    let inceptionDate = '2024-11-01'; // default for Virtuals agents
    const dexDate = await fetchDexScreenerCreationDate(token.symbol);
    if (dexDate) {
      inceptionDate = dexDate;
    }
    // Tiny pause to stay well under DexScreener rate limit
    await sleep(250);

    const persistence = scorePersistence(inceptionDate);
    const autonomy = scoreAutonomy();
    const economicReality = scoreEconomicReality(token.market_cap);
    const econInfra = scoreEconInfra(token.market_cap);
    const identitySov = scoreIdentitySovereignty();

    const scoredDims = { persistence, autonomy, economicReality, econInfra, identitySov };
    const total = Object.values(scoredDims).reduce((a, b) => a + b, 0);

    const agent = {
      id: slug,
      name: token.name,
      tagline: `Virtuals Protocol agent -- ${token.symbol.toUpperCase()}`,
      inception_date: inceptionDate,
      status: 'Active',
      category: 'Token Agent',
      classification: 'Virtuals Protocol Agent',
      network: 'Virtuals Protocol',
      index_tier: 'tracked',
      data_sources: [
        {
          provider: 'coingecko',
          coingecko_id: token.id,
          url: `https://www.coingecko.com/en/coins/${token.id}`,
          last_fetched: today(),
        },
      ],
      last_auto_scored: today(),
      website: 'https://app.virtuals.io',
      scores: {
        persistence: { value: persistence, confidence: 'high', method: 'auto' },
        autonomy: { value: autonomy, confidence: 'low', method: 'auto' },
        cultural_impact: { value: null, confidence: 'low', method: 'unscored' },
        economic_reality: { value: economicReality, confidence: 'medium', method: 'auto' },
        governance: { value: null, confidence: 'low', method: 'unscored' },
        tech_distinctiveness: { value: null, confidence: 'low', method: 'unscored' },
        narrative_coherence: { value: null, confidence: 'low', method: 'unscored' },
        economic_infrastructure: { value: econInfra, confidence: 'low', method: 'auto' },
        identity_sovereignty: { value: identitySov, confidence: 'medium', method: 'auto' },
      },
      total,
      curator_notes: `Auto-tracked Virtuals Protocol agent. ${token.name} (${token.symbol.toUpperCase()}) has a market cap of $${(token.market_cap / 1e6).toFixed(1)}M. This agent has not yet been editorially reviewed -- scores reflect automated assessment of on-chain and market data only.`,
      evidence: [
        {
          dimension: 'economic_reality',
          claim: `Market cap: $${(token.market_cap / 1e6).toFixed(1)}M, 24h volume: $${(token.total_volume / 1e6).toFixed(1)}M`,
          url: `https://www.coingecko.com/en/coins/${token.id}`,
        },
      ],
      score_history: [
        {
          date: today(),
          total,
          reviewer: 'auto_pipeline',
        },
      ],
      _review_flags: ['auto_tracked', 'virtuals_protocol'],
    };

    const isUpdate = fs.existsSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(agent, null, 2) + '\n');

    if (isUpdate) {
      updated++;
      console.log(`  Updated: ${slug} (mcap: $${(token.market_cap / 1e6).toFixed(1)}M, score: ${total})`);
    } else {
      created++;
      console.log(`  Created: ${slug} (mcap: $${(token.market_cap / 1e6).toFixed(1)}M, score: ${total})`);
    }
  }

  console.log(`\nVirtuals sync complete. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
