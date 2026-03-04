import {NextRequest} from 'next/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

// Helper to import the middleware module fresh with given env vars
async function importMiddleware(env: Record<string, string | undefined> = {}) {
  vi.resetModules();

  // Set env vars before importing (module-level code reads process.env on load)
  const originalEnv = {...process.env};
  // Clear both vars first
  delete process.env.DEVELOPER_DOCS_;
  delete process.env.NEXT_PUBLIC_DEVELOPER_DOCS;
  Object.assign(process.env, env);

  const mod = await import('./middleware');

  // Restore env after import
  process.env = originalEnv;

  return mod;
}

function makeRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, 'https://docs.sentry.io'));
}

describe('middleware redirects', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('when DEVELOPER_DOCS_ env var is set (edge runtime / build-time inline)', () => {
    it('uses developer docs redirects', async () => {
      const {middleware} = await importMiddleware({DEVELOPER_DOCS_: '1'});

      // "/" redirects to "/getting-started/" in developer docs
      const res = middleware(makeRequest('/'));
      expect(res.status).toBe(301);
      expect(new URL(res.headers.get('location')!).pathname).toBe('/getting-started/');
    });

    it('redirects /docs-components/ to /development/docs/', async () => {
      const {middleware} = await importMiddleware({DEVELOPER_DOCS_: '1'});

      const res = middleware(makeRequest('/docs-components/'));
      expect(res.status).toBe(301);
      expect(new URL(res.headers.get('location')!).pathname).toBe('/development/docs/');
    });
  });

  describe('when NEXT_PUBLIC_DEVELOPER_DOCS env var is set (node runtime fallback)', () => {
    it('uses developer docs redirects', async () => {
      const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});

      const res = middleware(makeRequest('/'));
      expect(res.status).toBe(301);
      expect(new URL(res.headers.get('location')!).pathname).toBe('/getting-started/');
    });
  });

  describe('when no developer docs env var is set (user docs)', () => {
    it('uses user docs redirects', async () => {
      const {middleware} = await importMiddleware({});

      // A known user docs redirect
      const res = middleware(makeRequest('/platforms/python/http_errors/'));
      expect(res.status).toBe(301);
      expect(new URL(res.headers.get('location')!).pathname).toBe(
        '/platforms/python/integrations/django/http_errors/'
      );
    });

    it('does not redirect developer docs paths', async () => {
      const {middleware} = await importMiddleware({});

      // "/" should NOT redirect to /getting-started/ when not in dev docs mode
      const res = middleware(makeRequest('/some-random-path/'));
      // Should pass through (not a redirect)
      expect(res.status).not.toBe(301);
    });
  });

  describe('pass-through behavior', () => {
    it('does not redirect unknown paths', async () => {
      const {middleware} = await importMiddleware({});

      const res = middleware(makeRequest('/this/path/does/not/exist/'));
      expect(res.status).not.toBe(301);
    });
  });
});
