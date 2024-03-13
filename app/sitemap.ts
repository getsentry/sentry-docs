import type {MetadataRoute} from 'next';

import {getDocsFrontMatter} from 'sentry-docs/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getDocsFrontMatter();

  const sitemapEntries = docs.map(doc => {
    let slug = doc.slug;
    const slugParts = slug.split('/');
    if (slugParts[slugParts.length - 1] === 'index') {
      slug = slugParts.slice(0, slugParts.length - 1).join('/');
    }
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
