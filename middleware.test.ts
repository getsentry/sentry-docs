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

describe('production build-url redirect to canonical (Deployment Protection off)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function makeHostRequest(url: string, method = 'GET'): NextRequest {
    return new NextRequest(new URL(url), {method});
  }

  it('redirects a non-canonical production host to the canonical host', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://sentry-docs-abc123.vercel.app/platforms/javascript/')
    );
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe(
      'https://docs.sentry.io/platforms/javascript/'
    );
  });

  it('preserves query strings when redirecting', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://sentry-docs-git-master-getsentry.vercel.app/search/?q=x')
    );
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('https://docs.sentry.io/search/?q=x');
  });

  it('redirects to develop.sentry.dev in developer docs mode', async () => {
    const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://develop-docs-abc123.vercel.app/getting-started/')
    );
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe(
      'https://develop.sentry.dev/getting-started/'
    );
  });

  it('does not redirect requests already on the canonical host', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(makeHostRequest('https://docs.sentry.io/platforms/'));
    expect(res.status).not.toBe(308);
  });

  it('leaves preview deployments accessible (no redirect)', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'preview');
    const res = middleware(
      makeHostRequest('https://sentry-docs-git-my-branch.sentry.dev/getting-started/')
    );
    expect(res.status).not.toBe(308);
  });

  it('does nothing locally (VERCEL_ENV unset)', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', '');
    const res = middleware(makeHostRequest('https://sentry-docs-abc123.vercel.app/foo/'));
    expect(res.status).not.toBe(308);
  });

  it('does not redirect non-GET requests', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://sentry-docs-abc123.vercel.app/foo/', 'POST')
    );
    expect(res.status).not.toBe(308);
  });
});

describe('canonical Link header on .md responses', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('adds Link rel=canonical pointing to the HTML page for a deep path', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/apple/cocoa.md'));
    expect(res.headers.get('Link')).toBe(
      '<https://docs.sentry.io/platforms/apple/cocoa/>; rel="canonical"'
    );
  });

  it('maps /index.md to the root canonical URL', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/index.md'));
    expect(res.headers.get('Link')).toBe('<https://docs.sentry.io/>; rel="canonical"');
  });

  it('handles top-level .md paths', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms.md'));
    expect(res.headers.get('Link')).toBe(
      '<https://docs.sentry.io/platforms/>; rel="canonical"'
    );
  });

  it('uses develop.sentry.dev origin in developer docs mode', async () => {
    const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});
    const res = middleware(makeRequest('/platforms/apple/cocoa.md'));
    expect(res.headers.get('Link')).toBe(
      '<https://develop.sentry.dev/platforms/apple/cocoa/>; rel="canonical"'
    );
  });

  it('does not add Link header for non-.md paths', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/apple/cocoa/'));
    expect(res.headers.get('Link')).toBeNull();
  });
});

describe('wantsMarkdownViaAccept: text/plain no longer triggers markdown', () => {
  it('does not serve markdown for Accept: application/json, text/plain, */*', async () => {
    const {middleware} = await importMiddleware({});
    const req = new NextRequest(
      new URL('/platforms/apple/cocoa/', 'http://localhost:3000'),
      {
        headers: {Accept: 'application/json, text/plain, */*'},
      }
    );
    const res = middleware(req);
    // Should not rewrite to .md — Next rewrite changes the URL; a plain next() keeps it
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('still serves markdown for explicit text/markdown Accept header', async () => {
    const {middleware} = await importMiddleware({});
    const req = new NextRequest(
      new URL('/platforms/apple/cocoa/', 'http://localhost:3000'),
      {
        headers: {Accept: 'text/markdown'},
      }
    );
    const res = middleware(req);
    // A rewrite to .md will set x-middleware-rewrite
    expect(res.headers.get('x-middleware-rewrite')).toContain('.md');
  });
});
