import {NextRequest} from 'next/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

// Helper to import the middleware module fresh with given env vars.
// isDeveloperDocs and redirectMap are evaluated at module load time,
// so we need a fresh import per env var scenario.
const ENV_KEYS = ['DEVELOPER_DOCS', 'NEXT_PUBLIC_DEVELOPER_DOCS'] as const;

async function importMiddleware(env: Record<string, string> = {}) {
  vi.resetModules();
  vi.unstubAllEnvs();

  // Save originals so we can restore after import
  const saved = new Map<string, string>();
  for (const key of ENV_KEYS) {
    if (key in process.env) {
      saved.set(key, process.env[key]!);
    }
    delete process.env[key];
  }

  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }

  const mod = await import('./middleware');

  vi.unstubAllEnvs();

  // Restore any originals that were deleted
  for (const [key, value] of saved) {
    process.env[key] = value;
  }

  return mod;
}

function makeRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, 'http://localhost:3000'));
}

function isRedirect(res: Response): boolean {
  return res.status === 301 || res.status === 302;
}

describe('middleware redirect set selection', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // "/" only exists in DEVELOPER_DOCS_REDIRECTS, so it's a good signal
  // for which redirect set is active without hardcoding destinations.

  describe('when DEVELOPER_DOCS is set (build-time inline via next.config.ts)', () => {
    it('activates developer docs redirect set', async () => {
      const {middleware} = await importMiddleware({DEVELOPER_DOCS: '1'});
      expect(isRedirect(middleware(makeRequest('/')))).toBe(true);
    });
  });

  describe('when NEXT_PUBLIC_DEVELOPER_DOCS is set (runtime fallback)', () => {
    it('activates developer docs redirect set', async () => {
      const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});
      expect(isRedirect(middleware(makeRequest('/')))).toBe(true);
    });

    it('does not use user docs redirects', async () => {
      const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});
      // user-docs-only path should not redirect in developer docs mode
      expect(isRedirect(middleware(makeRequest('/platforms/python/http_errors/')))).toBe(
        false
      );
    });
  });

  describe('when NEXT_PUBLIC_DEVELOPER_DOCS is not set (docs.sentry.io)', () => {
    it('activates user docs redirect set', async () => {
      const {middleware} = await importMiddleware({});
      // "/" should NOT redirect in user docs mode
      expect(isRedirect(middleware(makeRequest('/')))).toBe(false);
    });

    it('does not use developer docs redirects', async () => {
      const {middleware} = await importMiddleware({});
      // developer-docs-only path "/docs-components/" should not redirect
      expect(isRedirect(middleware(makeRequest('/docs-components/')))).toBe(false);
    });
  });

  describe('pass-through', () => {
    it('does not redirect unknown paths', async () => {
      const {middleware} = await importMiddleware({});
      expect(isRedirect(middleware(makeRequest('/not/a/real/path/')))).toBe(false);
    });

    it('does not redirect unknown paths in developer docs mode', async () => {
      const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});
      expect(isRedirect(middleware(makeRequest('/not/a/real/path/')))).toBe(false);
    });
  });
});
