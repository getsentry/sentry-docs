import {describe, expect, it} from 'vitest';

import {formatRuntimeYaml, quickStartRuntimes} from './quick-start-runtimes.mjs';

const ORIGIN = 'https://docs.sentry.io';

const page = (path, runtime, children = []) => ({
  slug: path.split('/').pop(),
  path,
  frontmatter: runtime ? {title: path, runtime} : {title: path},
  children,
});

const docTree = guides => ({
  slug: '',
  children: [
    {
      slug: 'platforms',
      children: [
        {
          slug: 'javascript',
          path: 'platforms/javascript',
          children: [{slug: 'guides', children: guides}],
        },
      ],
    },
  ],
});

const G = 'platforms/javascript/guides';

describe('quickStartRuntimes', () => {
  it('groups a guide quick start with the runtime quick starts below it', () => {
    const tree = docTree([
      page(`${G}/nextjs`, 'node', [
        page(`${G}/nextjs/cloudflare`, 'cloudflare'),
        page(`${G}/nextjs/manual-setup`),
      ]),
    ]);
    const runtimes = quickStartRuntimes(tree, ORIGIN);

    expect(runtimes.get(`${G}/nextjs`)).toEqual({
      runtime: 'node',
      runtimes: [{runtime: 'cloudflare', url: `${ORIGIN}/${G}/nextjs/cloudflare.md`}],
    });
    expect(runtimes.get(`${G}/nextjs/cloudflare`)).toEqual({
      runtime: 'cloudflare',
      runtimes: [{runtime: 'node', url: `${ORIGIN}/${G}/nextjs.md`}],
    });
    expect(runtimes.has(`${G}/nextjs/manual-setup`)).toBe(false);
  });

  it('groups the runtime guides of a platform', () => {
    const tree = docTree([
      page(`${G}/bun`, 'bun'),
      page(`${G}/node`, 'node'),
      page(`${G}/nextjs`, 'node', [page(`${G}/nextjs/cloudflare`, 'cloudflare')]),
      page(`${G}/react`),
    ]);
    const runtimes = quickStartRuntimes(tree, ORIGIN);

    expect(runtimes.get(`${G}/node`)).toEqual({
      runtime: 'node',
      runtimes: [{runtime: 'bun', url: `${ORIGIN}/${G}/bun.md`}],
    });
    expect(runtimes.get(`${G}/nextjs`).runtimes).toEqual([
      {runtime: 'cloudflare', url: `${ORIGIN}/${G}/nextjs/cloudflare.md`},
    ]);
    expect(runtimes.has(`${G}/react`)).toBe(false);
  });

  it('gives a runtime quick start without other runtimes an empty list', () => {
    const tree = docTree([
      page(`${G}/hono`, undefined, [page(`${G}/hono/cloudflare`, 'cloudflare')]),
    ]);

    expect(quickStartRuntimes(tree, ORIGIN).get(`${G}/hono/cloudflare`)).toEqual({
      runtime: 'cloudflare',
      runtimes: [],
    });
  });
});

describe('formatRuntimeYaml', () => {
  it('writes the runtime and the other runtimes', () => {
    expect(
      formatRuntimeYaml({
        runtime: 'cloudflare',
        runtimes: [{runtime: 'node', url: `${ORIGIN}/${G}/nextjs.md`}],
      })
    ).toBe(
      [
        'runtime: cloudflare',
        'runtimes:',
        '  - runtime: node',
        `    url: ${ORIGIN}/${G}/nextjs.md`,
        '',
      ].join('\n')
    );
  });

  it('writes only the runtime when there are no other runtimes', () => {
    expect(formatRuntimeYaml({runtime: 'cloudflare', runtimes: []})).toBe(
      'runtime: cloudflare\n'
    );
  });

  it('writes nothing for a page without a runtime', () => {
    expect(formatRuntimeYaml({})).toBe('');
  });
});
