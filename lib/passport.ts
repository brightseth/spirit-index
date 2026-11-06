/**
 * Durability Passport: data loading
 * Loads passports from data/passports/<id>.json (spec: docs/durability-passport.md)
 *
 * A passport is a separate instrument from the character score. Nothing here
 * is summed, and nothing here reads or writes an agent's scores or total.
 */

import fs from 'fs';
import path from 'path';

const PASSPORTS_DIR = path.join(process.cwd(), 'data', 'passports');
const PLATFORMS_DIR = path.join(process.cwd(), 'data', 'platforms');

export const PASSPORT_SPEC_VERSION = '1.1';
const SUPPORTED_SPEC_VERSIONS = ['1.0', '1.1'];

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
  platform?: string; // id of a platform passport in data/platforms/
  fields: Record<PassportFieldKey, PassportField>;
}

/** A platform passport: the same six fields, answered from the platform's own docs. */
export interface PlatformPassport {
  id: string;
  kind: 'platform';
  name: string;
  operator: string;
  website: string;
  spec_version: string;
  fields: Record<PassportFieldKey, PassportField>;
}

/** A field as shown: the agent's own answer, or its platform's when the agent has none. */
export interface ResolvedField {
  field: PassportField;
  inheritedFrom: { id: string; name: string } | null;
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

// The same six questions, asked of a platform where agents are born and run
export const PLATFORM_QUESTIONS: Record<PassportFieldKey, string> = {
  memory_custody:
    "Where does an agent's memory live here, can it be exported, what survives a closed account, and what happens when the model changes?",
  identity_anchor: 'Does an agent born here get a door of its own that survives the platform?',
  persistence_ops: 'Is the platform operating now, and since when?',
  economic_rails: 'Can an agent here transact?',
  governance: 'Who can override, pause or delete an agent here?',
  recovery: 'What happens when an agent fails mid-task or an account closes?',
};

const STATUSES: PassportStatus[] = ['attested', 'stale', 'IE'];

let _cache: Map<string, Passport> | null = null;
let _platformCache: Map<string, PlatformPassport> | null = null;

function assertPassport(p: Passport | PlatformPassport, file: string): void {
  if (!SUPPORTED_SPEC_VERSIONS.includes(p.spec_version)) {
    throw new Error(`${file}: spec_version must be one of ${SUPPORTED_SPEC_VERSIONS.join(', ')}`);
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

function readDir<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'schema.json')
    .map((file) => {
      const p = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8')) as T;
      assertPassport(p as Passport, file);
      return p;
    });
}

function loadPlatforms(): Map<string, PlatformPassport> {
  if (_platformCache) return _platformCache;
  const map = new Map<string, PlatformPassport>();
  for (const p of readDir<PlatformPassport>(PLATFORMS_DIR)) {
    if (p.kind !== 'platform') throw new Error(`platforms/${p.id}.json: kind must be platform`);
    map.set(p.id, p);
  }
  _platformCache = map;
  return map;
}

function loadAll(): Map<string, Passport> {
  if (_cache) return _cache;
  const platforms = loadPlatforms();
  const map = new Map<string, Passport>();
  for (const p of readDir<Passport>(PASSPORTS_DIR)) {
    if (p.platform && !platforms.has(p.platform)) {
      throw new Error(`passports/${p.id}.json: unknown platform ${p.platform}`);
    }
    map.set(p.id, p);
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

export function getPlatformPassport(id: string): PlatformPassport | null {
  return loadPlatforms().get(id) ?? null;
}

export function getPlatformIds(): string[] {
  return [...loadPlatforms().keys()].sort();
}

/**
 * The inheritance rule: a field the agent's own public record leaves unanswered
 * (IE) shows its platform's answer, labelled as inherited, until the agent's own
 * evidence answers it. The agent's own answer always wins.
 */
export function resolveField(p: Passport, key: PassportFieldKey): ResolvedField {
  const own = p.fields[key];
  if (own.status !== 'IE' || !p.platform) return { field: own, inheritedFrom: null };
  const platform = getPlatformPassport(p.platform);
  const theirs = platform?.fields[key];
  if (!platform || !theirs || theirs.status === 'IE') return { field: own, inheritedFrom: null };
  return { field: theirs, inheritedFrom: { id: platform.id, name: platform.name } };
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
export function lastChecked(p: Passport | PlatformPassport): string {
  return PASSPORT_FIELD_ORDER.map((k) => p.fields[k].checked).sort().at(-1) ?? '';
}
