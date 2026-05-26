import {readFile} from 'node:fs/promises';

import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
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
    vi.mocked(readFile).mockResolvedValue(JSON.stringify(SAMPLE_DOCTREE));
  });

  async function callRoute(pathSegments: string[]) {
    const {GET} = await import('./route');
    const request = new Request('https://docs.sentry.io/test');
    return GET(request, {params: Promise.resolve({path: pathSegments})});
  }

  it('returns 404 status', async () => {
    const res = await callRoute(['platforms', 'javascript', 'ai-monitoring.md']);
    expect(res.status).toBe(404);
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
    expect(res.status).toBe(404);
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
});
