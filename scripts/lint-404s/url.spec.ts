import {describe, expect, test} from 'vitest';

import {resolveLinkUrl} from './url';

describe('resolveLinkUrl', () => {
  const pageUrl = new URL('http://localhost:3000/platforms/javascript/');

  test('resolves hrefs without a protocol as relative URLs', () => {
    expect(resolveLinkUrl('example.com', pageUrl)?.href).toBe(
      'http://localhost:3000/platforms/javascript/example.com'
    );
  });

  test('returns null for malformed URLs', () => {
    expect(resolveLinkUrl('http://[', pageUrl)).toBeNull();
  });
});
