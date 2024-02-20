import type {MetadataRoute} from 'next';

import {getDocsFrontMatter} from 'sentry-docs/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getDocsFrontMatter();
  const sitemapEntries = docs.map(doc => ({
    url: `https://docs.sentry.io/${doc.slug}`,
  }));
  sitemapEntries.unshift({
    url: 'https://docs.sentry.io/',
  });
  return sitemapEntries;
}
