import {timingSafeEqual} from 'node:crypto';

import {bearerToken, errorResponse, privateHeaders} from 'sentry-docs/lib/askAi/http';
import {AskAiError, key, redis} from 'sentry-docs/lib/askAi/store';

export const runtime = 'nodejs';

// Internal agent pulls an append-only page, persists its cursor only after
// processing, and deduplicates by conversationId + event.id.
export async function GET(request: Request) {
  try {
    const expected = process.env.FIN_EVENTS_READ_TOKEN;
    const actual = bearerToken(request);
    if (
      !expected ||
      expected.length < 32 ||
      Buffer.byteLength(actual) !== Buffer.byteLength(expected) ||
      !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
    )
      throw new AskAiError(401, 'Unauthorized.');
    const params = new URL(request.url).searchParams;
    const date = params.get('date') || new Date().toISOString().slice(0, 10);
    const cursor = params.get('cursor');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || (cursor && !/^\d+-\d+$/.test(cursor)))
      throw new AskAiError(400, 'Invalid date or cursor.');
    const entries = await redis<[string, string[]][]>(
      'XRANGE',
      key(`events:${date}`),
      cursor ? `(${cursor}` : '-',
      '+',
      'COUNT',
      100
    );
    return Response.json(
      {
        date,
        events: entries.map(([id, fields]) => ({cursor: id, ...JSON.parse(fields[1])})),
        nextCursor: entries.at(-1)?.[0] ?? cursor,
      },
      {headers: privateHeaders}
    );
  } catch (error) {
    return errorResponse(error);
  }
}
