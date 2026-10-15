import path from 'node:path';

import {modifyRouteRegex} from 'next/dist/lib/redirect-status';
import {getPathMatch} from 'next/dist/shared/lib/router/utils/path-match';
import {expect, test} from 'vitest';

import {userDocsRedirects} from '../redirects';
import {parseMiddlewareTs} from '../scripts/check-redirects-on-rename';
import {getDocsFrontMatterFromDirectory} from './frontmatter';
import {isVersioned} from './versioning';

const root = path.join(__dirname, '..');

// Same matching as Next.js uses for the `redirects` in next.config.ts
const matchesRedirectSource = (source: string) =>
  getPathMatch(source, {
    strict: true,
    regexModifier: regex => modifyRouteRegex(regex, ['/_next']),
  });

// Same matching as `handleRedirects` in middleware.ts
const guideRegex = /\/guides\/(\w+)\//g;
const matchesMiddlewareSource = (sources: Set<string>) => (pagePath: string) =>
  sources.has(pagePath) || sources.has(pagePath.replace(guideRegex, '/guides/:guide/'));

test('redirects do not hide existing pages', {timeout: 60_000}, async () => {
  const pages = await getDocsFrontMatterFromDirectory(path.join(root, 'docs'));
  const pagePaths = pages.map(({slug}) =>
    isVersioned(slug) ? `/${slug}` : `/${slug}/`.replace(/\/index\/$/, '/')
  );

  const middlewareSources = new Set(
    parseMiddlewareTs(path.join(root, 'middleware.ts')).userDocsRedirects.map(
      ({source}) => source
    )
  );
  const matchers = [
    ...userDocsRedirects.map(({source}) => ({
      source: `redirects.js: ${source}`,
      matches: matchesRedirectSource(source),
    })),
    {source: 'middleware.ts', matches: matchesMiddlewareSource(middlewareSources)},
  ];

  const hiddenPages = pagePaths.flatMap(pagePath =>
    matchers
      .filter(({matches}) => matches(pagePath))
      .map(({source}) => `${pagePath} (${source})`)
  );

  expect(hiddenPages).toEqual([]);
});
