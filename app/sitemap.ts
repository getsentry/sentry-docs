import type {MetadataRoute} from 'next';

import {type DocNode, getDocsRootNode} from 'sentry-docs/docTree';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

/**
 * Recursively extracts all slugs (paths) from a DocNode tree.
 * This traverses the entire tree and collects the path from each node,
 * excluding synthetic nodes (nodes with missing: true).
 */
function extractSlugsFromDocTree(node: DocNode): string[] {
  const slugs: string[] = [];

  // Add current node's path (skip root, empty paths, and synthetic nodes)
  if (node.path && node.path !== '/' && !node.missing) {
    slugs.push(node.path);
  }

  // Recursively collect slugs from children
  for (const child of node.children) {
    slugs.push(...extractSlugsFromDocTree(child));
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rootNode = await getDocsRootNode();
  const baseUrl = isDeveloperDocs
    ? 'https://develop.sentry.dev'
    : 'https://docs.sentry.io';

  const paths = extractSlugsFromDocTree(rootNode);
  return docsToSitemap(paths, baseUrl);
}

function docsToSitemap(paths: string[], baseUrl: string): MetadataRoute.Sitemap {
  const appendSlash = (path: string) => {
    if (path === '' || path.endsWith('/')) {
      return path;
    }
    return path + '/';
  };
  const toFullUrl = (path: string) => `${appendSlash(baseUrl)}${appendSlash(path)}`;
  const toSitemapEntry = (path: string) => ({url: toFullUrl(path)});
  return ['', ...paths].map(toSitemapEntry);
}
