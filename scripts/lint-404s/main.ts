import {readFileSync} from 'fs';
import {toString} from 'hast-util-to-string';
import pLimit from 'p-limit';
import path, {dirname} from 'path';
import rehypeParse from 'rehype-parse';
import {unified} from 'unified';
import {visit} from 'unist-util-visit';
import {fileURLToPath} from 'url';

import {resolveLinkUrl} from './url';

const baseUrlIndex = process.argv.indexOf('--base-url');
const baseURL = new URL(
  baseUrlIndex !== -1 && process.argv[baseUrlIndex + 1]
    ? process.argv[baseUrlIndex + 1]
    : 'http://localhost:3000/'
);
type Link = {href: string; innerText: string};

const trimSlashes = (s: string) => s.replace(/(^\/|\/$)/g, '');

// @ts-ignore
const ignoreListFile = path.join(dirname(import.meta.url), './ignore-list.txt');

const showProgress = process.argv.includes('--progress');
const deduplicatePages =
  !process.argv.includes('--full') && !process.argv.includes('--skip-deduplication');
const requestLimit = pLimit(32);

// Get the path filter if specified
const pathFilterIndex = process.argv.indexOf('--path');
const pathFilter =
  pathFilterIndex !== -1 && process.argv[pathFilterIndex + 1]
    ? trimSlashes(process.argv[pathFilterIndex + 1])
    : null;

// Paths to skip
const ignoreList: string[] = readFileSync(fileURLToPath(ignoreListFile), 'utf8')
  .split('\n')
  .map(trimSlashes)
  .filter(Boolean);

function fetchWithFollow(url: URL | string, retries = 3): Promise<Response> {
  return requestLimit(async () => {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await fetch(url, {signal: AbortSignal.timeout(30_000)});
        if (response.status !== 429 && response.status < 500) {
          return response;
        }
        if (attempt === retries) {
          throw new Error(`Request failed with status ${response.status}: ${url}`);
        }
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt));
    }
  });
}

async function deduplicateSlugs(
  allSlugs: string[]
): Promise<{skippedCount: number; slugsToCheck: string[]}> {
  try {
    const sourceMap: Record<string, string | null> = await fetch(
      new URL('api/source-map', baseURL)
    ).then(r => r.json());

    const checkedSources = new Set<string>();
    const slugsToCheck: string[] = [];
    let skippedCount = 0;

    for (const slug of allSlugs) {
      // Use same normalization as route.ts (remove leading and trailing slashes)
      const normalizedSlug = slug.replace(/(^\/|\/$)/g, '');
      const sourcePath = sourceMap[normalizedSlug];

      // Always check API-generated pages (no source file)
      if (!sourcePath) {
        slugsToCheck.push(slug);
        continue;
      }

      // Skip if we've already checked this source file
      if (checkedSources.has(sourcePath)) {
        skippedCount++;
        continue;
      }

      // First time seeing this source file
      checkedSources.add(sourcePath);
      slugsToCheck.push(slug);
    }

    return {skippedCount, slugsToCheck};
  } catch (error) {
    console.warn('⚠️  Failed to fetch source map:', error.message);
    console.warn('Falling back to checking all pages...\n');
    return {skippedCount: 0, slugsToCheck: allSlugs};
  }
}

async function main() {
  const sitemapResponse = await fetchWithFollow(new URL('sitemap.xml', baseURL));
  if (!sitemapResponse.ok) {
    throw new Error(`Failed to fetch sitemap: ${sitemapResponse.status}`);
  }
  const sitemap = await sitemapResponse.text();

  const sitemapSlugs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)]
    .map(l => l[1])
    .map(url => trimSlashes(new URL(url).pathname))
    .filter(Boolean);
  if (sitemapSlugs.length === 0) {
    throw new Error('Sitemap did not contain any pages.');
  }

  const allSlugs = sitemapSlugs.filter(slug =>
    pathFilter ? slug === pathFilter || slug.startsWith(`${pathFilter}/`) : true
  );
  if (allSlugs.length === 0) {
    throw new Error(`No sitemap pages matched path filter: ${pathFilter}`);
  }
  const allSlugsSet = new Set(allSlugs);

  // Optionally deduplicate pages with the same source file for a faster check.
  const {skippedCount, slugsToCheck} = deduplicatePages
    ? await deduplicateSlugs(allSlugs)
    : {skippedCount: 0, slugsToCheck: allSlugs};

  if (skippedCount > 0) {
    console.log(
      'Deduplication: checking %d unique pages (skipped %d duplicates)\n',
      slugsToCheck.length,
      skippedCount
    );
  }

  const pathInfo = pathFilter ? ` in /${pathFilter}` : '';
  console.log('Checking 404s on %d pages%s', slugsToCheck.length, pathInfo);

  const all404s: {page404s: Link[]; slug: string}[] = [];

  // check if the slug equivalent of the href is in the sitemap
  const isInSitemap = (href: string) => {
    // remove hash
    const pathnameSlug = trimSlashes(new URL(href, baseURL).pathname);

    // some #hash links result in empty slugs when stripped
    return pathnameSlug === '' || allSlugsSet.has(pathnameSlug);
  };

  function shouldSkipLink(href: string, resolvedUrl: URL) {
    const isExternal =
      resolvedUrl.origin !== baseURL.origin && resolvedUrl.hostname !== 'docs.sentry.io';
    const hasUnsupportedScheme = !['http:', 'https:'].includes(resolvedUrl.protocol);
    const isExplicitLocalhost = /^(?:https?:)?\/\/localhost(?::\d+)?(?:\/|$)/.test(href);
    const isIp = (href_: string) => /(\d{1,3}\.){3}\d{1,3}/.test(href_);
    const isImage = (href_: string) => /\.(png|jpg|jpeg|gif|svg|webp)$/.test(href_);

    return (
      isExternal ||
      hasUnsupportedScheme ||
      isExplicitLocalhost ||
      ignoreList.includes(trimSlashes(resolvedUrl.pathname)) ||
      isImage(resolvedUrl.pathname) ||
      isIp(resolvedUrl.hostname)
    );
  }

  async function is404(link: Link, pageUrl: URL): Promise<boolean> {
    const resolvedUrl = resolveLinkUrl(link.href, pageUrl);
    if (!resolvedUrl) {
      return true;
    }
    if (shouldSkipLink(link.href, resolvedUrl)) {
      return false;
    }

    const fullUrl =
      resolvedUrl.hostname === 'docs.sentry.io' && resolvedUrl.origin !== baseURL.origin
        ? new URL(
            `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`,
            baseURL
          )
        : resolvedUrl;

    if (isInSitemap(fullUrl.href)) {
      return false;
    }
    const resp = await fetchWithFollow(fullUrl);
    return resp.status >= 400 && resp.status < 500;
  }

  const pageLimit = pLimit(20);
  await Promise.all(
    slugsToCheck.map(slug =>
      pageLimit(async () => {
        const pageUrl = new URL(`${slug}/`, baseURL);
        const now = performance.now();
        const pageResponse = await fetchWithFollow(pageUrl.href);
        if (!pageResponse.ok) {
          all404s.push({
            slug,
            page404s: [
              {
                href: pageUrl.href,
                innerText: `Sitemap page returned ${pageResponse.status}`,
              },
            ],
          });
          return;
        }
        const html = await pageResponse.text();

        const links: Link[] = [];
        const tree = unified().use(rehypeParse).parse(html);
        visit(tree, 'element', node => {
          const href = node.properties.href;
          if (node.tagName === 'a' && typeof href === 'string') {
            links.push({href, innerText: toString(node)});
          }
        });
        const page404s = (
          await Promise.all(
            links.map(async link => {
              const is404_ = await is404(link, pageUrl);
              return [link, is404_] as [Link, boolean];
            })
          )
        )
          .filter(([_, is404_]) => is404_)
          .map(([link]) => link);

        if (page404s.length) {
          all404s.push({slug, page404s});
        }

        if (showProgress) {
          console.log(
            page404s.length ? '❌' : '✅',
            `in ${(performance.now() - now).toFixed(1).padStart(4, '0')} ms | ${slug}`
          );
        }
      })
    )
  );

  if (all404s.length === 0) {
    console.log('\n🎉 No 404s found');
    return false;
  }
  const numberOf404s = all404s.map(x => x.page404s.length).reduce((a, b) => a + b, 0);
  console.log(
    '\n❌ Found %d %s across %d %s',
    numberOf404s,
    numberOf404s === 1 ? '404' : '404s',
    all404s.length,
    all404s.length === 1 ? 'page' : 'pages'
  );
  for (const {slug, page404s} of all404s) {
    console.log('\n🌐', new URL(`${slug}/`, baseURL).href);
    for (const link of page404s) {
      console.log(`    - [${link.innerText}](${link.href})`);
    }
  }

  console.log(
    '\n👉 Note: the markdown syntax is not necessarily present on the source files, but the links do exist on the final pages'
  );
  // signal error
  return true;
}
const now = performance.now();
main().then(has404s => {
  console.log(`\n Done in ${(performance.now() - now).toFixed(1)} ms`);
  process.exit(has404s ? 1 : 0);
});

export {};
