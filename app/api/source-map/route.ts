import {NextResponse} from 'next/server';

import {getDevDocsFrontMatter, getDocsFrontMatter} from 'sentry-docs/frontmatter';
import {isDeveloperDocs} from 'sentry-docs/isDeveloperDocs';

/**
 * API endpoint that returns a mapping of slugs to their source file paths.
 * This is used by the 404 link checker to deduplicate pages that share the same source.
 */
export async function GET() {
  const docs = await (isDeveloperDocs ? getDevDocsFrontMatter() : getDocsFrontMatter());

  const sourceMap: Record<string, string | null> = {};

  for (const doc of docs) {
    // Normalize slug (remove leading and trailing slashes to match main.ts trimSlashes)
    const slug = doc.slug.replace(/(^\/|\/$)/g, '');
    // sourcePath will be null for API-generated pages
    sourceMap[slug] = doc.sourcePath ?? null;
  }

  return NextResponse.json(sourceMap);
}
