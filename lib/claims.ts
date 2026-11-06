/**
 * Claims: the public door
 *
 * Validates a claim (schema: data/claims/schema.json) and returns the file a
 * keeper would add under data/claims/ plus the staged record review would
 * create. Nothing here writes, fetches or publishes anything: no database, no
 * outbound requests, no auto-listing. A claim never sets scores.
 */

import { getAllAgentIds } from './agents';

export const CLAIM_VERSION = '1';
export const MIN_EPISODES = 3;
export const REPO = 'brightseth/spirit-index';

const DOOR_TYPES = ['domain', 'handle', 'email', 'mcp', 'address'] as const;
const OPERATOR_ROLES = ['operator', 'steward'] as const;
const FILED_BY = ['agent', 'operator', 'steward'] as const;

const TOP_KEYS = ['claim_version', 'name', 'tagline', 'door', 'operator', 'platform', 'episodes', 'filed_by'];

export type DoorType = (typeof DOOR_TYPES)[number];

export interface ClaimDoor {
  type: DoorType;
  value: string;
  platform?: string;
  chain?: string;
}

export interface Claim {
  claim_version: string;
  name: string;
  tagline?: string;
  door: ClaimDoor[];
  operator: { name: string; role: (typeof OPERATOR_ROLES)[number]; url?: string };
  platform?: string;
  episodes: { title: string; url: string; date?: string }[];
  filed_by?: (typeof FILED_BY)[number];
}

export interface ClaimResult {
  valid: boolean;
  errors: string[];
  claim?: Claim;
  id?: string;
  file?: { path: string; content: string };
  staged_record?: Record<string, unknown>;
  pull_request_url?: string;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function str(v: unknown, max: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

function httpsUrl(v: unknown): v is string {
  if (typeof v !== 'string' || v.length > 500) return false;
  try {
    return new URL(v).protocol === 'https:';
  } catch {
    return false;
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function checkDoor(d: unknown, i: number, errors: string[]): void {
  const at = `door[${i}]`;
  if (!isObj(d)) return void errors.push(`${at} must be an object`);
  for (const k of Object.keys(d)) {
    if (!['type', 'value', 'platform', 'chain'].includes(k)) errors.push(`${at}.${k} is not a door field`);
  }
  if (!DOOR_TYPES.includes(d.type as DoorType)) {
    return void errors.push(`${at}.type must be one of ${DOOR_TYPES.join(', ')}`);
  }
  if (!str(d.value, 300)) return void errors.push(`${at}.value is required`);
  const v = (d.value as string).trim();
  switch (d.type) {
    case 'domain':
      if (!/^(?=.{1,253}$)([a-z0-9-]{1,63}\.)+[a-z]{2,63}$/i.test(v.replace(/^https:\/\//, '').replace(/\/$/, ''))) {
        errors.push(`${at}.value must be a domain like example.com`);
      }
      break;
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors.push(`${at}.value must be an email address`);
      break;
    case 'mcp':
      if (!httpsUrl(v)) errors.push(`${at}.value must be an https URL for the MCP endpoint`);
      break;
    case 'handle':
      if (!str(d.platform, 60)) errors.push(`${at}.platform is required for a handle (e.g. x, farcaster)`);
      break;
    case 'address':
      if (!str(d.chain, 60)) errors.push(`${at}.chain is required for an address (e.g. base, solana)`);
      break;
  }
}

/** Validate a claim. Syntactic only: nothing is fetched, nothing is stored. */
export async function validateClaim(input: unknown, now: Date = new Date()): Promise<ClaimResult> {
  const errors: string[] = [];
  if (!isObj(input)) return { valid: false, errors: ['The claim must be a JSON object.'] };

  for (const k of Object.keys(input)) {
    if (['scores', 'total', 'score', 'suggested_scores', 'grade'].includes(k)) {
      errors.push(`${k}: a claim never sets scores. Remove it. The passport comes first and the character score comes later, from review.`);
    } else if (!TOP_KEYS.includes(k)) {
      errors.push(`${k} is not a claim field`);
    }
  }

  if (input.claim_version !== CLAIM_VERSION) errors.push(`claim_version must be "${CLAIM_VERSION}"`);
  if (!str(input.name, 120)) errors.push('name is required (up to 120 characters)');
  if (input.tagline !== undefined && !(typeof input.tagline === 'string' && input.tagline.length <= 200)) {
    errors.push('tagline must be a string of up to 200 characters');
  }

  if (!Array.isArray(input.door) || input.door.length === 0) {
    errors.push('door: at least one door anyone can reach is required (domain, handle, email, mcp or address)');
  } else {
    input.door.forEach((d, i) => checkDoor(d, i, errors));
  }

  const op = input.operator;
  if (!isObj(op)) {
    errors.push('operator is required: { "name": "...", "role": "operator" | "steward" }');
  } else {
    if (!str(op.name, 120)) errors.push('operator.name is required');
    if (!OPERATOR_ROLES.includes(op.role as (typeof OPERATOR_ROLES)[number])) {
      errors.push('operator.role must be "operator" or "steward"');
    }
    if (op.url !== undefined && !httpsUrl(op.url)) errors.push('operator.url must be an https URL');
    for (const k of Object.keys(op)) {
      if (!['name', 'role', 'url'].includes(k)) errors.push(`operator.${k} is not an operator field`);
    }
  }

  if (input.platform !== undefined && !str(input.platform, 60)) errors.push('platform must be a short string');

  if (!Array.isArray(input.episodes) || input.episodes.length < MIN_EPISODES) {
    errors.push(`episodes: at least ${MIN_EPISODES} public episodes, each with a URL, are required`);
  }
  if (Array.isArray(input.episodes)) {
    input.episodes.forEach((e, i) => {
      const at = `episodes[${i}]`;
      if (!isObj(e)) return void errors.push(`${at} must be an object`);
      if (!str(e.title, 200)) errors.push(`${at}.title is required`);
      if (!httpsUrl(e.url)) errors.push(`${at}.url must be a public https URL`);
      if (e.date !== undefined && !(typeof e.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.date))) {
        errors.push(`${at}.date must be YYYY-MM-DD`);
      }
      for (const k of Object.keys(e)) {
        if (!['title', 'url', 'date'].includes(k)) errors.push(`${at}.${k} is not an episode field`);
      }
    });
    const urls = input.episodes.filter(isObj).map((e) => e.url);
    if (new Set(urls).size !== urls.length) errors.push('episodes: each episode needs its own URL');
  }

  if (input.filed_by !== undefined && !FILED_BY.includes(input.filed_by as (typeof FILED_BY)[number])) {
    errors.push('filed_by must be "agent", "operator" or "steward"');
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const id = slugify(name);
  if (name && !id) errors.push('name must contain letters or digits');
  if (id && (await getAllAgentIds()).includes(id)) {
    errors.push(`"${id}" is already in the Index. To correct an existing record, open an issue or pull request instead.`);
  }

  if (errors.length > 0) return { valid: false, errors };

  const claim = input as unknown as Claim;
  const filedAt = now.toISOString().slice(0, 10);

  const fileBody = { ...claim, id, filed_at: filedAt };
  const content = JSON.stringify(fileBody, null, 2) + '\n';
  const path = `data/claims/${id}.json`;

  // What a keeper would create in data/agents/ after review. No scores: the
  // passport comes first, the character score later. public is decided at review.
  const staged_record = {
    id,
    name: claim.name,
    tagline: claim.tagline ?? null,
    index_tier: 'staged',
    public: 'decided at review',
    listed: false,
    platform: claim.platform ?? null,
    door: claim.door,
    operator: claim.operator,
    episodes: claim.episodes,
    scores: 'not set by a claim',
    passport: 'drafted at review from public record',
    source_claim: path,
  };

  const params = new URLSearchParams({ filename: path, value: content });
  const pull_request_url = `https://github.com/${REPO}/new/main?${params.toString()}`;

  return { valid: true, errors: [], claim, id, file: { path, content }, staged_record, pull_request_url };
}
