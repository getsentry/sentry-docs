import {describe, expect, it} from 'vitest';

import {
  dedupeSlugsBySource,
  isPlatformCommonSource,
  parseDedupeMode,
} from './dedupe';

describe('isPlatformCommonSource', () => {
  it('detects platform common paths', () => {
    expect(
      isPlatformCommonSource(
        'docs/platforms/javascript/common/agent-tracing/index.mdx'
      )
    ).toBe(true);
    expect(
      isPlatformCommonSource('docs/platforms/python/common/tracing/index.mdx')
    ).toBe(true);
    expect(isPlatformCommonSource('docs/product/agents/index.mdx')).toBe(false);
    expect(isPlatformCommonSource(null)).toBe(false);
  });
});

describe('dedupeSlugsBySource', () => {
  const sourceMap = {
    'platforms/javascript/guides/node/agent-tracing':
      'docs/platforms/javascript/common/agent-tracing/index.mdx',
    'platforms/javascript/guides/effect/agent-tracing':
      'docs/platforms/javascript/common/agent-tracing/index.mdx',
    'platforms/javascript/guides/node/configuration':
      'docs/platforms/javascript/common/configuration/index.mdx',
    'product/agents': 'docs/product/agents/index.mdx',
    'product/agents/copy': 'docs/product/agents/index.mdx',
    'api-only-page': null,
  };

  const slugs = [
    'platforms/javascript/guides/node/agent-tracing',
    'platforms/javascript/guides/effect/agent-tracing',
    'platforms/javascript/guides/node/configuration',
    'product/agents',
    'product/agents/copy',
    'api-only-page',
  ];

  it('unique-source keeps one slug per source file', () => {
    const result = dedupeSlugsBySource(slugs, sourceMap, 'unique-source');
    expect(result.slugsToCheck).toEqual([
      'platforms/javascript/guides/node/agent-tracing',
      'platforms/javascript/guides/node/configuration',
      'product/agents',
      'api-only-page',
    ]);
    expect(result.skippedCount).toBe(2);
  });

  it('expand-common keeps every platform common render and still dedupes other sources', () => {
    const result = dedupeSlugsBySource(slugs, sourceMap, 'expand-common');
    expect(result.slugsToCheck).toEqual([
      'platforms/javascript/guides/node/agent-tracing',
      'platforms/javascript/guides/effect/agent-tracing',
      'platforms/javascript/guides/node/configuration',
      'product/agents',
      'api-only-page',
    ]);
    // product/agents/copy is the only non-common duplicate skipped
    expect(result.skippedCount).toBe(1);
    expect(result.slugsToCheck).not.toContain('product/agents/copy');
  });

  it('all keeps every slug', () => {
    const result = dedupeSlugsBySource(slugs, sourceMap, 'all');
    expect(result.slugsToCheck).toEqual(slugs);
    expect(result.skippedCount).toBe(0);
  });
});

describe('parseDedupeMode', () => {
  it('defaults to expand-common', () => {
    expect(parseDedupeMode([])).toBe('expand-common');
  });

  it('parses explicit modes', () => {
    expect(parseDedupeMode(['--skip-deduplication'])).toBe('all');
    expect(parseDedupeMode(['--all-pages'])).toBe('all');
    expect(parseDedupeMode(['--unique-source'])).toBe('unique-source');
    expect(parseDedupeMode(['--expand-common'])).toBe('expand-common');
  });
});
