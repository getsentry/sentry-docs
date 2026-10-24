import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));
const redis = vi.hoisted(() => vi.fn());
vi.mock('sentry-docs/lib/askAi/store', async importOriginal => ({
  ...(await importOriginal<typeof import('sentry-docs/lib/askAi/store')>()),
  redis,
}));

import {GET} from './route';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('FIN_EVENTS_READ_TOKEN', 'r'.repeat(32));
});

describe('internal agent event export', () => {
  it('requires the separate internal token, not an anonymous conversation token', async () => {
    const response = await GET(
      new Request('https://docs.example/api/ask-ai/events/', {
        headers: {Authorization: `Bearer ${'a'.repeat(64)}`},
      })
    );
    expect(response.status).toBe(401);
    expect(redis).not.toHaveBeenCalled();
  });

  it('returns an exclusive cursor page without exposing storage credentials', async () => {
    redis.mockResolvedValueOnce([
      ['123-2', ['event', JSON.stringify({id: 'event-1', type: 'feedback'})]],
    ]);
    const response = await GET(
      new Request(
        'https://docs.example/api/ask-ai/events/?date=2026-10-19&cursor=123-1',
        {headers: {Authorization: `Bearer ${'r'.repeat(32)}`}}
      )
    );
    expect(redis).toHaveBeenCalledWith(
      'XRANGE',
      'docs-fin-pilot:events:2026-10-19',
      '(123-1',
      '+',
      'COUNT',
      100
    );
    expect(await response.json()).toEqual({
      date: '2026-10-19',
      events: [{cursor: '123-2', id: 'event-1', type: 'feedback'}],
      nextCursor: '123-2',
    });
    expect(response.headers.get('cache-control')).toContain('no-store');
  });
});
