import type {DocNode} from 'sentry-docs/docTree';
import {describe, expect, it} from 'vitest';

import {landingPageFallbackGuide, platformUrlFor, sanitizeNext} from './utils';

const path = (next: string) => sanitizeNext(next).pathname;
const hash = (next: string) => sanitizeNext(next).hash;
const REJECTED = {pathname: '', hash: ''};

describe('landingPageFallbackGuide', () => {
  const node = (
    slug: string,
    frontmatter: Record<string, unknown> = {},
    children: DocNode[] = []
  ) => ({slug, frontmatter, children, missing: false, path: slug}) as unknown as DocNode;

  const rootNode = node('', {}, [
    node('platforms', {}, [
      node('javascript', {}, [
        node('guides', {}, [
          node('express', {
            inheritCommonContent: false,
            fallbackGuide: 'javascript.node',
          }),
          node('nestjs', {fallbackGuide: 'javascript.node'}),
          node('cordova', {inheritCommonContent: false}),
        ]),
      ]),
    ]),
  ]);

  it('returns the fallback guide of a landing page guide', () => {
    expect(landingPageFallbackGuide(rootNode, 'javascript.express')).toBe(
      'javascript.node'
    );
  });

  it('returns nothing for a guide that inherits the common content', () => {
    expect(landingPageFallbackGuide(rootNode, 'javascript.nestjs')).toBeUndefined();
  });

  it('returns nothing for a landing page guide without a fallback guide', () => {
    expect(landingPageFallbackGuide(rootNode, 'javascript.cordova')).toBeUndefined();
  });

  it('returns nothing for a platform or an unknown guide', () => {
    expect(landingPageFallbackGuide(rootNode, 'javascript')).toBeUndefined();
    expect(landingPageFallbackGuide(rootNode, 'javascript.unknown')).toBeUndefined();
  });
});

describe('sanitizeNext', () => {
  it('should return an empty string for external URLs', () => {
    expect(sanitizeNext('http://example.com')).toEqual(REJECTED);
    expect(sanitizeNext('https://example.com')).toEqual(REJECTED);
    expect(sanitizeNext('//example.com')).toEqual(REJECTED);
  });

  it('should reject backslash-based external URLs', () => {
    // Browsers normalize backslashes to forward slashes, so these would
    // otherwise resolve to an external origin.
    expect(sanitizeNext('/\\example.com')).toEqual(REJECTED);
    expect(sanitizeNext('/\\/example.com')).toEqual(REJECTED);
    expect(sanitizeNext('\\\\example.com')).toEqual(REJECTED);
    expect(sanitizeNext('\\/example.com')).toEqual(REJECTED);
    expect(sanitizeNext('%2F%5Cexample.com')).toEqual(REJECTED);
    expect(sanitizeNext('///example.com')).toEqual(REJECTED);
  });

  it('should reject control characters that resolve to an external origin', () => {
    // The URL parser strips tabs and newlines, so `/<tab>/host` becomes `//host`
    expect(sanitizeNext('/%09/example.com')).toEqual(REJECTED);
    expect(sanitizeNext('/%0a/example.com')).toEqual(REJECTED);
    expect(sanitizeNext('/%0d/example.com')).toEqual(REJECTED);
  });

  it('should never return a protocol-relative path', () => {
    // Stripping unsafe characters must not leave adjacent slashes behind
    expect(path('/,/example.com')).toBe('/examplecom');
    expect(path('/a//b')).toBe('/a/b');
  });

  it('should reject non-http schemes', () => {
    // eslint-disable-next-line no-script-url -- asserting this is rejected
    expect(sanitizeNext('javascript:alert(1)')).toEqual(REJECTED);
    expect(sanitizeNext('data:text/html,x')).toEqual(REJECTED);
  });

  it('should resolve dot segments', () => {
    expect(path('/a/./b')).toBe('/a/b');
    expect(path('/a/../../b')).toBe('/b');
  });

  it('should normalize backslashes within a path', () => {
    expect(path('/path\\to/resource')).toBe('/path/to/resource');
  });

  it('should prepend a slash if missing', () => {
    expect(path('path/to/resource')).toBe('/path/to/resource');
  });

  it('should not modify a valid internal path', () => {
    expect(path('/path/to/resource')).toBe('/path/to/resource');
  });

  it('should remove unsafe characters', () => {
    expect(path('/path/to/resource?query=1')).toBe('/path/to/resource');
  });

  it('should allow alphanumeric and hyphens', () => {
    expect(path('/path-to/resource123')).toBe('/path-to/resource123');
  });

  it('should return an empty string for paths with colons', () => {
    expect(sanitizeNext('/path:to/resource')).toEqual(REJECTED);
  });

  it('should return an empty string for the root path', () => {
    expect(path('/')).toBe('');
  });

  it('should decode URL encoded characters', () => {
    expect(path('/path%2Fwith%2Fslashes')).toBe('/path/with/slashes');
  });

  it('should return an empty string for a malformed URI component', () => {
    expect(sanitizeNext('%E0%A4%A')).toEqual(REJECTED);
  });

  describe('fragments', () => {
    it('should keep the fragment alongside the path', () => {
      expect(sanitizeNext('/configuration/options/#tracing-options')).toEqual({
        pathname: '/configuration/options/',
        hash: '#tracing-options',
      });
    });

    it('should keep the fragment when it arrives percent-encoded', () => {
      expect(sanitizeNext('%2Fconfiguration%2Foptions%2F%23ignoreErrors')).toEqual({
        pathname: '/configuration/options/',
        hash: '#ignoreErrors',
      });
    });

    it('should allow dots in a fragment', () => {
      // e.g. Godot's `godot_logger.event_mask`
      expect(hash('/configuration/options/#godot_logger.event_mask')).toBe(
        '#godot_logger.event_mask'
      );
    });

    it('should keep the fragment out of the path', () => {
      expect(path('/configuration/options/#tracing-options')).toBe(
        '/configuration/options/'
      );
    });

    it('should drop an unrecognized fragment but keep the path', () => {
      expect(sanitizeNext('/configuration/options/#a b')).toEqual({
        pathname: '/configuration/options/',
        hash: '',
      });
      expect(sanitizeNext('/configuration/options/#')).toEqual({
        pathname: '/configuration/options/',
        hash: '',
      });
    });

    it('should not let a fragment smuggle in an origin', () => {
      expect(hash('/a/#@example.com')).toBe('');
      expect(hash('/a/#//example.com')).toBe('');
    });

    it('should not treat a double-encoded fragment as one', () => {
      // `%2523` decodes to `%23`, which is a path character, not a delimiter
      expect(sanitizeNext('/a/%2523b')).toEqual({pathname: '/a/23b', hash: ''});
    });
  });
});

describe('platformUrlFor', () => {
  it('should not leave a double slash between the platform and the path', () => {
    expect(
      platformUrlFor('/platforms/python/', {
        pathname: '/configuration/options/',
        hash: '',
      })
    ).toBe('/platforms/python/configuration/options/');
  });

  it('should append the fragment', () => {
    expect(
      platformUrlFor('/platforms/python/', {
        pathname: '/configuration/options/',
        hash: '#tracing-options',
      })
    ).toBe('/platforms/python/configuration/options/#tracing-options');
  });

  it('should keep the platform URL intact when there is no path', () => {
    expect(platformUrlFor('/platforms/python/', {pathname: '', hash: ''})).toBe(
      '/platforms/python/'
    );
    expect(platformUrlFor('/platforms/python/', {pathname: '', hash: '#x'})).toBe(
      '/platforms/python/#x'
    );
  });
});
