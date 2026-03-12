#!/usr/bin/env node
/**
 * Spirit Index — Sync All Pipelines
 *
 * Runs each data pipeline in sequence. Failures in one pipeline
 * do not block the others.
 *
 * Exit codes:
 *   0 — all pipelines succeeded
 *   1 — all pipelines failed
 *   2 — partial failure (some succeeded, some failed)
 *
 * Run:  node scripts/sync-all.mjs
 */

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pipelines = [
  { name: 'ERC-8004 Registry', script: 'sync-registry.mjs' },
  { name: 'Virtuals Protocol', script: 'fetch-virtuals.mjs' },
  { name: 'Moltbook', script: 'fetch-moltbook.mjs' },
];

const startTime = Date.now();
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

function elapsed() {
  return `${((Date.now() - startTime) / 1000).toFixed(1)}s`;
}

console.log('=== Spirit Index Sync ===');
console.log(`Date:      ${new Date().toISOString()}`);
console.log(`Pipelines: ${pipelines.length}`);
console.log(`CI:        ${isCI}`);
console.log('');

const results = [];
let successes = 0;
let failures = 0;

for (let i = 0; i < pipelines.length; i++) {
  const { name, script } = pipelines[i];
  const scriptPath = path.join(__dirname, script);
  const stepStart = Date.now();

  // GitHub Actions collapsible group
  if (isCI) console.log(`::group::Pipeline ${i + 1}/${pipelines.length}: ${name}`);
  console.log(`--- Step ${i + 1}/${pipelines.length}: ${name} ---`);

  try {
    execFileSync('node', [scriptPath], {
      stdio: 'inherit',
      timeout: 5 * 60 * 1000, // 5 minutes per pipeline
    });
    const duration = ((Date.now() - stepStart) / 1000).toFixed(1);
    successes++;
    results.push({ name, status: 'OK', duration: `${duration}s` });
    console.log(`--- ${name}: OK (${duration}s) ---\n`);
  } catch (err) {
    const duration = ((Date.now() - stepStart) / 1000).toFixed(1);
    failures++;
    results.push({ name, status: 'FAILED', duration: `${duration}s`, error: err.message });
    console.error(`--- ${name}: FAILED (${duration}s) ---`);
    console.error(`  ${err.message}\n`);
    if (isCI) {
      console.log(`::warning::Pipeline "${name}" failed: ${err.message}`);
    }
  }

  if (isCI) console.log('::endgroup::');
}

// ---------- summary ----------

console.log('=== Sync Complete ===');
console.log(`Total time: ${elapsed()}`);
console.log(`Succeeded:  ${successes}/${pipelines.length}`);
console.log(`Failed:     ${failures}/${pipelines.length}`);
console.log('');

console.log('Pipeline results:');
for (const r of results) {
  const icon = r.status === 'OK' ? '+' : '-';
  console.log(`  [${icon}] ${r.name}: ${r.status} (${r.duration})`);
}
console.log('');

if (failures === pipelines.length) {
  // All pipelines failed — hard failure
  console.error('All pipelines failed. Exiting with code 1.');
  process.exit(1);
} else if (failures > 0) {
  // Partial failure — warn but don't block commit of successful data
  console.warn(`Partial failure (${failures}/${pipelines.length}). Exiting with code 0 to allow commit of successful data.`);
  process.exit(0);
}
