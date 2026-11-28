import {type NextFetchEvent, NextRequest} from 'next/server';
import {afterEach, describe, expect, it, vi} from 'vitest';

// Helper to import the middleware module fresh with given env vars.
// isDeveloperDocs and redirectMap are evaluated at module load time,
// so we need a fresh import per env var scenario.
const ENV_KEYS = ['NEXT_PUBLIC_DEVELOPER_DOCS'] as const;

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

  describe('when NEXT_PUBLIC_DEVELOPER_DOCS is set', () => {
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

describe('non-production host indexing', () => {
  it('adds a noindex header on localhost', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/java/'));
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex');
  });
});

describe('production build-url redirect to canonical (Deployment Protection off)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function makeHostRequest(
    url: string,
    method = 'GET',
    headers?: HeadersInit
  ): NextRequest {
    return new NextRequest(new URL(url), {method, headers});
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

  it('redirects HEAD requests', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://sentry-docs-abc123.vercel.app/foo/', 'HEAD')
    );
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('https://docs.sentry.io/foo/');
  });

  it('does not redirect non-page requests', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://sentry-docs-abc123.vercel.app/foo/', 'POST')
    );
    expect(res.status).not.toBe(308);
  });

  it('serves a production build URL to the evals pin header', async () => {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = middleware(
      makeHostRequest('https://sentry-docs-abc123.vercel.app/llms.txt', 'GET', {
        'x-sentry-evals-pin': '1',
      })
    );
    expect(res.status).not.toBe(308);
  });
});

describe('redirects for .md exports', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['/product/sentry-basics/sampling.md', '/organization/dynamic-sampling.md'],
    [
      '/platforms/javascript/guides/react/sourcemaps/multiple-origins.md',
      '/platforms/javascript/guides/react/sourcemaps.md',
    ],
    [
      '/pricing/quotas/manage-event-stream-guide/adjusting-quotas.md',
      '/pricing/quotas/manage-event-stream-guide.md#adjusting-quotas',
    ],
  ])('redirects %s to %s', async (from, to) => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest(from));
    expect(isRedirect(res)).toBe(true);
    expect(res.headers.get('location')).toBe(`http://localhost:3000${to}`);
  });

  it('redirects to external destinations unchanged', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/product/sentry-mcp.md'));
    expect(isRedirect(res)).toBe(true);
    expect(res.headers.get('location')).toBe('https://mcp.sentry.dev/');
  });

  it('serves .md exports of pages that are not redirected', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/apple/cocoa.md'));
    expect(isRedirect(res)).toBe(false);
  });
});

describe('canonical Link header on .md responses', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('adds Link rel=canonical pointing to the HTML page for a deep path', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/apple/cocoa.md'));
    expect(res.headers.get('Link')).toContain(
      '<https://docs.sentry.io/platforms/apple/cocoa/>; rel="canonical"'
    );
  });

  it.each([
    '/platforms/java/migration/7.x-to-8.0',
    '/platforms/python/migration/1.x-to-2.x',
  ])('does not add a trailing slash to a dotted document path: %s', async path => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest(`${path}.md`));
    expect(res.headers.get('Link')).toContain(
      `<https://docs.sentry.io${path}>; rel="canonical"`
    );
  });

  it('maps /index.md to the root canonical URL', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/index.md'));
    expect(res.headers.get('Link')).toContain(
      '<https://docs.sentry.io/>; rel="canonical"'
    );
  });

  it('handles top-level .md paths', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms.md'));
    expect(res.headers.get('Link')).toContain(
      '<https://docs.sentry.io/platforms/>; rel="canonical"'
    );
  });

  it('uses develop.sentry.dev origin in developer docs mode', async () => {
    const {middleware} = await importMiddleware({NEXT_PUBLIC_DEVELOPER_DOCS: '1'});
    const res = middleware(makeRequest('/platforms/apple/cocoa.md'));
    expect(res.headers.get('Link')).toContain(
      '<https://develop.sentry.dev/platforms/apple/cocoa/>; rel="canonical"'
    );
  });

  it('uses the Markdown URL itself as canonical for /sitemap.md', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/sitemap.md'));
    expect(res.headers.get('Link')).toContain(
      '<https://docs.sentry.io/sitemap.md>; rel="canonical"'
    );
  });

  it('adds Vary: Accept to .md responses', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/apple/cocoa.md'));
    expect(res.headers.get('Vary')).toBe('Accept');
  });
});

describe('HTML pages advertise their Markdown version', () => {
  it('links the Markdown export and llms.txt', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/platforms/apple/cocoa/'));
    expect(res.headers.get('Link')).toBe(
      '<https://docs.sentry.io/platforms/apple/cocoa.md>; rel="alternate"; type="text/markdown", ' +
        '<https://docs.sentry.io/llms.txt>; rel="describedby"'
    );
  });

  it('maps the root page to /index.md', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(makeRequest('/'));
    expect(res.headers.get('Link')).toContain(
      '<https://docs.sentry.io/index.md>; rel="alternate"; type="text/markdown"'
    );
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

describe('content negotiation on page URLs', () => {
  function pageRequest(headers: Record<string, string>): NextRequest {
    return new NextRequest(new URL('/platforms/apple/cocoa/', 'http://localhost:3000'), {
      headers,
    });
  }

  it('serves Markdown with Vary and canonical headers', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(pageRequest({Accept: 'text/markdown, text/html, */*'}));
    expect(res.headers.get('x-middleware-rewrite')).toContain(
      '/platforms/apple/cocoa.md'
    );
    expect(res.headers.get('Vary')).toBe('Accept, User-Agent');
    expect(res.headers.get('Link')).toBe(
      '<https://docs.sentry.io/platforms/apple/cocoa/>; rel="canonical", ' +
        '<https://docs.sentry.io/llms.txt>; rel="describedby"'
    );
  });

  it('serves HTML when the client ranks HTML above Markdown', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(pageRequest({Accept: 'text/html, text/markdown;q=0.9'}));
    expect(res.headers.get('x-middleware-rewrite')).toBeNull();
  });

  it('serves Markdown to a recognized AI agent with no format preference', async () => {
    const {middleware} = await importMiddleware({});
    const res = middleware(pageRequest({'User-Agent': 'Claude-User', Accept: '*/*'}));
    expect(res.headers.get('x-middleware-rewrite')).toContain('.md');
  });

  // The headers middleware sees: Next.js strips `RSC` before middleware runs.
  it.each([
    ['opens a page', 'text/html,*/*;q=0.8', 'document', 'navigate'],
    ['follows a link', '*/*', 'empty', 'cors'],
  ])(
    'serves the page, not Markdown, when an in-app browser %s',
    async (_, accept, dest, mode) => {
      const {middleware} = await importMiddleware({});
      const res = middleware(
        pageRequest({
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.5.0 Chrome/136.0.0.0 Safari/537.36',
          Accept: accept,
          'Sec-Fetch-Dest': dest,
          'Sec-Fetch-Mode': mode,
        })
      );
      expect(res.headers.get('x-middleware-rewrite')).toBeNull();
    }
  );

  it.each([
    [
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
      {},
    ],
    [
      'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
      {'Sec-Fetch-Dest': 'document', 'Sec-Fetch-Mode': 'navigate'},
    ],
  ])('serves Markdown to %s when it asks for HTML', async (userAgent, secFetch) => {
    const {middleware} = await importMiddleware({});
    const res = middleware(
      pageRequest({
        'User-Agent': userAgent,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...secFetch,
      })
    );
    expect(res.headers.get('x-middleware-rewrite')).toContain('.md');
  });
});

describe('reporting AI agent visits to Profound', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  const CHATGPT_USER =
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot';

  async function visit(userAgent: string) {
    const {middleware} = await importMiddleware({});
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('PROFOUND_LOG_TOKEN', 'test-token');
    const fetchMock = vi.fn().mockResolvedValue(Response.json({}));
    vi.stubGlobal('fetch', fetchMock);
    const waitUntil = vi.fn();
    middleware(
      new NextRequest('https://docs.sentry.io/platforms/apple/cocoa/', {
        headers: {'User-Agent': userAgent, 'x-real-ip': '203.0.113.7'},
      }),
      {waitUntil} as unknown as NextFetchEvent
    );
    return {fetchMock, waitUntil};
  }

  it('reports an AI agent visit without delaying the response', async () => {
    const {fetchMock, waitUntil} = await visit(CHATGPT_USER);

    expect(waitUntil).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://artemis.api.tryprofound.com/v1/logs/custom');
    expect(init.headers['x-api-key']).toBe('test-token');
    expect(JSON.parse(init.body)).toEqual([
      {
        timestamp: expect.any(String),
        method: 'GET',
        host: 'docs.sentry.io',
        path: '/platforms/apple/cocoa/',
        status_code: 200,
        ip: '203.0.113.7',
        user_agent: CHATGPT_USER,
      },
    ]);
  });

  it.each([
    [
      'a person in Chrome',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    ],
    [
      'the Claude desktop app',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Claude/1.5.0 Chrome/131.0.0.0 Electron/33.0.0 Safari/537.36',
    ],
    [
      'Googlebot',
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    ],
  ])('reports nothing for %s', async (_name, userAgent) => {
    const {fetchMock} = await visit(userAgent);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
