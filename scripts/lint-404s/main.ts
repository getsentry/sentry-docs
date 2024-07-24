/* eslint-disable no-console */

import {readFileSync} from 'fs';
import path, {dirname} from 'path';
import readline from 'readline';
import {fileURLToPath} from 'url';

const baseURL = 'http://localhost:3000/';
type Link = {href: string; innerText: string};

const trimSlashes = (s: string) => s.replace(/(^\/|\/$)/g, '');

// @ts-ignore
const ignoreListFile = path.join(dirname(import.meta.url), './ignore-list.txt');

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

function updateProgressBar(current: number, total: number) {
  const barLength = 40;
  const progress = current / total;
  const filledLength = Math.round(barLength * progress);
  const bar = '▆'.repeat(filledLength) + '-'.repeat(barLength - filledLength);
  const percentage = Math.round(progress * 100);
  readline.cursorTo(process.stdout, 0); // Move cursor to the beginning of the line to overwrite
  process.stdout.write(`Progress: ${bar} ${percentage}% (${current}/${total})`);
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

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const pageUrl = new URL(slug, baseURL);
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

    updateProgressBar(i + 1, slugs.length);
  }

  if (all404s.length === 0) {
    console.log('\n\n🎉 No 404s found');
    return false;
  }
  console.log(
    '\n❌ Found %d 404s across %d %s',
    all404s.map(x => x.page404s.length).reduce((a, b) => a + b, 0),
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

const humanReadableMs = (ms: number) => {
  const oneSecond = 1000;
  const oneMinute = oneSecond * 60;
  if (ms < oneSecond) {
    return `${ms.toFixed(1)} ms`;
  }
  if (ms < oneMinute) {
    return `${(ms / 1000).toFixed(1)} s`;
  }
  // show minutes and seconds
  return `${Math.floor(ms / oneMinute)} m ${((ms % oneMinute) / 1000).toFixed(1)} s`;
};

main().then(has404s => {
  console.log(`\n Done in ${humanReadableMs(performance.now() - now)}`);
  process.exit(has404s ? 1 : 0);
});

export {};
