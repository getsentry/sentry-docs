import {describe, expect, it} from 'vitest';

import {sanitizeNext, sanitizeNextHash} from './utils';

describe('sanitizeNext', () => {
  it('should return an empty string for external URLs', () => {
    expect(sanitizeNext('http://example.com')).toBe('');
    expect(sanitizeNext('https://example.com')).toBe('');
    expect(sanitizeNext('//example.com')).toBe('');
  });

  it('should reject backslash-based external URLs', () => {
    // Browsers normalize backslashes to forward slashes, so these would
    // otherwise resolve to an external origin.
    expect(sanitizeNext('/\\example.com')).toBe('');
    expect(sanitizeNext('/\\/example.com')).toBe('');
    expect(sanitizeNext('\\\\example.com')).toBe('');
    expect(sanitizeNext('\\/example.com')).toBe('');
    expect(sanitizeNext('%2F%5Cexample.com')).toBe('');
    expect(sanitizeNext('///example.com')).toBe('');
  });

  it('should reject control characters that resolve to an external origin', () => {
    // The URL parser strips tabs and newlines, so `/<tab>/host` becomes `//host`
    expect(sanitizeNext('/%09/example.com')).toBe('');
    expect(sanitizeNext('/%0a/example.com')).toBe('');
    expect(sanitizeNext('/%0d/example.com')).toBe('');
  });

  it('should never return a protocol-relative path', () => {
    // Stripping unsafe characters must not leave adjacent slashes behind
    expect(sanitizeNext('/,/example.com')).toBe('/examplecom');
    expect(sanitizeNext('/a//b')).toBe('/a/b');
  });

  it('should reject non-http schemes', () => {
    // eslint-disable-next-line no-script-url -- asserting this is rejected
    expect(sanitizeNext('javascript:alert(1)')).toBe('');
    expect(sanitizeNext('data:text/html,x')).toBe('');
  });

  it('should resolve dot segments', () => {
    expect(sanitizeNext('/a/./b')).toBe('/a/b');
    expect(sanitizeNext('/a/../../b')).toBe('/b');
  });

  it('should normalize backslashes within a path', () => {
    expect(sanitizeNext('/path\\to/resource')).toBe('/path/to/resource');
  });

  it('should prepend a slash if missing', () => {
    expect(sanitizeNext('path/to/resource')).toBe('/path/to/resource');
  });

  it('should not modify a valid internal path', () => {
    expect(sanitizeNext('/path/to/resource')).toBe('/path/to/resource');
  });

  it('should remove unsafe characters', () => {
    expect(sanitizeNext('/path/to/resource?query=1')).toBe('/path/to/resource');
    expect(sanitizeNext('/path/to/resource#hash')).toBe('/path/to/resource');
  });

  it('should allow alphanumeric and hyphens', () => {
    expect(sanitizeNext('/path-to/resource123')).toBe('/path-to/resource123');
  });

  it('should return an empty string for paths with colons', () => {
    expect(sanitizeNext('/path:to/resource')).toBe('');
  });

  it('should return an empty string for the root path', () => {
    expect(sanitizeNext('/')).toBe('');
  });

  it('should decode URL encoded characters', () => {
    expect(sanitizeNext('/path%2Fwith%2Fslashes')).toBe('/path/with/slashes');
  });

  it('should return an empty string for a malformed URI component', () => {
    const input = '%E0%A4%A'; // Malformed URI
    const expectedOutput = '';
    expect(sanitizeNext(input)).toBe(expectedOutput);
  });
});

describe('sanitizeNextHash', () => {
  it('should return an empty string when there is no fragment', () => {
    expect(sanitizeNextHash('/configuration/options/')).toBe('');
    expect(sanitizeNextHash('/configuration/options/#')).toBe('');
  });

  it('should keep the fragment of an encoded next path', () => {
    // `PlatformLink` encodes `next`, so the `#` arrives as `%23`
    expect(sanitizeNextHash('%2Fconfiguration%2Foptions%2F%23ignoreErrors')).toBe(
      '#ignoreErrors'
    );
    expect(sanitizeNextHash('/configuration/options/#tracing-options')).toBe(
      '#tracing-options'
    );
  });

  it('should keep dots and underscores used in option ids', () => {
    expect(sanitizeNextHash('/configuration/options/#godot_logger.event_mask')).toBe(
      '#godot_logger.event_mask'
    );
  });

  it('should remove unsafe characters from the fragment', () => {
    expect(sanitizeNextHash('/path/#a"><script>b')).toBe('#ascriptb');
    expect(sanitizeNextHash('/path/#a/b?c=1')).toBe('#abc1');
  });

  it('should return an empty string for a malformed URI component', () => {
    expect(sanitizeNextHash('/path/#%E0%A4%A')).toBe('');
  });
});
