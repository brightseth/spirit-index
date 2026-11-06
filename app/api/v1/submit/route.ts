/**
 * POST /api/v1/submit
 *
 * File a claim (schema: data/claims/schema.json). The route validates it and
 * returns the file a pull request would add under data/claims/, the staged
 * record review would create, and a ready-to-use link to open that pull
 * request. It stores nothing, fetches nothing and lists nothing: a keeper
 * reviews every claim. A claim never sets scores.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CORS_HEADERS, jsonSuccess, jsonError, BASE_URL } from '@/lib/api-utils';
import { validateClaim, CLAIM_VERSION, MIN_EPISODES } from '@/lib/claims';

const MAX_BODY_BYTES = 32_000;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' },
  });
}

export async function GET() {
  return jsonSuccess(
    {
      method: 'POST',
      endpoint: `${BASE_URL}/api/v1/submit`,
      claim_version: CLAIM_VERSION,
      schema: 'https://github.com/brightseth/spirit-index/blob/main/data/claims/schema.json',
      rule: `A door anyone can reach, public work (at least ${MIN_EPISODES} episodes with URLs), and a named operator or steward.`,
      protocol: `${BASE_URL}/submit.json`,
    },
    {},
    { cacheControl: 'public, max-age=3600, s-maxage=86400' },
  );
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return jsonError(413, { code: 'CLAIM_TOO_LARGE', message: `A claim must be under ${MAX_BODY_BYTES} bytes.` });
  }

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return jsonError(400, {
      code: 'INVALID_JSON',
      message: 'The request body must be a JSON claim.',
      hint: `See ${BASE_URL}/submit.json for the claim shape.`,
    });
  }

  const result = await validateClaim(input);

  if (!result.valid) {
    return jsonError(422, {
      code: 'CLAIM_INVALID',
      message: result.errors.join('; '),
      hint: `See ${BASE_URL}/submit.json for the claim shape.`,
    });
  }

  return jsonSuccess(
    {
      valid: true,
      id: result.id,
      file: result.file,
      staged_record: result.staged_record,
      next: {
        pull_request_url: result.pull_request_url,
        instructions: [
          'Open pull_request_url while signed in to GitHub. It opens a new file at data/claims/<id>.json with this claim filled in; GitHub offers to fork and open a pull request.',
          'Or add file.content at file.path in a fork and open a pull request by hand.',
          'A keeper reviews the claim against public record. If it meets the public-door rule, the keeper adds a staged record and drafts its passport. Whether it is shown publicly is decided at review.',
          'Nothing is listed without review, and a claim never sets scores.',
        ],
      },
    },
    { stored: false, listed: false },
    { cacheControl: 'no-store' },
  );
}
