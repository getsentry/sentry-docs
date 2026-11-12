import {readFileSync} from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';

import {
  frameworkNodes,
  integrationFrameworkSlugs,
  slugsFromWebFrameworksSection,
} from './platform-frameworks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const visibleChildren = node =>
  (node.children || []).filter(child => child.frontmatter?.title);

describe('slugsFromWebFrameworksSection', () => {
  it('reads the Python Web Frameworks table in page order', () => {
    const source = readFileSync(
      path.join(root, 'docs/platforms/python/integrations/index.mdx'),
      'utf8'
    );
    expect(slugsFromWebFrameworksSection(source, 'python')).toEqual([
      'django',
      'flask',
      'fastapi',
      'aiohttp',
      'bottle',
      'falcon',
      'pyramid',
      'quart',
      'sanic',
      'starlette',
      'starlite',
      'litestar',
      'tornado',
    ]);
  });

  it('stops at the next heading', () => {
    const source = [
      '### Web Frameworks',
      '',
      '[Django](/platforms/python/integrations/django/)',
      '',
      '### Databases',
      '',
      '[Redis](/platforms/python/integrations/redis/)',
      '',
    ].join('\n');
    expect(slugsFromWebFrameworksSection(source, 'python')).toEqual(['django']);
  });
});

describe('integrationFrameworkSlugs', () => {
  it('uses the Elixir fallback when the page has no Web Frameworks section', () => {
    const source = readFileSync(
      path.join(root, 'docs/platforms/elixir/integrations/index.mdx'),
      'utf8'
    );
    expect(integrationFrameworkSlugs('elixir', source)).toEqual(['plug_and_phoenix']);
  });
});

describe('frameworkNodes', () => {
  it('prefers guides when a platform has them', () => {
    const next = {slug: 'nextjs', frontmatter: {title: 'Next.js'}};
    const platform = {
      slug: 'javascript',
      frontmatter: {showIntegrationsInSearch: true},
      children: [{slug: 'guides', children: [next]}],
    };
    expect(frameworkNodes(platform, {root, visibleChildren})).toEqual([next]);
  });

  it('lists Python web frameworks and skips other integrations', () => {
    const platform = {
      slug: 'python',
      frontmatter: {showIntegrationsInSearch: true},
      children: [
        {
          slug: 'integrations',
          children: ['django', 'redis', 'flask'].map(slug => ({
            slug,
            frontmatter: {title: slug},
          })),
        },
      ],
    };
    expect(
      frameworkNodes(platform, {root, visibleChildren}).map(node => node.slug)
    ).toEqual(['django', 'flask']);
  });
});
