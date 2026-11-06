/**
 * Durability Passport — data loading
 * Loads passports from data/passports/<id>.json (spec: docs/durability-passport.md)
 *
 * A passport is a separate instrument from the character score. Nothing here
 * is summed, and nothing here reads or writes an agent's scores or total.
 */

import fs from 'fs';
import path from 'path';

const PASSPORTS_DIR = path.join(process.cwd(), 'data', 'passports');

export const PASSPORT_SPEC_VERSION = '1.0';

/** Days after which an attested field is shown as stale. */
export const STALE_AFTER_DAYS = 90;

export type PassportStatus = 'attested' | 'stale' | 'IE';

export type PassportFieldKey =
  | 'identity_anchor'
  | 'memory_custody'
  | 'persistence_ops'
  | 'economic_rails'
  | 'governance'
  | 'recovery';

export interface PassportEvidence {
  claim: string;
  url: string;
}

export interface PassportField {
  status: PassportStatus;
  summary: string;
  evidence: PassportEvidence[];
  checked: string; // ISO date
}

export interface Passport {
  id: string;
  spec_version: string;
  fields: Record<PassportFieldKey, PassportField>;
}

// Memory custody is listed first on purpose (see docs/durability-passport.md)
export const PASSPORT_FIELDS: Record<PassportFieldKey, { label: string; question: string }> = {
  memory_custody: {
    label: 'Memory custody',
    question: "Who holds the agent's memory, and can it be exported or moved?",
  },
  identity_anchor: {
    label: 'Identity anchor',
    question: 'Does the identity survive any single platform?',
  },
  persistence_ops: {
    label: 'Persistence',
    question: 'Does it run without heroics?',
  },
  economic_rails: {
    label: 'Economic rails',
    question: 'Can it transact?',
  },
  governance: {
    label: 'Governance',
    question: 'Can its operator be checked?',
  },
  recovery: {
    label: 'Recovery',
    question: 'What happens when it dies mid-act?',
  },
};

export const PASSPORT_FIELD_ORDER = Object.keys(PASSPORT_FIELDS) as PassportFieldKey[];

const STATUSES: PassportStatus[] = ['attested', 'stale', 'IE'];

let _cache: Map<string, Passport> | null = null;

function assertPassport(p: Passport, file: string): void {
  if (p.spec_version !== PASSPORT_SPEC_VERSION) {
    throw new Error(`${file}: spec_version must be ${PASSPORT_SPEC_VERSION}`);
  }
  for (const key of PASSPORT_FIELD_ORDER) {
    const f = p.fields?.[key];
    if (!f) throw new Error(`${file}: missing field ${key}`);
    if (!STATUSES.includes(f.status)) throw new Error(`${file}: ${key} has invalid status`);
    if (f.status === 'IE' && f.evidence.length > 0) {
      throw new Error(`${file}: ${key} is IE but carries evidence`);
    }
    if (f.status !== 'IE' && f.evidence.length === 0) {
      throw new Error(`${file}: ${key} is ${f.status} with no evidence`);
    }
    for (const e of f.evidence) {
      if (!e.url.startsWith('https://')) throw new Error(`${file}: ${key} evidence url must be https`);
    }
  }
}

function loadAll(): Map<string, Passport> {
  if (_cache) return _cache;
  const map = new Map<string, Passport>();
  if (fs.existsSync(PASSPORTS_DIR)) {
    const files = fs
      .readdirSync(PASSPORTS_DIR)
      .filter((f) => f.endsWith('.json') && f !== 'schema.json');
    for (const file of files) {
      const p = JSON.parse(fs.readFileSync(path.join(PASSPORTS_DIR, file), 'utf-8')) as Passport;
      assertPassport(p, file);
      map.set(p.id, p);
    }
  }
  _cache = map;
  return map;
}

export function getPassport(id: string): Passport | null {
  return loadAll().get(id) ?? null;
}

export function getPassportIds(): string[] {
  return [...loadAll().keys()].sort();
}

/**
 * Apply the stale clock: an attested field whose check date is older than
 * STALE_AFTER_DAYS is shown as stale. The stored status is never rewritten.
 */
export function effectiveStatus(field: PassportField, now: Date = new Date()): PassportStatus {
  if (field.status !== 'attested') return field.status;
  const ageDays = (now.getTime() - new Date(field.checked).getTime()) / 86_400_000;
  return ageDays > STALE_AFTER_DAYS ? 'stale' : 'attested';
}

/** The latest check date across a passport's fields. */
export function lastChecked(p: Passport): string {
  return PASSPORT_FIELD_ORDER.map((k) => p.fields[k].checked).sort().at(-1) ?? '';
}
