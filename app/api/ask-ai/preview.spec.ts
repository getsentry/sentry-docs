import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));

import {
  createPreviewSession,
  updatePreviewSession,
} from 'sentry-docs/lib/askAi/previewSession';
import {readEventStream} from 'sentry-docs/lib/askAi/types';

import {POST} from './route';

function request(body: object, token?: string) {
  return new Request('https://preview.example/api/ask-ai/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://preview.example',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.stubEnv('ASK_AI_PROVIDER', 'fin');
  vi.stubEnv('FIN_PILOT_ENABLED', 'true');
  vi.stubEnv('FIN_AGENT_API_KEY', 'private-fin-key');
  vi.stubEnv('FIN_PUBLIC_ORIGIN', 'https://preview.example');
  vi.stubEnv('FIN_REDIS_REST_URL', '');
  vi.stubEnv('FIN_REDIS_REST_TOKEN', '');
  vi.stubEnv('FIN_HANDOFF_ENABLED', 'true');
  vi.stubEnv('FIN_REGION', 'us');
  vi.stubEnv('VERCEL_ENV', 'preview');
  vi.stubEnv('NODE_ENV', 'production');
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('Fin preview without Redis', () => {
  it('starts and continues with the same identity using only Fin and a page-memory token', async () => {
    const calls: {url: string; body: {conversation_id: string; user: {id: string}}}[] =
      [];
    let conversationId = '';
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation((url, init) => {
      if (String(url).startsWith('https://api.intercom.io/fin/')) {
        const body = JSON.parse(init?.body as string);
        calls.push({url: String(url), body});
        conversationId = body.conversation_id;
        return Promise.resolve(
          Response.json({
            intercom_conversation_id: 'intercom-123',
            sse_subscription_url:
              'https://primary-realtime.intercom-messenger.com/event-stream?accessToken=private-stream-token',
          })
        );
      }
      const events = [
        {event_name: 'fin_replied', message: {id: 'answer-1', body: '<p>Answer</p>'}},
        {event_name: 'fin_status_updated', status: 'awaiting_user_reply'},
      ];
      return Promise.resolve(
        new Response(
          events
            .map(
              event =>
                `data: ${JSON.stringify({conversation_id: conversationId, ...event})}\n\n`
            )
            .join(''),
          {headers: {'Content-Type': 'text/event-stream'}}
        )
      );
    });
    const opened = await POST(
      request({action: 'session', path: '/platforms/javascript/'})
    );
    const session = await opened.json();
    expect(opened.status).toBe(200);
    expect(opened.headers.get('set-cookie')).toBeNull();
    expect(session.capabilities).toEqual({feedback: false, handoff: false});
    expect(fetchMock).not.toHaveBeenCalled();

    const response = await POST(
      request({action: 'message', question: 'Set up Sentry'}, session.token)
    );
    const events: Record<string, unknown>[] = [];
    for await (const event of readEventStream(response.body!)) events.push(event);
    const refreshed = events.find(event => event.type === 'session')!.token as string;
    expect(refreshed).not.toBe(session.token);
    expect(events.at(-1)).toEqual({type: 'status', status: 'awaiting_user_reply'});
    expect(JSON.stringify(events)).not.toMatch(/private-fin-key|private-stream-token/);
    expect(response.headers.get('set-cookie')).toBeNull();

    vi.resetModules();
    const freshServer = await import('./route');
    const followup = await freshServer.POST(
      request({action: 'message', question: 'And Python?'}, refreshed)
    );
    await followup.text();
    expect(calls.map(call => call.url)).toEqual([
      'https://api.intercom.io/fin/start',
      'https://api.intercom.io/fin/reply',
    ]);
    expect(calls[1].body.conversation_id).toBe(calls[0].body.conversation_id);
    expect(calls[1].body.user).toEqual(calls[0].body.user);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('does not silently accept feedback or create support requests without storage', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const {token} = createPreviewSession('/');
    for (const action of ['feedback', 'handoff']) {
      expect((await POST(request({action}, token))).status).toBe(503);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects production, disabled pilots, closed conversations, and the next turn after 20', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const {token, session} = createPreviewSession('/');
    for (const state of [
      {state: 'closed' as const},
      {state: 'ready' as const, turns: 20},
    ]) {
      const updated = updatePreviewSession(token, {...session, ...state});
      const response = await POST(
        request({action: 'message', question: 'Hello'}, updated)
      );
      expect([409, 429]).toContain(response.status);
    }
    vi.stubEnv('VERCEL_ENV', 'production');
    expect((await POST(request({action: 'session'}))).status).toBe(503);
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('FIN_PILOT_ENABLED', 'false');
    expect((await POST(request({action: 'session'}))).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports an incomplete stream without issuing a continuation token or retrying', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        Response.json({
          sse_subscription_url:
            'https://primary-realtime.intercom-messenger.com/event-stream',
        })
      )
      .mockResolvedValueOnce(
        new Response('', {headers: {'Content-Type': 'text/event-stream'}})
      );
    const {token} = createPreviewSession('/');
    const response = await POST(request({action: 'message', question: 'Hello'}, token));
    const body = await response.text();
    expect(body).toContain('interrupted');
    expect(body).not.toContain('"type":"session"');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
