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
  const appendSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`);
  const toFullUrl = (path: string) => `${baseUrl}${appendSlash(path)}`;
  const toSitemapEntry = (url: string) => ({url});
  return ['/', ...paths].map(appendSlash).map(toFullUrl).map(toSitemapEntry);
}
