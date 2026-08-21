import {describe, expect, test} from 'vitest';

import {allowedContentPath, canonicalPath, safeDocumentationUrl} from './fix-broken-link';

describe('broken-link fixer boundaries', () => {
  test('accepts only normalized MD/MDX content paths', () => {
    expect(allowedContentPath('docs/product/issues/index.mdx')).toBe(true);
    expect(allowedContentPath('includes/example.md')).toBe(true);
    expect(allowedContentPath('docs/../README.md')).toBe(false);
    expect(allowedContentPath('/tmp/example.mdx')).toBe(false);
    expect(allowedContentPath('.github/workflows/test.yml')).toBe(false);
  });

  test('accepts safe exact redirect paths and rejects code injection characters', () => {
    expect(canonicalPath('/product/old')).toBe('/product/old/');
    expect(() => canonicalPath("/product/bad'path/")).toThrow();
    expect(() => canonicalPath('/product/bad\npath/')).toThrow();
    expect(() => canonicalPath('/product/:path*/')).toThrow();
    expect(() => canonicalPath('//evil.example/path')).toThrow();
  });

  test('reconstructs safe URLs and rejects query, fragment, and credential injection', () => {
    expect(safeDocumentationUrl('https://docs.sentry.io/product/issues/')).toBe(
      'https://docs.sentry.io/product/issues/'
    );
    expect(() =>
      safeDocumentationUrl('https://docs.sentry.io/product/?value=<Component/>')
    ).toThrow();
    expect(() =>
      safeDocumentationUrl('https://docs.sentry.io/product/#"><Component/>')
    ).toThrow();
    expect(() =>
      safeDocumentationUrl('https://user:pass@docs.sentry.io/product/')
    ).toThrow();
    expect(() => safeDocumentationUrl('/product/\n<Component/>')).toThrow();
  });
});
