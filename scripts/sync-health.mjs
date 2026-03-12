#!/usr/bin/env node
/**
 * Spirit Index — Sync Health Check
 *
 * Validates that agent JSON files in data/agents/ are well-formed
 * and contain the expected fields. Designed to run after sync-all.mjs
 * in CI to catch data corruption before pushing.
 *
 * Exit codes:
 *   0 — all checks pass
 *   1 — one or more checks failed
 *
 * Run:  node scripts/sync-health.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, '..', 'data', 'agents');

// Required top-level fields for every agent file
const REQUIRED_FIELDS = ['id', 'name', 'status', 'scores', 'total', 'index_tier'];

// Required score dimensions (value can be null, but key must exist)
const REQUIRED_SCORE_KEYS = [
  'persistence',
  'autonomy',
  'cultural_impact',
  'economic_reality',
  'governance',
  'tech_distinctiveness',
  'narrative_coherence',
  'economic_infrastructure',
  'identity_sovereignty',
];

// Valid values for certain fields
const VALID_INDEX_TIERS = new Set(['indexed', 'tracked', 'watchlist', 'delisted']);
const VALID_STATUSES = new Set([
  'Active', 'Inactive', 'Dormant', 'Defunct', 'Unknown',
  'Archived', 'Subsumed', 'Deceased',
]);

let totalFiles = 0;
let validFiles = 0;
let errors = [];
let warnings = [];

function addError(file, msg) {
  errors.push(`ERROR [${file}]: ${msg}`);
}

function addWarning(file, msg) {
  warnings.push(`WARN  [${file}]: ${msg}`);
}

// ---------- main ----------

console.log('=== Spirit Index Health Check ===\n');

if (!fs.existsSync(AGENTS_DIR)) {
  console.error(`Agent directory not found: ${AGENTS_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(AGENTS_DIR).filter((f) => f.endsWith('.json'));
totalFiles = files.length;

if (totalFiles === 0) {
  console.error('No agent JSON files found. This is likely a problem.');
  process.exit(1);
}

console.log(`Found ${totalFiles} agent files.\n`);

for (const file of files) {
  const filePath = path.join(AGENTS_DIR, file);
  let data;

  // 1. Parse JSON
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch (err) {
    addError(file, `Invalid JSON: ${err.message}`);
    continue;
  }

  // 2. Check required top-level fields
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined) {
      addError(file, `Missing required field: ${field}`);
    }
  }

  // 3. Validate id matches filename
  const expectedId = file.replace('.json', '');
  if (data.id && data.id !== expectedId) {
    addWarning(file, `id "${data.id}" does not match filename "${expectedId}"`);
  }

  // 4. Validate index_tier
  if (data.index_tier && !VALID_INDEX_TIERS.has(data.index_tier)) {
    addError(file, `Invalid index_tier: "${data.index_tier}"`);
  }

  // 5. Validate status
  if (data.status && !VALID_STATUSES.has(data.status)) {
    addWarning(file, `Unusual status: "${data.status}"`);
  }

  // 6. Check scores structure
  if (data.scores && typeof data.scores === 'object') {
    for (const key of REQUIRED_SCORE_KEYS) {
      if (data.scores[key] === undefined) {
        addError(file, `Missing score dimension: ${key}`);
      } else if (data.scores[key] !== null && typeof data.scores[key] === 'object') {
        // Score entry should have value, confidence, method
        if (data.scores[key].value === undefined) {
          addWarning(file, `Score "${key}" missing "value" field`);
        }
      }
    }
  }

  // 7. Validate total is a number
  if (data.total !== undefined && typeof data.total !== 'number') {
    addError(file, `"total" should be a number, got ${typeof data.total}`);
  }

  // 8. Check total is non-negative
  if (typeof data.total === 'number' && data.total < 0) {
    addError(file, `"total" is negative: ${data.total}`);
  }

  // 9. Name should be non-empty string
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim() === '')) {
    addError(file, `"name" should be a non-empty string`);
  }

  // 10. inception_date format check (if present)
  if (data.inception_date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.inception_date)) {
      addWarning(file, `inception_date "${data.inception_date}" is not YYYY-MM-DD format`);
    }
  }

  validFiles++;
}

// ---------- report ----------

console.log('--- Results ---\n');

if (warnings.length > 0) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) {
    console.log(`  ${w}`);
  }
  console.log('');
}

if (errors.length > 0) {
  console.log(`Errors (${errors.length}):`);
  for (const e of errors) {
    console.log(`  ${e}`);
  }
  console.log('');
}

console.log(`Files checked: ${totalFiles}`);
console.log(`Valid JSON:    ${validFiles}/${totalFiles}`);
console.log(`Errors:        ${errors.length}`);
console.log(`Warnings:      ${warnings.length}`);
console.log('');

if (errors.length > 0) {
  console.log('HEALTH CHECK FAILED');
  process.exit(1);
} else {
  console.log('HEALTH CHECK PASSED');
}
