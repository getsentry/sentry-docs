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
`;

describe('filePathToUrls', () => {
  it('should convert docs file path to URLs', () => {
    const result = filePathToUrls('docs/platforms/javascript/index.mdx');
    expect(result.isDeveloperDocs).toBe(false);
    expect(result.urls).toContain('/platforms/javascript/');
    expect(result.urls).toContain('/platforms/javascript');
  });

  it('should convert develop-docs file path to URLs', () => {
    const result = filePathToUrls('develop-docs/backend/api/index.mdx');
    expect(result.isDeveloperDocs).toBe(true);
    expect(result.urls).toContain('/backend/api/');
    expect(result.urls).toContain('/backend/api');
  });

  it('should handle non-index files', () => {
    const result = filePathToUrls('docs/platforms/javascript/guide.mdx');
    expect(result.isDeveloperDocs).toBe(false);
    expect(result.urls).toContain('/platforms/javascript/guide');
    expect(result.urls).toContain('/platforms/javascript/guide/');
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
  });

  it('should parse developer docs redirects', () => {
    fs.writeFileSync(tempFile, mockRedirectsJs);
    const result = parseRedirectsJs(tempFile);
    expect(result.developerDocsRedirects).toHaveLength(1);
    expect(result.developerDocsRedirects[0].source).toBe('/sdk/old-path/');
    expect(result.developerDocsRedirects[0].destination).toBe('/sdk/new-path/');
  });

  it('should parse user docs redirects', () => {
    fs.writeFileSync(tempFile, mockRedirectsJs);
    const result = parseRedirectsJs(tempFile);
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
});
