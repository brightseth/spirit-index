/**
 * GET /api/v1/passport/:id
 *
 * Durability Passport for a single agent: six operational fields, each with
 * status (attested / stale / IE), summary, evidence and check date.
 * Separate from the character score; nothing here is summed.
 */

import { NextRequest } from 'next/server';
import { getAgentById } from '@/lib/agents';
import { handleOptions, jsonSuccess, jsonError, BASE_URL } from '@/lib/api-utils';
import {
  getPassport,
  effectiveStatus,
  lastChecked,
  PASSPORT_FIELD_ORDER,
  PASSPORT_FIELDS,
  PASSPORT_SPEC_VERSION,
  STALE_AFTER_DAYS,
} from '@/lib/passport';

interface Props {
  params: Promise<{ id: string }>;
}

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;

    const agent = await getAgentById(id);
    const passport = agent ? getPassport(agent.id) : null;

    if (!agent || !passport) {
      return jsonError(404, {
        code: 'PASSPORT_NOT_FOUND',
        message: `No Durability Passport exists for "${id}".`,
        hint: 'Passports are published for a subset of agents. See https://spiritindex.org/passport',
      });
    }

    const now = new Date();
    const fields = PASSPORT_FIELD_ORDER.map((key) => {
      const f = passport.fields[key];
      return {
        key,
        label: PASSPORT_FIELDS[key].label,
        question: PASSPORT_FIELDS[key].question,
        status: effectiveStatus(f, now),
        recorded_status: f.status,
        summary: f.summary,
        evidence: f.evidence,
        checked: f.checked,
      };
    });

    return jsonSuccess(
      {
        id: agent.id,
        name: agent.name,
        spec_version: passport.spec_version,
        last_checked: lastChecked(passport),
        fields,
        url: `${BASE_URL}/${agent.id}#passport`,
      },
      {
        spec: `${BASE_URL}/passport`,
        spec_version: PASSPORT_SPEC_VERSION,
        stale_after_days: STALE_AFTER_DAYS,
        note: 'The passport is not a score. Fields are never summed and do not affect the character score.',
      },
      {
        cacheControl: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    );
  } catch (error) {
    console.error('GET /api/v1/passport/[id] error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch passport.',
    });
  }
}
