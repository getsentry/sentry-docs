import {NextRequest} from 'next/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

// Helper to import the middleware module fresh with given env vars.
// isDeveloperDocs and redirectMap are evaluated at module load time,
// so we need a fresh import per env var scenario.
async function importMiddleware(env: Record<string, string | undefined> = {}) {
  vi.resetModules();

  const originalEnv = {...process.env};
  delete process.env.DEVELOPER_DOCS_;
  delete process.env.NEXT_PUBLIC_DEVELOPER_DOCS;
  Object.assign(process.env, env);

  const mod = await import('./middleware');

  process.env = originalEnv;

  return mod;
}

function makeRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, 'http://localhost:3000'));
}

function isRedirect(res: Response): boolean {
  return res.status === 301 || res.status === 302;
}

describe('middleware redirect set selection', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // "/" only exists in DEVELOPER_DOCS_REDIRECTS, so it's a good signal
  // for which redirect set is active without hardcoding destinations.

  describe('DEVELOPER_DOCS_ env var (edge build-time inline)', () => {
    it('activates developer docs redirect set', async () => {
      const {middleware} = await importMiddleware({DEVELOPER_DOCS_: '1'});

      // "/" is a developer-docs-only redirect
      expect(isRedirect(middleware(makeRequest('/')))).toBe(true);
    });
  });

  describe('NEXT_PUBLIC_DEVELOPER_DOCS env var (node runtime fallback)', () => {
    it('activates developer docs redirect set', async () => {
      const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});

      expect(isRedirect(middleware(makeRequest('/')))).toBe(true);
    });
  });

  describe('no developer docs env var (user docs mode)', () => {
    it('activates user docs redirect set', async () => {
      const {middleware} = await importMiddleware({});

      // "/" should NOT redirect in user docs mode
      expect(isRedirect(middleware(makeRequest('/')))).toBe(false);
    });
  });

  describe('pass-through', () => {
    it('does not redirect unknown paths', async () => {
      const {middleware} = await importMiddleware({});
      expect(isRedirect(middleware(makeRequest('/not/a/real/path/')))).toBe(false);
    });

    it('does not redirect unknown paths in developer docs mode', async () => {
      const {middleware} = await importMiddleware({DEVELOPER_DOCS_: '1'});
      expect(isRedirect(middleware(makeRequest('/not/a/real/path/')))).toBe(false);
    });
  });
});
