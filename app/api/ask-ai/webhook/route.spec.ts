import {createHmac} from 'node:crypto';

import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));
const store = vi.hoisted(() => ({record: vi.fn(), redis: vi.fn()}));
vi.mock('sentry-docs/lib/askAi/store', async importOriginal => ({
  ...(await importOriginal<typeof import('sentry-docs/lib/askAi/store')>()),
  recordEvent: store.record,
  redis: store.redis,
}));

import {POST} from './route';

const conversationId = 'docs-12345678-1234-1234-1234-123456789abc';
const event = {
  event_name: 'fin_replied',
  conversation_id: conversationId,
  message: {id: 'answer-1', body: '<p>A useful answer</p>'},
};
function request(body: object, signature?: string) {
  const raw = JSON.stringify(body);
  return new Request('https://docs.example/api/ask-ai/webhook/', {
    method: 'POST',
    body: raw,
    headers: {
      'X-Fin-Agent-API-Webhook-Signature':
        signature ??
        `sha256=${createHmac('sha256', 'webhook-secret').update(raw).digest('hex')}`,
    },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('FIN_WEBHOOK_SECRET', 'webhook-secret');
  store.redis.mockResolvedValue('1');
  store.record.mockResolvedValue(undefined);
});

describe('Fin webhook', () => {
  it('validates the raw body and uses the same dedupe ID as SSE', async () => {
    expect((await POST(request(event))).status).toBe(200);
    expect(store.record).toHaveBeenCalledWith(
      conversationId,
      'answer',
      {type: 'answer', id: 'answer-1', html: '<p>A useful answer</p>', sources: []},
      'answer:answer-1'
    );
  });

  it('rejects forged signatures before accessing storage', async () => {
    expect((await POST(request(event, 'sha256=' + '0'.repeat(64)))).status).toBe(401);
    expect(store.redis).not.toHaveBeenCalled();
    expect(store.record).not.toHaveBeenCalled();
  });

  it('ignores signed events outside this pilot', async () => {
    store.redis.mockResolvedValueOnce(null);
    expect((await POST(request(event))).status).toBe(200);
    expect(store.record).not.toHaveBeenCalled();
  });

  it('returns a retriable failure if durable persistence fails', async () => {
    store.record.mockRejectedValueOnce(new Error('Storage unavailable'));
    expect((await POST(request(event))).status).toBe(503);
  });
});
