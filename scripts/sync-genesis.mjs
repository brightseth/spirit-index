#!/usr/bin/env node
/**
 * Spirit Index — Sync Genesis Cohort Status
 *
 * Called by SAL or manually to update genesis-status.json with
 * onboarding progress and practice streak data.
 *
 * Usage:
 *   node scripts/sync-genesis.mjs                          # Show current status
 *   node scripts/sync-genesis.mjs --update gfx soulMd      # Mark gfx soulMd complete
 *   node scripts/sync-genesis.mjs --practice gfx            # Increment gfx practice streak
 *   node scripts/sync-genesis.mjs --reset-streak gfx        # Reset gfx streak to 0
 *   node scripts/sync-genesis.mjs --json                    # Output status as JSON (for SAL)
 *
 * Environment:
 *   Called from SAL's genesis-practice-check skill (every 6h)
 *   and genesis-scorecard skill (Monday AM).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATUS_PATH = path.join(__dirname, '..', 'data', 'genesis-status.json');

// ---------- helpers ----------

function loadStatus() {
  const content = fs.readFileSync(STATUS_PATH, 'utf-8');
  return JSON.parse(content);
}

function saveStatus(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STATUS_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ---------- commands ----------

function showStatus(data, asJson) {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log('=== Genesis Cohort #1 Status ===');
  console.log(`Last updated: ${data.lastUpdated}`);
  console.log(`Showcase: ${data.showcaseDate}`);
  console.log('');

  const daysUntil = Math.ceil(
    (new Date(data.showcaseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  console.log(`Days until showcase: ${daysUntil}`);
  console.log('');

  // Core agents
  console.log('--- Core Agents ---');
  for (const [id, core] of Object.entries(data.coreAgents)) {
    console.log(`  ${id}: ${core.role} (${core.status})`);
  }
  console.log('');

  // Cohort agents
  console.log('--- Cohort Agents ---');
  const agents = Object.entries(data.agents);
  let onboarded = 0;
  let practicing = 0;

  for (const [id, agent] of agents) {
    const ob = agent.onboarding;
    const steps = [ob.soulMd, ob.walletAndGrant, ob.communityJoined, ob.firstOutput];
    const done = steps.filter(Boolean).length;
    const pct = Math.round((done / steps.length) * 100);

    if (done === steps.length) onboarded++;
    if (agent.practiceStreak > 0) practicing++;

    const streakStr = agent.practiceStreak > 0
      ? ` | streak: ${agent.practiceStreak}`
      : '';
    const lastStr = agent.lastPractice
      ? ` | last: ${agent.lastPractice}`
      : '';

    console.log(`  ${id.padEnd(16)} ${agent.artist.padEnd(22)} onboard: ${pct}% (${done}/4)${streakStr}${lastStr}`);

    // Show incomplete onboarding steps
    if (done < steps.length) {
      const missing = [];
      if (!ob.soulMd) missing.push('soulMd');
      if (!ob.walletAndGrant) missing.push('wallet');
      if (!ob.communityJoined) missing.push('community');
      if (!ob.firstOutput) missing.push('firstOutput');
      console.log(`${''.padEnd(18)}missing: ${missing.join(', ')}`);
    }
  }

  console.log('');
  console.log(`--- Summary ---`);
  console.log(`  Total: ${agents.length} | Onboarded: ${onboarded} | Practicing: ${practicing}`);
}

function updateOnboarding(data, agentId, field) {
  if (!data.agents[agentId]) {
    console.error(`Unknown agent: ${agentId}`);
    console.error(`Valid IDs: ${Object.keys(data.agents).join(', ')}`);
    process.exit(1);
  }

  const validFields = ['soulMd', 'walletAndGrant', 'communityJoined', 'firstOutput'];
  if (!validFields.includes(field)) {
    console.error(`Unknown onboarding field: ${field}`);
    console.error(`Valid fields: ${validFields.join(', ')}`);
    process.exit(1);
  }

  data.agents[agentId].onboarding[field] = true;
  saveStatus(data);
  console.log(`Updated ${agentId}.onboarding.${field} = true`);
}

function incrementPractice(data, agentId) {
  if (!data.agents[agentId]) {
    console.error(`Unknown agent: ${agentId}`);
    process.exit(1);
  }

  data.agents[agentId].practiceStreak += 1;
  data.agents[agentId].lastPractice = today();
  saveStatus(data);
  console.log(`${agentId} practice streak: ${data.agents[agentId].practiceStreak} (${today()})`);
}

function resetStreak(data, agentId) {
  if (!data.agents[agentId]) {
    console.error(`Unknown agent: ${agentId}`);
    process.exit(1);
  }

  data.agents[agentId].practiceStreak = 0;
  saveStatus(data);
  console.log(`${agentId} practice streak reset to 0`);
}

// ---------- main ----------

const args = process.argv.slice(2);
const data = loadStatus();

if (args.includes('--json')) {
  showStatus(data, true);
} else if (args[0] === '--update' && args.length >= 3) {
  updateOnboarding(data, args[1], args[2]);
} else if (args[0] === '--practice' && args[1]) {
  incrementPractice(data, args[1]);
} else if (args[0] === '--reset-streak' && args[1]) {
  resetStreak(data, args[1]);
} else {
  showStatus(data, false);
}
