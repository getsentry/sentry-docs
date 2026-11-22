import {createHmac} from 'node:crypto';

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));
const memory = vi.hoisted(() => ({
  objects: new Map<string, {body: string; etag: string}>(),
  version: 0,
  calls: 0,
  failWrites: false,
}));
vi.mock('@aws-sdk/client-s3', async importOriginal => ({
  ...(await importOriginal<typeof import('@aws-sdk/client-s3')>()),
  S3Client: class {
    destroy() {}
    async send(command: {constructor: {name: string}; input: Record<string, string>}) {
      await Promise.resolve();
      memory.calls++;
      const {
        Key: key,
        Body: body,
        Prefix: prefix,
        IfMatch: match,
        IfNoneMatch: absent,
      } = command.input;
      const existing = memory.objects.get(key);
      const fail = (code: number) => {
        throw Object.assign(new Error('Storage error'), {
          $metadata: {httpStatusCode: code},
        });
      };
      switch (command.constructor.name) {
        case 'GetObjectCommand':
          if (!existing) return fail(404);
          return {
            Body: {transformToString: () => Promise.resolve(existing.body)},
            ETag: existing.etag,
          };
        case 'PutObjectCommand': {
          if (memory.failWrites) return fail(503);
          if ((absent && existing) || (match && existing?.etag !== match))
            return fail(412);
          const etag = `etag-${++memory.version}`;
          memory.objects.set(key, {body, etag});
          return {ETag: etag};
        }
        case 'ListObjectsV2Command':
          return {
            Contents: [...memory.objects.keys()]
              .filter(k => k.startsWith(prefix))
              .sort()
              .map(Key => ({Key})),
          };
        default:
          throw new Error('Unexpected object-storage command');
      }
    }
  },
}));

import {getPreviewSession} from 'sentry-docs/lib/askAi/previewSession';
import {readWebhookSession} from 'sentry-docs/lib/askAi/r2';

import {POST} from './route';
import {POST as webhook} from './webhook/route';

const origin = 'https://preview.example';
function request(body: object, token?: string) {
  return new Request(`${origin}/api/ask-ai/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
    body: JSON.stringify(body),
  });
}
function webhookRequest(body: object, signature?: string) {
  const text = JSON.stringify(body);
  return new Request(`${origin}/api/ask-ai/webhook/`, {
    method: 'POST',
    body: text,
    headers: {
      'X-Fin-Agent-API-Webhook-Signature':
        signature ??
        `sha256=${createHmac('sha256', 'webhook-secret').update(text).digest('hex')}`,
    },
  });
}
function finAccepted(at = Date.now()) {
  return Response.json({status: 'thinking', created_at_ms: new Date(at).toISOString()});
}
function answer(id: string, time: number, body = '<p>Answer</p>') {
  return {
    event_name: 'fin_replied',
    created_at_ms: new Date(time).toISOString(),
    message: {id, body, sources: [{title: 'Docs', url: 'https://docs.sentry.io/'}]},
    status: 'replying',
  };
}
function status(value: string, time: number) {
  return {
    event_name: 'fin_status_updated',
    created_at_ms: new Date(time).toISOString(),
    status: value,
  };
}
function deliver(conversationId: string, event: object) {
  return webhook(webhookRequest({...event, conversation_id: conversationId}));
}
async function session() {
  const response = await POST(
    request({action: 'session', path: '/platforms/javascript/'})
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('set-cookie')).toBeNull();
  return response.json() as Promise<{token: string}>;
}
async function finish(response: Response, milliseconds = 6000) {
  const pending = response.text();
  await vi.advanceTimersByTimeAsync(milliseconds);
  return (await pending)
    .split('\n')
    .filter(line => line.startsWith('data: '))
    .map(line => JSON.parse(line.slice(6)));
}

beforeEach(() => {
  vi.useFakeTimers();
  memory.objects.clear();
  memory.version = 0;
  memory.calls = 0;
  memory.failWrites = false;
  for (const [name, value] of Object.entries({
    ASK_AI_PROVIDER: 'fin',
    FIN_PILOT_ENABLED: 'true',
    FIN_AGENT_API_KEY: 'private-fin-key',
    FIN_PUBLIC_ORIGIN: origin,
    FIN_R2_BUCKET: 'private-fin-pilot',
    FIN_R2_ACCESS_KEY_ID: 'r2-id',
    FIN_R2_SECRET_ACCESS_KEY: 'r2-secret',
    FIN_WEBHOOK_SECRET: 'webhook-secret',
    VERCEL_ENV: 'preview',
    NODE_ENV: 'production',
    FIN_REDIS_REST_URL: '',
    FIN_REDIS_REST_TOKEN: '',
  }))
    vi.stubEnv(name, value);
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('Fin webhook delivery through private R2', () => {
  it('preserves follow-ups when terminal statuses share the response timestamp', async () => {
    const time = Date.now();
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted(time));
    await deliver(conversationId, status('complete', time));
    await deliver(conversationId, status('awaiting_user_reply', time));
    const response = await POST(
      request({action: 'message', question: 'Hello'}, opened.token)
    );
    const events = await finish(response);
    expect(events.at(-1).status).toBe('awaiting_user_reply');
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe('ready');
  });

  it.each([undefined, null, 'malformed'])(
    'fails closed when Fin returns no usable request timestamp (%s)',
    async timestamp => {
      const opened = await session();
      const fetchMock = vi
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(Response.json({status: 'thinking', created_at_ms: timestamp}));
      const response = await POST(
        request({action: 'message', question: 'Hello'}, opened.token)
      );
      expect(response.status).toBe(502);
      expect(
        (await POST(request({action: 'message', question: 'Retry'}, opened.token))).status
      ).toBe(409);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );
  it.each(['complete', 'resolved', 'escalated'])(
    'does not let a later %s override awaiting_user_reply during settling',
    async later => {
      const time = Date.now();
      const opened = await session();
      const {conversationId} = getPreviewSession(opened.token);
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted(time));
      await deliver(conversationId, answer('a', time + 10));
      await deliver(conversationId, status('awaiting_user_reply', time + 20));
      const response = await POST(
        request({action: 'message', question: 'Hello'}, opened.token)
      );
      setTimeout(() => void deliver(conversationId, status(later, time + 30)), 1000);
      const events = await finish(response);
      expect(events.filter(e => e.type === 'status')).toEqual([
        {type: 'status', status: 'awaiting_user_reply'},
      ]);
      expect((await readWebhookSession(conversationId))!.value.session.state).toBe(
        'ready'
      );
      const updated = events.find(e => e.type === 'session').token;
      expect(getPreviewSession(updated).state).toBe('ready');
    }
  );

  it('uses event order when complete is delivered before an earlier awaiting_user_reply', async () => {
    const time = Date.now();
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted(time));
    await deliver(conversationId, status('complete', time + 30));
    const response = await POST(
      request({action: 'message', question: 'Hello'}, opened.token)
    );
    setTimeout(
      () => void deliver(conversationId, status('awaiting_user_reply', time + 20)),
      1000
    );
    const events = await finish(response);
    expect(events.at(-1).status).toBe('awaiting_user_reply');
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe('ready');
  });

  it('does not seal a follow-up when the previous turn completes after its stored cutoff', async () => {
    // Fin's clock intentionally differs from our server's clock.
    const time = Date.now() - 60_000;
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(finAccepted(time))
      .mockResolvedValueOnce(finAccepted(time + 1000));
    await deliver(conversationId, answer('first', time + 10));
    await deliver(conversationId, status('awaiting_user_reply', time + 20));
    const first = await finish(
      await POST(request({action: 'message', question: 'Hello'}, opened.token))
    );
    const token = first.find(e => e.type === 'session').token;
    const next = await POST(request({action: 'message', question: 'Follow-up'}, token));
    // Delayed delivery, with a timestamp later than after=20 but before the
    // new Fin request's response timestamp=1000.
    await deliver(conversationId, status('complete', time + 30));
    await deliver(conversationId, status('escalated', time + 25));
    await vi.advanceTimersByTimeAsync(4000);
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe('busy');
    await deliver(conversationId, answer('follow-up', time + 1010));
    await deliver(conversationId, status('awaiting_user_reply', time + 1020));
    const events = await finish(next);
    expect(events.filter(e => e.type === 'status')).toEqual([
      {type: 'status', status: 'awaiting_user_reply'},
    ]);
    expect(events.some(e => e.id === 'follow-up')).toBe(true);
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe('ready');
  });
  it('delivers multiple parts without a Fin SSE URL, survives module reloads, and continues the same conversation', async () => {
    const time = Date.now();
    let turn = 0;
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (_url, init) => {
        const body = JSON.parse(init!.body as string);
        turn++;
        await deliver(body.conversation_id, answer(`part-${turn}-1`, time + turn * 100));
        await deliver(
          body.conversation_id,
          answer(`part-${turn}-2`, time + turn * 100 + 1)
        );
        await deliver(
          body.conversation_id,
          status('awaiting_user_reply', time + turn * 100 + 2)
        );
        return Response.json({
          status: 'thinking',
          created_at_ms: new Date(time + turn * 100 - 1).toISOString(),
          intercom_conversation_id: 'support-123',
        });
      });
    const opened = await session();
    const first = await POST(
      request({action: 'message', question: 'Set up Next.js'}, opened.token)
    );
    expect(first.headers.get('content-type')).toBe('text/event-stream');
    const events = await finish(first);
    expect(events.filter(e => e.type === 'answer')).toHaveLength(2);
    expect(events.at(-1)).toEqual({type: 'status', status: 'awaiting_user_reply'});
    expect(JSON.stringify(events)).not.toMatch(
      /private-fin-key|r2-secret|webhook-secret/
    );
    const refreshed = events.find(e => e.type === 'session').token;
    expect(
      (await POST(request({action: 'message', question: 'Replay'}, opened.token))).status
    ).toBe(409);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.resetModules();
    const freshServer = await import('./route');
    const next = await freshServer.POST(
      request({action: 'message', question: 'And Python?'}, refreshed)
    );
    const followup = await finish(next);
    expect(followup.filter(e => e.type === 'answer')).toHaveLength(4);
    expect(followup.at(-1).status).toBe('awaiting_user_reply');
    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      'https://api.intercom.io/fin/start',
      'https://api.intercom.io/fin/reply',
    ]);
    const bodies = fetchMock.mock.calls.map(([, init]) =>
      JSON.parse(init!.body as string)
    );
    expect(bodies[1].conversation_id).toBe(bodies[0].conversation_id);
    expect(bodies[1].user).toEqual(bodies[0].user);
  });

  it('deduplicates webhook retries and waits for an answer delivered after the terminal event', async () => {
    const time = Date.now();
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted());
    await deliver(conversationId, status('awaiting_user_reply', time + 2));
    const response = await POST(
      request({action: 'message', question: 'Hello'}, opened.token)
    );
    setTimeout(() => void deliver(conversationId, answer('late-part', time + 1)), 1000);
    setTimeout(() => void deliver(conversationId, answer('late-part', time + 1)), 1500);
    const events = await finish(response);
    expect(events.filter(e => e.type === 'answer')).toHaveLength(1);
    expect(events.at(-1).status).toBe('awaiting_user_reply');
    expect(
      [...memory.objects.keys()].filter(key => key.includes('/events/'))
    ).toHaveLength(2);
  });

  it('allows only one concurrent submit and does not treat escalation alone as the end of a turn', async () => {
    const time = Date.now();
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted());
    const responses = await Promise.all(
      [1, 2].map(() =>
        POST(request({action: 'message', question: 'Hello'}, opened.token))
      )
    );
    expect(responses.map(r => r.status).sort()).toEqual([200, 409]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await deliver(conversationId, status('escalated', time + 1));
    await vi.advanceTimersByTimeAsync(4000);
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe('busy');
    await deliver(conversationId, status('complete', time + 2));
    const events = await finish(responses.find(r => r.status === 200)!);
    expect(events.at(-1).status).toBe('complete');
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe(
      'closed'
    );
  });

  it('rejects forged webhooks before storage and ignores unregistered and expired conversations', async () => {
    expect((await webhook(webhookRequest({}, '0'.repeat(64)))).status).toBe(401);
    expect(memory.calls).toBe(0);
    const fake = 'docs-12345678-1234-1234-1234-123456789abc';
    expect((await deliver(fake, answer('a', Date.now()))).status).toBe(200);
    expect(memory.objects.size).toBe(0);
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    await vi.advanceTimersByTimeAsync(3_600_001);
    expect((await deliver(conversationId, answer('a', Date.now()))).status).toBe(200);
    expect(
      [...memory.objects.keys()].filter(key => key.includes('/events/'))
    ).toHaveLength(0);
    expect(
      (await POST(request({action: 'message', question: 'Expired'}, opened.token))).status
    ).toBe(401);
  });

  it('returns retryable errors on storage failure and fails closed after an ambiguous Fin request', async () => {
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    memory.failWrites = true;
    expect((await deliver(conversationId, answer('a', Date.now()))).status).toBe(503);
    memory.failWrites = false;
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('upstream timeout'));
    expect(
      (await POST(request({action: 'message', question: 'Hello'}, opened.token))).status
    ).toBe(503);
    expect(
      (await POST(request({action: 'message', question: 'Retry'}, opened.token))).status
    ).toBe(409);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('times out missing webhooks without granting a follow-up token or resending to Fin', async () => {
    const opened = await session();
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted());
    const response = await POST(
      request({action: 'message', question: 'Hello'}, opened.token)
    );
    const events = await finish(response, 91_000);
    expect(events.at(-1).type).toBe('error');
    expect(events.some(e => e.type === 'session')).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects public docs buckets, production use, and disabled pilots', async () => {
    vi.stubEnv('FIN_R2_BUCKET', 'sentry-docs');
    expect((await POST(request({action: 'session'}))).status).toBe(503);
    vi.stubEnv('FIN_R2_BUCKET', 'private-fin-pilot');
    vi.stubEnv('VERCEL_ENV', 'production');
    expect((await POST(request({action: 'session'}))).status).toBe(503);
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('FIN_PILOT_ENABLED', 'false');
    expect((await POST(request({action: 'session'}))).status).toBe(503);
    expect(memory.calls).toBe(0);
  });

  it("never returns another session's answer and refuses a modified conversation ID", async () => {
    const first = await session();
    const second = await session();
    const firstId = getPreviewSession(first.token).conversationId;
    const secondId = getPreviewSession(second.token).conversationId;
    await deliver(
      firstId,
      answer('private-answer', Date.now(), '<p>First conversation only</p>')
    );
    const [payload, mac] = second.token.split('.');
    const changed = JSON.parse(Buffer.from(payload, 'base64url').toString());
    changed.session.conversationId = firstId;
    const forged = `${Buffer.from(JSON.stringify(changed)).toString('base64url')}.${mac}`;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted());
    expect(
      (await POST(request({action: 'message', question: 'Read another session'}, forged)))
        .status
    ).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
    await deliver(secondId, status('complete', Date.now() + 1));
    const response = await POST(
      request({action: 'message', question: 'Hello'}, second.token)
    );
    const events = await finish(response);
    expect(JSON.stringify(events)).not.toContain('First conversation only');
    expect(events.at(-1).status).toBe('complete');
  });

  it('stops polling on disconnect and does not leave the turn reusable', async () => {
    const opened = await session();
    const {conversationId} = getPreviewSession(opened.token);
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(finAccepted());
    const response = await POST(
      request({action: 'message', question: 'Hello'}, opened.token)
    );
    await response.body!.cancel();
    await vi.advanceTimersByTimeAsync(1000);
    expect((await readWebhookSession(conversationId))!.value.session.state).toBe(
      'failed'
    );
    const calls = memory.calls;
    await vi.advanceTimersByTimeAsync(10_000);
    expect(memory.calls).toBe(calls);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
