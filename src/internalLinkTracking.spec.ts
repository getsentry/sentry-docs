import {describe, expect, test} from 'vitest';

import {
  getDocsSection,
  getInternalLinkClickProps,
  normalizeDocsPath,
} from './internalLinkTracking';

const CONCEPT_PAGE = 'https://docs.sentry.io/concepts/key-terms/tracing/';

describe('normalizeDocsPath', () => {
  test('adds a trailing slash to page paths', () => {
    expect(normalizeDocsPath('/product/logs')).toBe('/product/logs/');
    expect(normalizeDocsPath('/product/logs/')).toBe('/product/logs/');
  });

  test('leaves file-like paths untouched', () => {
    expect(normalizeDocsPath('/llms.txt')).toBe('/llms.txt');
  });
});

describe('getDocsSection', () => {
  test('returns the top-level section', () => {
    expect(getDocsSection('/concepts/key-terms/tracing/')).toBe('concepts');
    expect(getDocsSection('/product/trace-explorer/')).toBe('product');
  });

  test('returns home for the root path', () => {
    expect(getDocsSection('/')).toBe('home');
  });
});

describe('getInternalLinkClickProps', () => {
  test('reports source and destination for an internal link', () => {
    expect(
      getInternalLinkClickProps('/product/trace-explorer/#browsing', CONCEPT_PAGE)
    ).toEqual({
      sourcePath: '/concepts/key-terms/tracing/',
      sourceSection: 'concepts',
      destinationPath: '/product/trace-explorer/',
      destinationSection: 'product',
    });
  });

  test('resolves relative links and normalizes trailing slashes', () => {
    expect(getInternalLinkClickProps('distributed-tracing', CONCEPT_PAGE)).toEqual({
      sourcePath: '/concepts/key-terms/tracing/',
      sourceSection: 'concepts',
      destinationPath: '/concepts/key-terms/tracing/distributed-tracing/',
      destinationSection: 'concepts',
    });
  });

  test('ignores query strings on the source page', () => {
    expect(
      getInternalLinkClickProps('/product/', `${CONCEPT_PAGE}?utm_source=test`)
    ).toMatchObject({sourcePath: '/concepts/key-terms/tracing/'});
  });

  test('ignores links to the current page', () => {
    expect(getInternalLinkClickProps('#spans', CONCEPT_PAGE)).toBeNull();
    expect(
      getInternalLinkClickProps('/concepts/key-terms/tracing#spans', CONCEPT_PAGE)
    ).toBeNull();
  });

  test('ignores other origins and non-HTTP links', () => {
    expect(
      getInternalLinkClickProps('https://sentry.io/pricing/', CONCEPT_PAGE)
    ).toBeNull();
    expect(getInternalLinkClickProps('mailto:docs@sentry.io', CONCEPT_PAGE)).toBeNull();
  });
});
