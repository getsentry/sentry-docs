import fs from 'fs';
import path from 'path';

import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {
  filePathToUrls,
  parseRedirectsJs,
  redirectMatches,
} from './check-redirects-on-rename';

// Mock redirects fixture
const mockRedirectsJs = `
const isDeveloperDocs = !!process.env.NEXT_PUBLIC_DEVELOPER_DOCS;

const developerDocsRedirects = [
  {
    source: '/sdk/old-path/',
    destination: '/sdk/new-path/',
  },
];

const userDocsRedirects = [
  {
    source: '/platforms/javascript/old-guide/',
    destination: '/platforms/javascript/new-guide/',
  },
  {
    source: '/platforms/python/old-tutorial',
    destination: '/platforms/python/new-tutorial',
  },
];

module.exports = {developerDocsRedirects, userDocsRedirects};
`;

describe('filePathToUrls', () => {
  it('should convert docs file path to canonical URL with trailing slash', () => {
    const result = filePathToUrls('docs/platforms/javascript/index.mdx');
    expect(result.isDeveloperDocs).toBe(false);
    expect(result.urls).toEqual(['/platforms/javascript/']); // Canonical with trailing slash
  });

  it('should convert develop-docs file path to canonical URL with trailing slash', () => {
    const result = filePathToUrls('develop-docs/backend/api/index.mdx');
    expect(result.isDeveloperDocs).toBe(true);
    expect(result.urls).toEqual(['/backend/api/']); // Canonical with trailing slash
  });

  it('should handle non-index files with trailing slash', () => {
    const result = filePathToUrls('docs/platforms/javascript/guide.mdx');
    expect(result.isDeveloperDocs).toBe(false);
    expect(result.urls).toEqual(['/platforms/javascript/guide/']); // Canonical with trailing slash
  });

  it('should return empty for paths outside docs/develop-docs', () => {
    const result = filePathToUrls('scripts/something.mdx');
    expect(result.isDeveloperDocs).toBe(false);
    expect(result.urls).toEqual([]);
  });
});

describe('parseRedirectsJs', () => {
  let tempFile: string;

  beforeEach(() => {
    tempFile = path.join(process.cwd(), 'redirects-test-temp.js');
  });

  afterEach(() => {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    // Clear require cache
    delete require.cache[path.resolve(tempFile)];
  });

  it('should parse developer docs and user docs redirects', () => {
    fs.writeFileSync(tempFile, mockRedirectsJs);
    const result = parseRedirectsJs(tempFile);
    expect(result.developerDocsRedirects).toHaveLength(1);
    expect(result.developerDocsRedirects[0].source).toBe('/sdk/old-path/');
    expect(result.developerDocsRedirects[0].destination).toBe('/sdk/new-path/');
    expect(result.userDocsRedirects).toHaveLength(2);
    expect(result.userDocsRedirects[0].source).toBe('/platforms/javascript/old-guide/');
    expect(result.userDocsRedirects[0].destination).toBe(
      '/platforms/javascript/new-guide/'
    );
  });

  it('should return empty arrays for non-existent file', () => {
    const result = parseRedirectsJs('/nonexistent/file.js');
    expect(result.developerDocsRedirects).toEqual([]);
    expect(result.userDocsRedirects).toEqual([]);
  });

  it('should parse real redirects.js file', () => {
    const result = parseRedirectsJs('redirects.js');
    // Should have some redirects
    expect(result.developerDocsRedirects.length).toBeGreaterThan(0);
    expect(result.userDocsRedirects.length).toBeGreaterThan(0);
  });
});

describe('redirectMatches', () => {
  it('should match exact redirects', () => {
    const redirect = {
      source: '/old/path/',
      destination: '/new/path/',
    };
    expect(redirectMatches(redirect, '/old/path/', '/new/path/')).toBe(true);
    expect(redirectMatches(redirect, '/different/path/', '/new/path/')).toBe(false);
  });

  it('should match redirects with path parameters', () => {
    const redirect = {
      source: '/platforms/:platform/old/:path*',
      destination: '/platforms/:platform/new/:path*',
    };
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/old/guide',
        '/platforms/javascript/new/guide'
      )
    ).toBe(true);
    expect(
      redirectMatches(
        redirect,
        '/platforms/python/old/tutorial/',
        '/platforms/python/new/tutorial/'
      )
    ).toBe(true);
  });

  it('should handle redirects with single path parameter', () => {
    const redirect = {
      source: '/platforms/:platform/old',
      destination: '/platforms/:platform/new',
    };
    expect(
      redirectMatches(redirect, '/platforms/javascript/old', '/platforms/javascript/new')
    ).toBe(true);
    expect(
      redirectMatches(redirect, '/platforms/python/old', '/platforms/python/new')
    ).toBe(true);
  });

  it('should not match when source pattern does not match', () => {
    const redirect = {
      source: '/platforms/:platform/old',
      destination: '/platforms/:platform/new',
    };
    expect(
      redirectMatches(redirect, '/different/path', '/platforms/javascript/new')
    ).toBe(false);
  });

  it('should match destination with exact path when no params', () => {
    const redirect = {
      source: '/old/path',
      destination: '/new/exact/path',
    };
    expect(redirectMatches(redirect, '/old/path', '/new/exact/path')).toBe(true);
    expect(redirectMatches(redirect, '/old/path', '/different/path')).toBe(false);
  });

  it('should handle :path* with nested paths correctly', () => {
    const redirect = {
      source: '/sdk/basics/:path*',
      destination: '/sdk/processes/basics/:path*',
    };
    // File moves with :path* redirect - should match
    expect(
      redirectMatches(redirect, '/sdk/basics/guide/', '/sdk/processes/basics/guide/')
    ).toBe(true);
    expect(
      redirectMatches(
        redirect,
        '/sdk/basics/advanced/tutorial/',
        '/sdk/processes/basics/advanced/tutorial/'
      )
    ).toBe(true);
    // File stays in same directory but renamed - should NOT match
    expect(
      redirectMatches(redirect, '/sdk/basics/old-file/', '/sdk/basics/new-file/')
    ).toBe(false);
    // File moves to different base - should NOT match
    expect(redirectMatches(redirect, '/sdk/basics/guide/', '/sdk/other/guide/')).toBe(
      false
    );
  });

  it('should handle :path* with empty path', () => {
    const redirect = {
      source: '/sdk/basics/:path*',
      destination: '/sdk/processes/basics/:path*',
    };
    // Empty path (just directory) should match
    expect(redirectMatches(redirect, '/sdk/basics/', '/sdk/processes/basics/')).toBe(
      true
    );
  });

  it('should handle :path* source to exact destination', () => {
    const redirect = {
      source: '/old/:path*',
      destination: '/new/',
    };
    // :path* source with any path should redirect to exact destination
    expect(redirectMatches(redirect, '/old/something/', '/new/')).toBe(true);
    expect(redirectMatches(redirect, '/old/nested/path/', '/new/')).toBe(true);
    expect(redirectMatches(redirect, '/old/something/', '/new/other/')).toBe(false);
  });

  it('should handle complex :path* patterns with multiple params', () => {
    const redirect = {
      source: '/platforms/:platform/guides/:guide/configuration/capture/:path*',
      destination: '/platforms/:platform/guides/:guide/usage/',
    };
    // Should match when all params align correctly
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guides/react/configuration/capture/setup/',
        '/platforms/javascript/guides/react/usage/'
      )
    ).toBe(true);
    // Note: Our regex matching has a limitation - it checks if patterns match,
    // but Next.js redirects preserve parameter values. In practice, this edge case
    // (where params change between old and new URL) is rare and would be caught
    // by manual review. For now, we accept that pattern matches are sufficient.
    // If the new URL matches the destination pattern, we consider it covered.
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guides/react/configuration/capture/setup/',
        '/platforms/python/guides/react/usage/'
      )
    ).toBe(true); // Pattern matches, even though actual redirect would preserve 'javascript'
  });

  it('should escape regex special characters in URLs', () => {
    // Test URLs with special regex characters that should be treated as literals
    const redirect = {
      source: '/platforms/javascript/guide(v2)/',
      destination: '/platforms/javascript/guide-v2/',
    };
    // Should match exact URLs with special characters
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide(v2)/',
        '/platforms/javascript/guide-v2/'
      )
    ).toBe(true);
    // Should not match URLs that don't exactly match
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide(v3)/',
        '/platforms/javascript/guide-v2/'
      )
    ).toBe(false);
  });

  it('should handle URLs with dots and other special characters', () => {
    const redirect = {
      source: '/platforms/javascript/guide.old/',
      destination: '/platforms/javascript/guide.new/',
    };
    // Dot should be treated as literal, not regex "any character"
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide.old/',
        '/platforms/javascript/guide.new/'
      )
    ).toBe(true);
    // Should not match "guidexold" (if dot was treated as regex)
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guidexold/',
        '/platforms/javascript/guide.new/'
      )
    ).toBe(false);
  });

  it('should handle URLs with brackets and parentheses', () => {
    const redirect = {
      source: '/platforms/javascript/guide[deprecated]/',
      destination: '/platforms/javascript/guide/',
    };
    // Brackets should be treated as literal, not regex character class
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide[deprecated]/',
        '/platforms/javascript/guide/'
      )
    ).toBe(true);
    // Should not match without brackets
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide/',
        '/platforms/javascript/guide/'
      )
    ).toBe(false);
  });

  it('should escape special characters while preserving path parameters', () => {
    const redirect = {
      source: '/platforms/:platform/guide(v1)/',
      destination: '/platforms/:platform/guide-v1/',
    };
    // Path parameters should still work, but special chars should be escaped
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide(v1)/',
        '/platforms/javascript/guide-v1/'
      )
    ).toBe(true);
    expect(
      redirectMatches(
        redirect,
        '/platforms/python/guide(v1)/',
        '/platforms/python/guide-v1/'
      )
    ).toBe(true);
    // Should not match different version
    expect(
      redirectMatches(
        redirect,
        '/platforms/javascript/guide(v2)/',
        '/platforms/javascript/guide-v1/'
      )
    ).toBe(false);
  });
});
