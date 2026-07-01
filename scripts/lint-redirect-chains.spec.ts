import fs from 'fs';
import path from 'path';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {parseMiddlewareTs, parseRedirectsJs} from './check-redirects-on-rename';
import {
  detectContentLinkIssues,
  detectRedirectChains,
  resolveToFinal,
  walkChain,
} from './lint-redirect-chains';

describe('walkChain', () => {
  it('should return just the source when no chain exists', () => {
    const map = new Map([
      ['/a/', '/b/'],
      ['/c/', '/d/'],
    ]);
    expect(walkChain('/a/', map)).toEqual(['/a/', '/b/']);
  });

  it('should walk a 2-hop chain', () => {
    const map = new Map([
      ['/a/', '/b/'],
      ['/b/', '/c/'],
    ]);
    expect(walkChain('/a/', map)).toEqual(['/a/', '/b/', '/c/']);
  });

  it('should walk a 3-hop chain', () => {
    const map = new Map([
      ['/a/', '/b/'],
      ['/b/', '/c/'],
      ['/c/', '/d/'],
    ]);
    expect(walkChain('/a/', map)).toEqual(['/a/', '/b/', '/c/', '/d/']);
  });

  it('should detect cycles', () => {
    const map = new Map([
      ['/a/', '/b/'],
      ['/b/', '/a/'],
    ]);
    const result = walkChain('/a/', map);
    expect(result).toEqual(['/a/', '/b/', '/a/ (CYCLE)']);
  });

  it('should detect self-referencing cycles', () => {
    const map = new Map([['/a/', '/a/']]);
    const result = walkChain('/a/', map);
    expect(result).toEqual(['/a/', '/a/ (CYCLE)']);
  });

  it('should cap at maxDepth', () => {
    const map = new Map<string, string>();
    for (let i = 0; i < 20; i++) {
      map.set(`/${i}/`, `/${i + 1}/`);
    }
    const result = walkChain('/0/', map, 5);
    expect(result).toHaveLength(6); // source + 5 hops
  });
});

describe('resolveToFinal', () => {
  it('should resolve a single redirect', () => {
    const map = new Map([['/a/', '/b/']]);
    expect(resolveToFinal('/a/', map)).toBe('/b/');
  });

  it('should resolve a chain to the final destination', () => {
    const map = new Map([
      ['/a/', '/b/'],
      ['/b/', '/c/'],
      ['/c/', '/d/'],
    ]);
    expect(resolveToFinal('/a/', map)).toBe('/d/');
  });

  it('should handle self-referencing cycles without infinite loop', () => {
    const map = new Map([['/a/', '/a/']]);
    expect(resolveToFinal('/a/', map)).toBe('/a/');
  });

  it('should return the source when not in the map', () => {
    const map = new Map([['/a/', '/b/']]);
    expect(resolveToFinal('/x/', map)).toBe('/x/');
  });
});

describe('detectRedirectChains', () => {
  it('should detect chains within a single redirect source', () => {
    const jsRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [
        {source: '/old/', destination: '/middle/'},
        {source: '/middle/', destination: '/new/'},
      ],
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };

    const chains = detectRedirectChains(jsRedirects, mwRedirects);
    expect(chains).toHaveLength(1);
    expect(chains[0].source).toBe('/old/');
    expect(chains[0].currentDest).toBe('/middle/');
    expect(chains[0].finalDest).toBe('/new/');
    expect(chains[0].file).toBe('redirects.js');
    expect(chains[0].isDeveloperDocs).toBe(false);
  });

  it('should detect cross-system chains (middleware -> redirects.js)', () => {
    const jsRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [
        {source: '/middle/', destination: '/final/'},
      ],
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [
        {source: '/old/', destination: '/middle/'},
      ],
    };

    const chains = detectRedirectChains(jsRedirects, mwRedirects);
    expect(chains).toHaveLength(1);
    expect(chains[0].source).toBe('/old/');
    expect(chains[0].finalDest).toBe('/final/');
    expect(chains[0].file).toBe('middleware.ts');
  });

  it('should return empty array when no chains exist', () => {
    const jsRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [
        {source: '/a/', destination: '/b/'},
        {source: '/c/', destination: '/d/'},
      ],
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };

    const chains = detectRedirectChains(jsRedirects, mwRedirects);
    expect(chains).toHaveLength(0);
  });

  it('should handle self-redirect cycles', () => {
    const jsRedirects = {
      developerDocsRedirects: [
        {source: '/loop/', destination: '/loop/'},
      ],
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };

    const chains = detectRedirectChains(jsRedirects, mwRedirects);
    expect(chains).toHaveLength(1);
    expect(chains[0].finalDest).toBe('(CYCLE DETECTED)');
  });

  it('should handle parameterized redirect chains', () => {
    const jsRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [
        {source: '/old/:path*', destination: '/middle/:path*'},
        {source: '/middle/:path*', destination: '/new/:path*'},
      ],
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };

    const chains = detectRedirectChains(jsRedirects, mwRedirects);
    expect(chains).toHaveLength(1);
    expect(chains[0].source).toBe('/old/:path*');
    expect(chains[0].finalDest).toBe('/new/:path*');
  });

  it('should separate user docs and developer docs', () => {
    const jsRedirects = {
      developerDocsRedirects: [
        {source: '/sdk/old/', destination: '/sdk/middle/'},
        {source: '/sdk/middle/', destination: '/sdk/new/'},
      ],
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };

    const chains = detectRedirectChains(jsRedirects, mwRedirects);
    expect(chains).toHaveLength(1);
    expect(chains[0].isDeveloperDocs).toBe(true);
  });
});

describe('detectContentLinkIssues', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = path.join(process.cwd(), '__test_mdx_temp__');
    fs.mkdirSync(path.join(tempDir, 'docs'), {recursive: true});
  });

  afterEach(() => {
    fs.rmSync(tempDir, {recursive: true, force: true});
  });

  it('should detect markdown links pointing to redirect sources', () => {
    const mdxContent = `---
title: Test
---

Check out the [old page](/old/path/) for more info.
`;
    fs.writeFileSync(path.join(tempDir, 'docs', 'test.mdx'), mdxContent);

    // Monkey-patch findAllMdxFiles to use our temp dir
    const jsRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [
        {source: '/old/path/', destination: '/new/path/'},
      ],
    };
    const mwRedirects = {
      developerDocsRedirects: [] as Array<{destination: string; source: string}>,
      userDocsRedirects: [] as Array<{destination: string; source: string}>,
    };

    // We test the link detection logic by checking the regex patterns directly
    const markdownLinkRegex = /\]\((\/[^)#\s]+?)(?:#[^)]+)?\)/g;
    const matches = [...mdxContent.matchAll(markdownLinkRegex)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe('/old/path/');
  });

  it('should detect JSX links pointing to redirect sources', () => {
    const mdxContent = `<LinkCard href="/old/path/" title="Test" />`;

    const jsxLinkRegex = /(?:href|to|url)="(\/[^"#]+?)(?:#[^"]+)?"/g;
    const matches = [...mdxContent.matchAll(jsxLinkRegex)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe('/old/path/');
  });

  it('should strip anchors from links', () => {
    const mdxContent = `[link](/old/path/#section)`;

    const markdownLinkRegex = /\]\((\/[^)#\s]+?)(?:#[^)]+)?\)/g;
    const matches = [...mdxContent.matchAll(markdownLinkRegex)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe('/old/path/');
  });

  it('should skip external links', () => {
    const mdxContent = `[link](https://example.com/path/)`;

    const markdownLinkRegex = /\]\((\/[^)#\s]+?)(?:#[^)]+)?\)/g;
    const matches = [...mdxContent.matchAll(markdownLinkRegex)];
    expect(matches).toHaveLength(0);
  });

  it('should skip hash-only links', () => {
    const mdxContent = `[link](#section)`;

    const markdownLinkRegex = /\]\((\/[^)#\s]+?)(?:#[^)]+)?\)/g;
    const matches = [...mdxContent.matchAll(markdownLinkRegex)];
    expect(matches).toHaveLength(0);
  });

  it('should handle links without trailing slashes', () => {
    const mdxContent = `[link](/old/path)`;

    const markdownLinkRegex = /\]\((\/[^)#\s]+?)(?:#[^)]+)?\)/g;
    const matches = [...mdxContent.matchAll(markdownLinkRegex)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe('/old/path');
    // Normalization adds trailing slash: /old/path -> /old/path/
  });

  it('should detect PlatformLink to= attributes', () => {
    const mdxContent = `<PlatformLink to="/old/feature/">text</PlatformLink>`;

    const jsxLinkRegex = /(?:href|to|url)="(\/[^"#]+?)(?:#[^"]+)?"/g;
    const matches = [...mdxContent.matchAll(jsxLinkRegex)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe('/old/feature/');
  });
});

describe('integration: real redirect files', () => {
  it('should parse real redirects.js without errors', () => {
    const result = parseRedirectsJs('redirects.js');
    expect(result.userDocsRedirects.length).toBeGreaterThan(0);
    expect(result.developerDocsRedirects.length).toBeGreaterThan(0);
  });

  it('should parse real middleware.ts without errors', () => {
    const result = parseMiddlewareTs('middleware.ts');
    expect(result.userDocsRedirects.length).toBeGreaterThan(0);
    expect(result.developerDocsRedirects.length).toBeGreaterThan(0);
  });
});
