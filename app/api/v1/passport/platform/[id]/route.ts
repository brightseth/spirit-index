/**
 * GET /api/v1/passport/platform/:id
 *
 * Platform Durability Passport: the six passport fields answered for a
 * platform from its own documentation. Agents that run on the platform
 * inherit these answers for any field their own record leaves unanswered.
 */

import { NextRequest } from 'next/server';
import { handleOptions, jsonSuccess, jsonError, BASE_URL } from '@/lib/api-utils';
import {
  getPassport,
  getPassportIds,
  getPlatformPassport,
  effectiveStatus,
  lastChecked,
  PASSPORT_FIELD_ORDER,
  PASSPORT_FIELDS,
  PASSPORT_SPEC_VERSION,
  PLATFORM_QUESTIONS,
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
    const platform = getPlatformPassport(id);

    if (!platform) {
      return jsonError(404, {
        code: 'PLATFORM_NOT_FOUND',
        message: `No platform passport exists for "${id}".`,
        hint: 'See https://spiritindex.org/passport for the platforms with passports.',
      });
    }

    const now = new Date();
    const fields = PASSPORT_FIELD_ORDER.map((key) => {
      const f = platform.fields[key];
      return {
        key,
        label: PASSPORT_FIELDS[key].label,
        question: PLATFORM_QUESTIONS[key],
        status: effectiveStatus(f, now),
        recorded_status: f.status,
        summary: f.summary,
        evidence: f.evidence,
        checked: f.checked,
      };
    });

    const agents = getPassportIds()
      .filter((agentId) => getPassport(agentId)?.platform === platform.id)
      .map((agentId) => ({ id: agentId, url: `${BASE_URL}/${agentId}#passport` }));

    return jsonSuccess(
      {
        id: platform.id,
        kind: platform.kind,
        name: platform.name,
        operator: platform.operator,
        website: platform.website,
        spec_version: platform.spec_version,
        last_checked: lastChecked(platform),
        fields,
        agents,
        url: `${BASE_URL}/passport/platform/${platform.id}`,
      },
      {
        spec: `${BASE_URL}/passport`,
        spec_version: PASSPORT_SPEC_VERSION,
        stale_after_days: STALE_AFTER_DAYS,
        note: 'The passport is not a score. Agents on this platform inherit these answers for any field their own public record leaves unanswered.',
      },
      {
        cacheControl: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    );
  } catch (error) {
    console.error('GET /api/v1/passport/platform/[id] error:', error);
    return jsonError(500, {
      code: 'INTERNAL_ERROR',
      message: 'Failed to fetch platform passport.',
    });
  }
}
