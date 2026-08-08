import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);

const CONSUMER_EXTENSIONS = new Set([
  '.astro',
  '.js',
  '.json',
  '.jsx',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
  '.tsx',
  '.txt',
  '.xml',
  '.yaml',
  '.yml',
]);

const SKIPPED_DIRECTORIES = new Set(['.git', '.next', 'dist', 'node_modules']);

function normalizePathname(value) {
  let pathname = value || '/';
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/+/g, '/');
  if (pathname !== '/' && !pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function compileRedirect(redirect) {
  const names = [];
  const segments = redirect.source.split('/').filter(Boolean);
  const parts = segments.map(segment => {
    const star = segment.match(/^:(\w+)\*$/);
    if (star) {
      names.push(star[1]);
      return '(.*)';
    }

    const param = segment.match(/^:(\w+)$/);
    if (param) {
      names.push(param[1]);
      return '([^/]+)';
    }

    // Next redirect sources occasionally use an explicit segment alternation.
    if (/^\([\w|-]+\)$/.test(segment)) {
      names.push(null);
      return segment;
    }

    return escapeRegex(segment);
  });

  return {
    ...redirect,
    names,
    regex: new RegExp(`^/${parts.join('/')}/?$`),
  };
}

function applyRedirect(redirect, pathname) {
  const match = redirect.regex.exec(pathname);
  if (!match) return null;

  const params = new Map();
  redirect.names.forEach((name, index) => {
    if (name) params.set(name, match[index + 1] || '');
  });

  return redirect.destination
    .replace(/:(\w+)\*/g, (_, name) => params.get(name) || '')
    .replace(/:(\w+)/g, (_, name) => params.get(name) || '');
}

function parseMiddlewareRedirects(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const source = fs.readFileSync(filePath, 'utf8');
  const match = source.match(
    /const USER_DOCS_REDIRECTS:\s*Redirect\[\]\s*=\s*\[([\s\S]*?)\n\];/
  );
  if (!match) return [];

  return Array.from(
    match[1].matchAll(/\{\s*from:\s*'([^']+)',\s*to:\s*'([^']+)',?\s*\}/g),
    entry => ({source: entry[1], destination: entry[2], owner: 'middleware.ts'})
  );
}

export function loadRedirects(docsRoot) {
  const absoluteDocsRoot = path.resolve(docsRoot);
  const redirectsPath = path.join(absoluteDocsRoot, 'redirects.js');
  const middlewarePath = path.join(absoluteDocsRoot, 'middleware.ts');
  let configRedirects = [];

  if (fs.existsSync(redirectsPath)) {
    const resolved = require.resolve(redirectsPath);
    delete require.cache[resolved];
    const loaded = require(resolved);
    configRedirects = (loaded.userDocsRedirects || []).map(redirect => ({
      ...redirect,
      owner: 'redirects.js',
    }));
  }

  // next.config redirects run before middleware in production. Preserve that order.
  return [...configRedirects, ...parseMiddlewareRedirects(middlewarePath)].map(
    compileRedirect
  );
}

function isDraft(filePath) {
  const start = fs.readFileSync(filePath, 'utf8').slice(0, 2048);
  return /^draft:\s*true\s*$/m.test(start);
}

function isPageFile(filePath) {
  return fs.existsSync(filePath) && !isDraft(filePath);
}

function docsFileExists(docsRoot, relativePath) {
  const base = path.join(docsRoot, 'docs', relativePath);
  return [
    `${base}.md`,
    `${base}.mdx`,
    path.join(base, 'index.md'),
    path.join(base, 'index.mdx'),
  ].some(isPageFile);
}

function appRouteExists(docsRoot, pathname) {
  const relative = pathname.replace(/^\//, '').replace(/\/$/, '');
  if (!relative) return true;
  const appPath = path.join(docsRoot, 'app', relative);
  return ['page.js', 'page.jsx', 'page.ts', 'page.tsx'].some(file =>
    fs.existsSync(path.join(appPath, file))
  );
}

function configuredPlatformRouteExists(docsRoot, segments) {
  if (segments[0] !== 'platforms' || segments.length < 2) return false;
  const platformRoot = path.join(docsRoot, 'docs', 'platforms', segments[1]);
  if (!fs.existsSync(path.join(platformRoot, 'config.yml'))) return false;

  if (segments.length === 2) {
    return docsFileExists(docsRoot, `platforms/${segments[1]}/common/index`);
  }

  if (segments[2] === 'guides' && segments.length === 4) {
    return fs.existsSync(path.join(platformRoot, 'guides', segments[3], 'config.yml'));
  }

  return false;
}

export function routeExists(docsRoot, pathname) {
  docsRoot = path.resolve(docsRoot);
  const normalized = normalizePathname(pathname);
  if (normalized === '/') return true;

  const relative = normalized.replace(/^\//, '').replace(/\/$/, '');
  if (docsFileExists(docsRoot, relative) || appRouteExists(docsRoot, normalized)) {
    return true;
  }

  const segments = relative.split('/');
  if (configuredPlatformRouteExists(docsRoot, segments)) return true;
  if (segments[0] !== 'platforms' || segments.length < 3) return false;

  const platform = segments[1];
  if (segments[2] === 'guides' && segments.length >= 5) {
    const guide = segments[3];
    const rest = segments.slice(4).join('/');
    return (
      docsFileExists(docsRoot, `platforms/${platform}/guides/${guide}/${rest}`) ||
      docsFileExists(docsRoot, `platforms/${platform}/common/${rest}`)
    );
  }

  const rest = segments.slice(2).join('/');
  return docsFileExists(docsRoot, `platforms/${platform}/common/${rest}`);
}

export function resolveDocsPath(docsRoot, pathname, maxHops = 10) {
  const redirects = loadRedirects(docsRoot);
  let current = normalizePathname(pathname);
  const chain = [current];
  const seen = new Set(chain);

  for (let hop = 0; hop < maxHops; hop++) {
    let redirect;
    for (const candidate of redirects) {
      if (candidate.regex.test(current)) {
        redirect = candidate;
        break;
      }
    }
    if (!redirect) {
      return {
        chain,
        finalPath: current,
        status: routeExists(docsRoot, current) ? 'valid' : 'missing',
      };
    }

    const destination = applyRedirect(redirect, current);
    if (!destination) break;
    if (/^https?:\/\//.test(destination)) {
      return {chain: [...chain, destination], finalPath: destination, status: 'external'};
    }

    current = normalizePathname(destination.split(/[?#]/, 1)[0]);
    chain.push(current);
    if (seen.has(current)) {
      return {chain, finalPath: current, status: 'cycle'};
    }
    seen.add(current);
  }

  return {chain, finalPath: current, status: 'too-many-redirects'};
}

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) continue;
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (CONSUMER_EXTENSIONS.has(path.extname(entry.name))) files.push(fullPath);
    }
  }
  return files;
}

function lineForOffset(content, offset) {
  return content.slice(0, offset).split('\n').length;
}

export function extractDocsLinks(consumerRoot) {
  const links = [];
  const regex = /https?:\/\/docs\.sentry\.io\/[^\s"'<>\\)\]}]+/g;

  for (const filePath of walkFiles(consumerRoot)) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const match of content.matchAll(regex)) {
      const raw = match[0].replace(/[.,;:!?]+$/, '').replace(/&amp;/g, '&');
      try {
        const url = new URL(raw);
        if (/[${}:]/.test(url.pathname) || url.pathname.startsWith('/_next/')) continue;
        links.push({
          file: path.relative(consumerRoot, filePath),
          line: lineForOffset(content, match.index || 0),
          pathname: normalizePathname(decodeURIComponent(url.pathname)),
          raw,
        });
      } catch {
        // Ignore malformed text that merely resembles a URL.
      }
    }
  }

  return links;
}

export function uniqueLinksByPath(links) {
  const byPath = new Map();
  for (const link of links) {
    if (!byPath.has(link.pathname)) byPath.set(link.pathname, link);
  }
  return byPath;
}

export function validateLinks(docsRoot, links) {
  return links.map(link => ({
    ...link,
    resolution: resolveDocsPath(docsRoot, link.pathname),
  }));
}
