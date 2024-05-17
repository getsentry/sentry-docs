import type {MetadataRoute} from 'next';

import {getDocsFrontMatter} from 'sentry-docs/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getDocsFrontMatter();

  const sitemapEntries = docs.map(doc => {
    let slug = doc.slug;
    if (!slug.endsWith('/')) {
      slug += '/';
    }
    return {url: `https://docs.sentry.io/${slug}`};
  });
  sitemapEntries.unshift({
    url: 'https://docs.sentry.io/',
  });
  return sitemapEntries;
}
