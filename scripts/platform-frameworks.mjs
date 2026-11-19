/**
 * Frameworks listed under each platform in llms.txt, index.md, and platform
 * Markdown exports.
 *
 * Most platforms keep frameworks in platforms/<name>/guides/. Python and Elixir
 * document them as integrations instead. For those, use the "Web Frameworks"
 * section of integrations/index.mdx. Platforms without that section fall back
 * to WEB_FRAMEWORK_FALLBACKS.
 */
import {readFileSync} from 'node:fs';
import * as path from 'node:path';

const WEB_FRAMEWORK_FALLBACKS = {
  elixir: ['plug_and_phoenix'],
};

export function slugsFromWebFrameworksSection(source, platformSlug) {
  if (!source) {
    return [];
  }
  const start = source.search(/^### Web Frameworks\s*$/m);
  if (start === -1) {
    return [];
  }
  const afterHeading = source.slice(start);
  const headingEnd = afterHeading.indexOf('\n');
  const body = afterHeading.slice(headingEnd + 1);
  const nextHeading = body.search(/^### /m);
  const section = nextHeading === -1 ? body : body.slice(0, nextHeading);

  const slugs = [];
  const seen = new Set();
  const urlPattern = new RegExp(
    `/platforms/${platformSlug}/integrations/([A-Za-z0-9_-]+)/?`,
    'g'
  );
  for (const found of section.matchAll(urlPattern)) {
    if (!seen.has(found[1])) {
      seen.add(found[1]);
      slugs.push(found[1]);
    }
  }
  return slugs;
}

export function integrationFrameworkSlugs(platformSlug, source) {
  const parsed = slugsFromWebFrameworksSection(source, platformSlug);
  if (parsed.length > 0) {
    return parsed;
  }
  return WEB_FRAMEWORK_FALLBACKS[platformSlug] ?? [];
}

function readIntegrationsIndex(root, platformSlug) {
  try {
    return readFileSync(
      path.join(root, 'docs', 'platforms', platformSlug, 'integrations', 'index.mdx'),
      'utf8'
    );
  } catch {
    return '';
  }
}

/**
 * Visible framework pages for a platform, in docs order.
 * Guide-based platforms return their guides. Integration-based platforms
 * return web frameworks only.
 */
export function frameworkNodes(platform, {root, visibleChildren}) {
  const guides = platform.children?.find(child => child.slug === 'guides');
  const visibleGuides = guides ? visibleChildren(guides) : [];
  if (visibleGuides.length > 0) {
    return visibleGuides;
  }

  if (!platform.frontmatter?.showIntegrationsInSearch) {
    return [];
  }

  const integrations = platform.children?.find(child => child.slug === 'integrations');
  if (!integrations) {
    return [];
  }

  const bySlug = new Map(visibleChildren(integrations).map(node => [node.slug, node]));
  const source = readIntegrationsIndex(root, platform.slug);
  return integrationFrameworkSlugs(platform.slug, source)
    .map(slug => bySlug.get(slug))
    .filter(Boolean);
}
