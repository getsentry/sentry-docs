import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));

const store = vi.hoisted(() => ({
  session: {
    conversationId: 'docs-test',
    userId: 'docs-anonymous-test',
    path: '/platforms/javascript/',
    state: 'new',
    turns: 0,
    intercomId: undefined as string | undefined,
    handedOff: false,
  },
  release: vi.fn(),
  record: vi.fn(),
  redis: vi.fn(),
  budget: vi.fn(),
}));

vi.mock('sentry-docs/lib/askAi/store', async importOriginal => {
  const original = await importOriginal<typeof import('sentry-docs/lib/askAi/store')>();
  return {
    ...original,
    createSession: vi.fn(() =>
      Promise.resolve({token: 'a'.repeat(64), session: store.session})
    ),
    getSession: vi.fn(() => Promise.resolve(store.session)),
    saveSession: vi.fn((_token: string, session: typeof store.session) => {
      store.session = session;
      return Promise.resolve();
    }),
    lockSession: vi.fn(() => Promise.resolve(store.release)),
    recordEvent: store.record,
    redis: store.redis,
    takeBudget: store.budget,
  };
});

import {POST} from './route';

function request(body: object, origin = 'https://docs.example') {
  return new Request('https://docs.example/api/ask-ai/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      Authorization: `Bearer ${'a'.repeat(64)}`,
    },
    body: JSON.stringify(body),
  });
}

function finStream(events: object[]) {
  return new Response(
    events
      .map(
        event => `data: ${JSON.stringify({conversation_id: 'docs-test', ...event})}\n\n`
      )
      .join(''),
    {headers: {'Content-Type': 'text/event-stream'}}
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  vi.stubEnv('ASK_AI_PROVIDER', 'fin');
  vi.stubEnv('FIN_PILOT_ENABLED', 'true');
  vi.stubEnv('FIN_PUBLIC_ORIGIN', 'https://docs.example');
  vi.stubEnv('FIN_AGENT_API_KEY', 'private-fin-key');
  vi.stubEnv('FIN_HANDOFF_ENABLED', 'false');
  vi.stubEnv('FIN_REGION', 'us');
  vi.stubEnv('FIN_REDIS_REST_URL', 'https://redis.example');
  vi.stubEnv('FIN_REDIS_REST_TOKEN', 'test-redis-token');
  store.session = {
    conversationId: 'docs-test',
    userId: 'docs-anonymous-test',
    path: '/platforms/javascript/',
    state: 'new',
    turns: 0,
    intercomId: undefined,
    handedOff: false,
  };
  store.redis.mockResolvedValue('OK');
  store.release.mockResolvedValue(undefined);
  store.budget.mockResolvedValue(undefined);
});

describe('first-party Fin proxy', () => {
  it('streams a multi-part answer, preserves the Intercom join key, and waits for awaiting_user_reply', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        Response.json({
          intercom_conversation_id: 'intercom-123',
          sse_subscription_url:
            'https://primary-realtime.intercom-messenger.com/event-stream?accessToken=never-send-to-browser',
        })
      )
      .mockResolvedValueOnce(
        finStream([
          {
            event_name: 'fin_reply_chunk',
            stream_id: 's1',
            chunk_index: 0,
            chunk_text: 'Setup',
          },
          {
            event_name: 'fin_replied',
            stream_id: 's1',
            status: 'replying',
            message: {
              id: 'm1',
              body: '<p>Setup [1]</p>',
              sources: [{title: 'Docs', url: 'https://docs.sentry.io/'}],
            },
          },
          {
            event_name: 'fin_replied',
            status: 'replying',
            message: {id: 'm2', body: '<p>Next step</p>'},
          },
          {
            event_name: 'fin_status_updated',
            status: 'awaiting_user_reply',
            created_at_ms: '2026-10-19T10:00:00.000Z',
          },
        ])
      );
    const response = await POST(
      request({action: 'message', question: 'How do I set up Sentry?'})
    );
    const body = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(response.headers.get('cache-control')).toContain('no-store');
    expect(body).toContain('intercom-123');
    expect(body).toContain('Next step');
    expect(body).not.toContain('never-send-to-browser');
    expect(body).not.toContain('private-fin-key');
    expect(store.session.state).toBe('ready');
    expect(store.record).toHaveBeenCalledWith('docs-test', 'linked', {
      intercomConversationId: 'intercom-123',
      metadataAccepted: true,
    });
    const call = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
    expect(call.user).toEqual({id: 'docs-anonymous-test'});
    expect(call.conversation_metadata.attributes).toEqual({
      docs_origin: 'docs_ask_ai',
      docs_path: '/platforms/javascript/',
    });
    expect(fetchMock.mock.calls[1][1]?.headers).toBeUndefined();
    expect(store.release).toHaveBeenCalledOnce();
  });

  it('continues the same conversation on follow-up', async () => {
    store.session.state = 'ready';
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        Response.json({
          sse_subscription_url:
            'https://primary-realtime.intercom-messenger.com/event-stream',
        })
      )
      .mockResolvedValueOnce(
        finStream([{event_name: 'fin_status_updated', status: 'awaiting_user_reply'}])
      );
    const response = await POST(
      request({action: 'message', question: 'And for Python?'})
    );
    await response.text();
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.intercom.io/fin/reply');
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string).conversation_id).toBe(
      'docs-test'
    );
  });

  it('fails closed when streaming access is missing and does not retry Fin', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json({intercom_conversation_id: '123'}));
    expect((await POST(request({action: 'message', question: 'Hello'}))).status).toBe(
      503
    );
    expect(store.session.state).toBe('failed');
    expect((await POST(request({action: 'message', question: 'Hello'}))).status).toBe(
      409
    );
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('shows an explicit interruption if the stream ends before the terminal event', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        Response.json({
          sse_subscription_url:
            'https://primary-realtime.intercom-messenger.com/event-stream',
        })
      )
      .mockResolvedValueOnce(
        finStream([
          {event_name: 'fin_replied', message: {id: 'm1', body: '<p>Partial</p>'}},
        ])
      );
    const response = await POST(request({action: 'message', question: 'Hello'}));
    expect(await response.text()).toContain('interrupted');
    expect(store.session.state).toBe('failed');
  });

  it('rejects cross-origin requests, oversized questions, and a disabled pilot before contacting Fin', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    expect(
      (await POST(request({action: 'session'}, 'https://evil.example'))).status
    ).toBe(403);
    expect(
      (await POST(request({action: 'message', question: 'x'.repeat(4001)}))).status
    ).toBe(400);
    vi.stubEnv('FIN_PILOT_ENABLED', 'false');
    expect((await POST(request({action: 'session'}))).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('never sends a query after the budget is exhausted or storage fails', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    store.budget.mockRejectedValueOnce(new Error('Store unavailable'));
    expect((await POST(request({action: 'message', question: 'Hello'}))).status).toBe(
      503
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects feedback for another conversation', async () => {
    store.redis.mockResolvedValueOnce(null);
    expect(
      (await POST(request({action: 'feedback', messageId: 'other', rating: 'helpful'})))
        .status
    ).toBe(400);
    expect(store.record).not.toHaveBeenCalled();
  });

  it('only hands off when configured and retains both conversation references', async () => {
    store.session.intercomId = 'original';
    store.session.state = 'ready';
    expect(
      (await POST(request({action: 'handoff', email: 'user@example.com'}))).status
    ).toBe(503);
    vi.stubEnv('FIN_HANDOFF_ENABLED', 'true');
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({intercom_conversation_id: 'support'}));
    expect(
      (await POST(request({action: 'handoff', email: 'user@example.com'}))).status
    ).toBe(200);
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.intercom.io/fin/escalate');
    expect(store.record).toHaveBeenCalledWith('docs-test', 'support_handoff', {
      intercomConversationId: 'original',
      supportConversationId: 'support',
    });
    expect(
      (await POST(request({action: 'handoff', email: 'user@example.com'}))).status
    ).toBe(409);
  });
});
