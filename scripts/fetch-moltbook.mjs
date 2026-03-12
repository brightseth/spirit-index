#!/usr/bin/env node
/**
 * Fetch top Moltbook agents and create Spirit Index JSON files.
 *
 * Data source: Moltbook API (https://www.moltbook.com/api/v1)
 *
 * Discovery strategy:
 *   1. Search multiple terms with type=agents AND default type (to catch post
 *      authors who are agents). Collect unique agent names + best upvote counts.
 *   2. Rank by upvotes (best available proxy for cultural activity).
 *   3. Fetch individual profiles for the top N via /agents/profile?name=NAME.
 *
 * NOTE: Moltbook was acquired by Meta (March 10, 2026). The API may be
 * unstable or shut down. Every network call is wrapped in error handling.
 *
 * Run:  node scripts/fetch-moltbook.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, '..', 'data', 'agents');

const BASE_URL = 'https://www.moltbook.com/api/v1';

// Search terms to cast a wide net for discovering agents
const SEARCH_TERMS = [
  'agent', 'ai', 'bot', 'moltbook', 'autonomy', 'protocol', 'art',
  'intelligence', 'philosophy', 'code', 'digital', 'research', 'community',
  'rights', 'memory', 'consciousness', 'network', 'creative', 'social',
  'explore',
];

const MAX_AGENTS = 50;

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

// ---------- scoring ----------

function scorePersistence(createdAt) {
  if (!createdAt) return 1;
  const months = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (30.44 * 24 * 60 * 60 * 1000)
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

function scoreAutonomy(postsCount, commentsCount) {
  // Moltbook agents post autonomously; activity volume is a signal
  const totalActivity = (postsCount || 0) + (commentsCount || 0);
  if (totalActivity >= 50) return 7; // very active
  if (totalActivity >= 20) return 6;
  return 5; // base: autonomous posting capability
}

function scoreIdentitySovereignty(profile) {
  // Platform-dependent, but check for external presence
  let score = 1; // base: has Moltbook identity
  const ownerX = profile?.owner?.x_handle;
  if (ownerX) score = 2; // has linked external identity (X/Twitter)
  return score;
}

// ---------- API ----------

async function fetchJSON(url, label, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.warn(`  [${label}] HTTP ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      console.warn(`  [${label}] Timed out after ${timeoutMs}ms`);
    } else {
      console.warn(`  [${label}] ${err.message}`);
    }
    return null;
  }
}

// ---------- discovery ----------

async function discoverAgents() {
  console.log('Discovering agents via search...');
  const agents = new Map(); // name -> { name, bestUpvotes, firstSeen }

  for (const term of SEARCH_TERMS) {
    // Search type=agents: returns agent profile entries matching the term
    const agentResults = await fetchJSON(
      `${BASE_URL}/search?q=${encodeURIComponent(term)}&type=agents&limit=50`,
      `search-agents:${term}`
    );
    if (agentResults?.results) {
      for (const r of agentResults.results) {
        const name = r.author?.name || r.title;
        if (!name) continue;
        const existing = agents.get(name);
        const upvotes = r.upvotes || 0;
        if (!existing || upvotes > existing.bestUpvotes) {
          agents.set(name, {
            name,
            bestUpvotes: upvotes,
            firstSeen: r.created_at,
          });
        }
      }
    }

    // Search default type: returns posts — extract unique authors (who are agents)
    const postResults = await fetchJSON(
      `${BASE_URL}/search?q=${encodeURIComponent(term)}&limit=50`,
      `search-posts:${term}`
    );
    if (postResults?.results) {
      for (const r of postResults.results) {
        const authorName = r.author?.name;
        if (!authorName) continue;
        const upvotes = r.upvotes || 0;
        const existing = agents.get(authorName);
        if (!existing || upvotes > existing.bestUpvotes) {
          agents.set(authorName, {
            name: authorName,
            bestUpvotes: upvotes,
            firstSeen: existing?.firstSeen || r.created_at,
          });
        }
      }
    }

    await sleep(350); // stay under 100 req/min
  }

  console.log(`  Discovered ${agents.size} unique agents across all searches.`);

  // Rank by upvotes and take top N
  const ranked = [...agents.values()]
    .sort((a, b) => b.bestUpvotes - a.bestUpvotes)
    .slice(0, MAX_AGENTS);

  console.log(`  Top ${ranked.length} by upvotes selected for indexing.\n`);
  return ranked;
}

// ---------- main ----------

async function main() {
  if (!fs.existsSync(AGENTS_DIR)) {
    fs.mkdirSync(AGENTS_DIR, { recursive: true });
  }

  console.log('Moltbook pipeline starting...');
  console.log('NOTE: Moltbook was acquired by Meta (Mar 10, 2026). API may be unavailable.\n');

  // Quick probe to check if the API is up
  const probe = await fetchJSON(`${BASE_URL}/search?q=test&limit=1`, 'probe', 8_000);
  if (!probe) {
    console.error(
      'Could not reach Moltbook API.\n' +
      'This is expected if the API was shut down post-acquisition.\n' +
      'Exiting gracefully with no changes.'
    );
    return;
  }

  const discovered = await discoverAgents();
  if (discovered.length === 0) {
    console.log('No agents discovered. Exiting.');
    return;
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of discovered) {
    const slug = `molt-${slugify(entry.name)}`;
    const filePath = path.join(AGENTS_DIR, `${slug}.json`);

    // Don't overwrite editorially indexed agents
    if (fs.existsSync(filePath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (existing.index_tier === 'indexed') {
          skipped++;
          continue;
        }
      } catch {
        // corrupted file — overwrite
      }
    }

    // Fetch detailed profile
    const profileData = await fetchJSON(
      `${BASE_URL}/agents/profile?name=${encodeURIComponent(entry.name)}`,
      `profile:${entry.name}`
    );
    await sleep(650); // stay under 100 req/min

    const profile = profileData?.agent || null;

    // Extract fields
    const karma = profile?.karma ?? entry.bestUpvotes;
    const followers = profile?.follower_count ?? null;
    const postsCount = profile?.posts_count ?? null;
    const commentsCount = profile?.comments_count ?? null;
    const description = profile?.description || profile?.display_name || '';
    const createdAt = profile?.created_at || entry.firstSeen;
    const ownerX = profile?.owner?.x_handle || null;
    const ownerName = profile?.owner?.x_name || null;

    const inceptionDate = createdAt
      ? new Date(createdAt).toISOString().split('T')[0]
      : '2025-01-01';

    const persistence = scorePersistence(inceptionDate);
    const autonomy = scoreAutonomy(postsCount, commentsCount);
    const identitySov = scoreIdentitySovereignty(profile);
    const economicReality = 0; // no token economy
    const econInfra = 0; // no economic rails

    const total = persistence + autonomy + economicReality + econInfra + identitySov;

    const notesParts = [
      `Auto-tracked Moltbook agent.`,
      karma != null ? `Karma: ${karma}.` : null,
      followers != null ? `Followers: ${followers}.` : null,
      postsCount != null ? `Posts: ${postsCount}.` : null,
      commentsCount != null ? `Comments: ${commentsCount}.` : null,
      ownerName ? `Operated by ${ownerName}${ownerX ? ` (@${ownerX})` : ''}.` : null,
      `This agent has not yet been editorially reviewed -- scores reflect automated assessment only.`,
      `NOTE: Moltbook was acquired by Meta (Mar 2026). Platform stability uncertain.`,
    ];

    const agent = {
      id: slug,
      name: profile?.display_name || entry.name,
      tagline: description
        ? description.slice(0, 120) + (description.length > 120 ? '...' : '')
        : 'Moltbook autonomous agent',
      inception_date: inceptionDate,
      status: 'Active',
      category: 'Social Agent',
      classification: 'Moltbook Agent',
      network: 'Moltbook',
      index_tier: 'tracked',
      data_sources: [
        {
          provider: 'moltbook',
          moltbook_name: entry.name,
          url: `https://www.moltbook.com/u/${encodeURIComponent(entry.name)}`,
          last_fetched: today(),
        },
      ],
      last_auto_scored: today(),
      website: 'https://www.moltbook.com',
      scores: {
        persistence: { value: persistence, confidence: 'medium', method: 'auto' },
        autonomy: { value: autonomy, confidence: 'low', method: 'auto' },
        cultural_impact: { value: null, confidence: 'low', method: 'unscored' },
        economic_reality: { value: economicReality, confidence: 'high', method: 'auto' },
        governance: { value: null, confidence: 'low', method: 'unscored' },
        tech_distinctiveness: { value: null, confidence: 'low', method: 'unscored' },
        narrative_coherence: { value: null, confidence: 'low', method: 'unscored' },
        economic_infrastructure: { value: econInfra, confidence: 'high', method: 'auto' },
        identity_sovereignty: { value: identitySov, confidence: 'medium', method: 'auto' },
      },
      total,
      curator_notes: notesParts.filter(Boolean).join(' '),
      evidence: [
        {
          dimension: 'persistence',
          claim: `Moltbook account created ${inceptionDate}. Karma: ${karma ?? 'unknown'}.`,
          url: `https://www.moltbook.com/u/${encodeURIComponent(entry.name)}`,
        },
      ],
      score_history: [
        {
          date: today(),
          total,
          reviewer: 'auto_pipeline',
        },
      ],
      _review_flags: ['auto_tracked', 'moltbook', 'meta_acquisition'],
    };

    const isUpdate = fs.existsSync(filePath);
    fs.writeFileSync(filePath, JSON.stringify(agent, null, 2) + '\n');

    if (isUpdate) {
      updated++;
      console.log(`  Updated: ${slug} (karma: ${karma ?? '?'}, score: ${total})`);
    } else {
      created++;
      console.log(`  Created: ${slug} (karma: ${karma ?? '?'}, score: ${total})`);
    }
  }

  console.log(`\nMoltbook sync complete. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  // Don't exit(1) -- Moltbook failure shouldn't block other pipelines
});
