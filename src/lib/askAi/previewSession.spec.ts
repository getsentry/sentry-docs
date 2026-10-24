import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('server-only', () => ({}));

import {
  createPreviewSession,
  getPreviewSession,
  isStatelessPreview,
  updatePreviewSession,
} from './previewSession';

beforeEach(() => {
  vi.stubEnv('FIN_AGENT_API_KEY', 'test-fin-key');
  vi.stubEnv('FIN_PUBLIC_ORIGIN', 'https://preview.example');
  vi.stubEnv('FIN_REDIS_REST_URL', '');
  vi.stubEnv('FIN_REDIS_REST_TOKEN', '');
  vi.stubEnv('VERCEL_ENV', 'preview');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe('stateless preview sessions', () => {
  it('retains the conversation across server module reloads without storage', async () => {
    const {token, session} = createPreviewSession('/platforms/javascript/');
    vi.resetModules();
    const freshServer = await import('./previewSession');
    expect(freshServer.getPreviewSession(token)).toEqual(session);
    session.state = 'ready';
    session.turns = 1;
    const updated = freshServer.updatePreviewSession(token, session);
    expect(updated).not.toBe(token);
    expect(getPreviewSession(updated)).toEqual(session);
  });

  it('rejects tampered state and tokens from a different deployment or key', () => {
    const {token} = createPreviewSession('/');
    const [payload, mac] = token.split('.');
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString());
    value.session.userId = 'another-user';
    const forged = `${Buffer.from(JSON.stringify(value)).toString('base64url')}.${mac}`;
    expect(() => getPreviewSession(forged)).toThrow('Start a new conversation');
    vi.stubEnv('FIN_PUBLIC_ORIGIN', 'https://other.example');
    expect(() => getPreviewSession(token)).toThrow('Start a new conversation');
    vi.stubEnv('FIN_PUBLIC_ORIGIN', 'https://preview.example');
    vi.stubEnv('FIN_AGENT_API_KEY', 'different-key');
    expect(() => getPreviewSession(token)).toThrow('Start a new conversation');
  });

  it('expires after one hour even when the conversation continues', () => {
    vi.useFakeTimers();
    const {token, session} = createPreviewSession('/');
    vi.advanceTimersByTime(59 * 60 * 1000);
    const updated = updatePreviewSession(token, {...session, state: 'ready'});
    vi.advanceTimersByTime(60 * 1000);
    expect(() => getPreviewSession(updated)).toThrow('expired');
  });

  it('requires a Fin key and rejects oversized or malformed tokens', () => {
    for (const token of ['', 'invalid.token', 'a'.repeat(5000)])
      expect(() => getPreviewSession(token)).toThrow('Start a new conversation');
    vi.stubEnv('FIN_AGENT_API_KEY', '');
    expect(() => createPreviewSession('/')).toThrow('not available');
  });

  it('only permits previews or development and never falls back from configured Redis', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(isStatelessPreview()).toBe(true);
    vi.stubEnv('VERCEL_ENV', 'production');
    expect(() => isStatelessPreview()).toThrow('not configured');
    vi.stubEnv('VERCEL_ENV', '');
    expect(() => isStatelessPreview()).toThrow('not configured');
    vi.stubEnv('NODE_ENV', 'development');
    expect(isStatelessPreview()).toBe(true);
    vi.stubEnv('FIN_REDIS_REST_URL', 'https://redis.example');
    expect(isStatelessPreview()).toBe(false);
    vi.stubEnv('FIN_REDIS_REST_URL', '');
    vi.stubEnv('FIN_REDIS_REST_TOKEN', 'test-token');
    expect(isStatelessPreview()).toBe(false);
  });
});
