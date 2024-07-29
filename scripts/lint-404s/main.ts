/* eslint-disable no-console */

import {readFileSync} from 'fs';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

const baseURL = 'http://localhost:3000/';
type Link = {href: string; innerText: string};

const trimSlashes = (s: string) => s.replace(/(^\/|\/$)/g, '');

// @ts-ignore
const ignoreListFile = path.join(dirname(import.meta.url), './ignore-list.txt');

const showProgress = process.argv.includes('--progress');

// Paths to skip
const ignoreList: string[] = readFileSync(fileURLToPath(ignoreListFile), 'utf8')
  .split('\n')
  .map(trimSlashes)
  .filter(Boolean);

async function fetchWithFollow(url: URL | string): Promise<Response> {
  const r = await fetch(url);
  if (r.status >= 300 && r.status < 400 && r.headers.has('location')) {
    return fetchWithFollow(r.headers.get('location')!);
  }
  return r;
}

async function main() {
  const sitemap = await fetch(`${baseURL}sitemap.xml`).then(r => r.text());

  const slugs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)]
    .map(l => l[1])
    .map(url => trimSlashes(new URL(url).pathname))
    .filter(Boolean);
  const allSlugsSet = new Set(slugs);

  console.log('Checking 404s on %d pages', slugs.length);

  const all404s: {page404s: Link[]; slug: string}[] = [];

  // check if the slug equivalent of the href is in the sitemap
  const isInSitemap = (href: string) => {
    // remove hash
    const pathnameSlug = trimSlashes(href.replace(/#.*$/, ''));

    // some #hash links result in empty slugs when stripped
    return pathnameSlug === '' || allSlugsSet.has(pathnameSlug);
  };

  function shoudlSkipLink(href: string) {
    const isExternal = (href_: string) =>
      href_.startsWith('http') || href_.startsWith('mailto:');
    const isLocalhost = (href_: string) =>
      href_.startsWith('http') && new URL(href_).hostname === 'localhost';
    const isIp = (href_: string) => /(\d{1,3}\.){3}\d{1,3}/.test(href_);
    const isImage = (href_: string) => /\.(png|jpg|jpeg|gif|svg|webp)$/.test(href_);

    return [
      isExternal,
      (s = '') => ignoreList.includes(trimSlashes(s)),
      isImage,
      isLocalhost,
      isIp,
    ].some(fn => fn(href));
  }

  async function is404(link: Link, pageUrl: URL): Promise<boolean> {
    if (shoudlSkipLink(link.href)) {
      return false;
    }

    const fullPath = link.href.startsWith('/')
      ? trimSlashes(link.href)
      : // relative path
        trimSlashes(new URL(pageUrl.pathname + '/' + link.href, baseURL).pathname);

    if (isInSitemap(fullPath)) {
      return false;
    }
    const fullUrl = new URL(fullPath, baseURL);
    const resp = await fetchWithFollow(fullUrl);
    if (resp.status === 404) {
      return true;
    }
    return false;
  }

  for (const slug of slugs) {
    const pageUrl = new URL(slug, baseURL);
    const now = performance.now();
    const html = await fetchWithFollow(pageUrl.href).then(r => r.text());

    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
    const links = Array.from(html.matchAll(linkRegex)).map(m => {
      const [, href, innerText] = m;
      return {href, innerText};
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
  }

  if (all404s.length === 0) {
    console.log('\n\n🎉 No 404s found');
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
    console.log('\n🌐', baseURL + slug);
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
