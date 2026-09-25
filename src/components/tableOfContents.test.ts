/**
 * Tests for the safe hash-decoding logic used in TableOfContents.
 *
 * The component calls decodeURIComponent on the URL fragment so that element
 * IDs containing non-ASCII characters can be found. When the fragment contains
 * invalid percent-encoding (e.g. an unsubstituted template variable such as
 * `%SENTRY_ENVIRONMENT`, where `%S` is not valid hex), decodeURIComponent
 * throws a URIError.  The component wraps the call in a try-catch and falls
 * back to the raw hash value – this file verifies that contract at the logic
 * level without requiring a DOM environment.
 */

import {describe, expect, it} from 'vitest';

/** Mirrors the safe-decode logic in tableOfContents.tsx */
function safeDecodeHash(hash: string): string {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

describe('safeDecodeHash', () => {
  it('decodes a valid percent-encoded fragment', () => {
    expect(safeDecodeHash('#hello%20world')).toBe('hello world');
  });

  it('returns the raw value for a plain fragment with no encoding', () => {
    expect(safeDecodeHash('#my-section')).toBe('my-section');
  });

  it('falls back to the raw value when the fragment contains invalid percent-encoding', () => {
    // %SENTRY_ENVIRONMENT is an unsubstituted template variable; %S is not
    // valid hex so decodeURIComponent would throw a URIError without the guard.
    expect(() => decodeURIComponent('dsn%SENTRY_ENVIRONMENT')).toThrow(URIError);
    expect(safeDecodeHash('#dsn%SENTRY_ENVIRONMENT')).toBe('dsn%SENTRY_ENVIRONMENT');
  });

  it('handles an empty hash gracefully', () => {
    expect(safeDecodeHash('#')).toBe('');
  });

  it('decodes non-ASCII characters in a fragment', () => {
    expect(safeDecodeHash('#%E4%B8%AD%E6%96%87')).toBe('中文');
  });
});
