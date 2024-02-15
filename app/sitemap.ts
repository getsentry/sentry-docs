import fs from 'fs';
import path from 'path';

import type {MetadataRoute} from 'next';

import {getDocsFrontMatter} from 'sentry-docs/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await getDocsFrontMatter();
  const sitemapEntries = docs.map(doc => ({
    url: `https://docs.sentry.io/${doc.slug}`,
    lastModified: doc.lastModified,
  }));
  sitemapEntries.unshift({
    url: 'https://docs.sentry.io/',
    lastModified: fs.statSync(
      path.join(process.cwd(), 'src', 'components', 'homeClient.tsx')
    ).mtime,
  });
  return sitemapEntries;
}
