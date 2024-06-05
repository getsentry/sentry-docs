import type {MetadataRoute} from 'next';

import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';
import {getDevDocsFrontMatter, getDocsFrontMatter} from 'sentry-docs/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isDeveloperDocs) {
    const docs = getDevDocsFrontMatter();
    const baseUrl = 'https://develop.sentry.dev';
    return docsToSitemap(docs, baseUrl);
  }
  const docs = await getDocsFrontMatter();
  const baseUrl = 'https://docs.sentry.io';
  return docsToSitemap(docs, baseUrl);
}

function docsToSitemap(docs: {slug: string}[], baseUrl: string): MetadataRoute.Sitemap {
  const paths = docs.map(({slug}) => slug);
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
