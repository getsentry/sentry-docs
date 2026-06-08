import {readFile} from 'node:fs/promises';

import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
}));

// Stable mock fn (via vi.hoisted) so assertions survive the vi.resetModules() in
// beforeEach, which otherwise re-runs the mock factory with a fresh spy.
const {metricsCount} = vi.hoisted(() => ({
  metricsCount: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => ({
  metrics: {count: metricsCount},
}));

const SAMPLE_DOCTREE = {
  path: '',
  slug: '',
  frontmatter: {title: 'Home'},
  children: [
    {
      path: 'platforms',
      slug: 'platforms',
      frontmatter: {title: 'Platforms'},
      children: [
        {
          path: 'platforms/javascript',
          slug: 'javascript',
          frontmatter: {title: 'Browser JavaScript'},
          children: [
            {
              path: 'platforms/javascript/install',
              slug: 'install',
              frontmatter: {title: 'Installation Methods'},
            },
            {
              path: 'platforms/javascript/usage',
              slug: 'usage',
              frontmatter: {title: 'Capturing Errors'},
            },
            {
              path: 'platforms/javascript/tracing',
              slug: 'tracing',
              frontmatter: {title: 'Set Up Tracing'},
            },
          ],
        },
        {
          path: 'platforms/python',
          slug: 'python',
          frontmatter: {title: 'Python'},
          children: [],
        },
      ],
    },
  ],
};

describe('md-exports 404 catch-all route', () => {
  beforeEach(() => {
    vi.resetModules();
    metricsCount.mockClear();
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(SAMPLE_DOCTREE));
  });

  async function callRoute(pathSegments: string[], userAgent?: string) {
    const {GET} = await import('./route');
    const request = new Request('https://docs.sentry.io/test', {
      headers: userAgent ? {'user-agent': userAgent} : {},
    });
    return GET(request, {params: Promise.resolve({path: pathSegments})});
  }

  // Intentionally 200, not 404: agent fetchers (e.g. Claude Code's WebFetch) drop the
  // response body on non-2xx, which would strip the helpful not-found content. The
  // not-found signal lives in the body and the X-Sentry-Docs-Not-Found header instead.
  it('returns 200 status so agent fetchers keep the body', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    expect(res.status).toBe(200);
  });

  it('marks the soft miss with noindex and a not-found header', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    expect(res.headers.get('X-Robots-Tag')).toBe('noindex');
    expect(res.headers.get('X-Sentry-Docs-Not-Found')).toBe('1');
  });

  it('returns text/markdown content type', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    expect(res.headers.get('Content-Type')).toBe('text/markdown; charset=utf-8');
  });

  it('includes the requested path in the body', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    const body = await res.text();
    expect(body).toContain('/platforms/javascript/ai-monitoring');
  });

  it('includes sibling pages from the parent section', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    const body = await res.text();
    expect(body).toContain('Installation Methods');
    expect(body).toContain('Capturing Errors');
    expect(body).toContain('Set Up Tracing');
    expect(body).toContain('Pages in Browser JavaScript');
  });

  it('includes navigation links to llms.txt and index.md', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    const body = await res.text();
    expect(body).toContain('llms.txt');
    expect(body).toContain('index.md');
    expect(body).toContain('platforms.md');
  });

  it('walks up the tree when the immediate parent does not exist', async () => {
    const res = await callRoute([
      'platforms',
      'javascript',
      'nonexistent',
      'deep',
      'path.md',
    ]);
    const body = await res.text();
    expect(body).toContain('Pages in Browser JavaScript');
  });

  it('falls back to top-level sections when nothing matches', async () => {
    const res = await callRoute(['completely', 'unknown', 'path.md']);
    const body = await res.text();
    expect(body).not.toContain('Pages in');
    expect(body).toContain('Find what you need');
  });

  it('handles doctree load failure gracefully', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('file not found'));
    const res = await callRoute(['platforms', 'javascript', 'foo.md']);
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain('Page Not Found');
    expect(body).toContain('llms.txt');
  });

  it('includes YAML frontmatter', async () => {
    const res = await callRoute(['platforms', 'javascript', 'foo.md']);
    const body = await res.text();
    expect(body).toMatch(/^---\n/);
    expect(body).toContain('title: "Page Not Found"');
    expect(body).toContain('url: "https://docs.sentry.io/platforms/javascript/foo"');
  });

  it('emits a not-found metric with the full path and normalized agent', async () => {
    await callRoute(
      ['platforms', 'javascript', 'made', 'up', 'page.md'],
      'Claude-User (claude-code/2.1.165; +https://support.anthropic.com/)'
    );
    expect(metricsCount).toHaveBeenCalledWith(
      'docs.md_export.not_found',
      1,
      expect.objectContaining({
        attributes: {
          requested_path: 'platforms/javascript/made/up/page',
          has_suggestions: true,
          agent: 'claude',
        },
      })
    );
  });

  it('falls back to "other" for unrecognized agents', async () => {
    await callRoute(['platforms', 'javascript', 'foo.md'], 'Mozilla/5.0');
    expect(metricsCount).toHaveBeenCalledWith(
      'docs.md_export.not_found',
      1,
      expect.objectContaining({attributes: expect.objectContaining({agent: 'other'})})
    );
  });
});
