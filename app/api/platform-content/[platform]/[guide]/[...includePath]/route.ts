import {
  NODE_FRAMEWORKS,
  PlatformContentPayload,
  SWITCHABLE_INCLUDE_PATHS,
} from 'sentry-docs/components/frameworkSelector/frameworks';
import {getFileBySlugWithCache} from 'sentry-docs/mdx';
import {resolvePlatformContent} from 'sentry-docs/platformContentResolver';

/**
 * Serves the compiled MDX of a `<PlatformContent>` include as it would render on a guide's page,
 * so pages can swap in another guide's snippets client-side (see `<FrameworkSelector>`).
 *
 * Only the combinations from `generateStaticParams` are built; there is no runtime rendering.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return NODE_FRAMEWORKS.flatMap(({key}) =>
    SWITCHABLE_INCLUDE_PATHS.map(includePath => ({
      platform: 'javascript',
      guide: key,
      includePath: includePath.split('/'),
    }))
  );
}

const INCLUDE_RE = /<Include\s+name=["']([^"']+)["']/g;
const PLATFORM_CONTENT_RE = /<PlatformContent\s+includePath=["']([^"']+)["']/g;

async function collectNested(
  source: string,
  path: string[],
  payload: PlatformContentPayload
) {
  for (const [, rawName] of source.matchAll(INCLUDE_RE)) {
    const name = rawName.replace(/\.mdx$/, '');
    if (name in payload.includes) {
      continue;
    }
    try {
      const doc = await getFileBySlugWithCache(`includes/${name}`);
      payload.includes[name] = doc.mdxSource;
      await collectNested(doc.matter.content, path, payload);
    } catch {
      // Missing includes render nothing, same as <Include>.
    }
  }

  for (const [, includePath] of source.matchAll(PLATFORM_CONTENT_RE)) {
    if (includePath in payload.platformContents) {
      continue;
    }
    const doc = await resolvePlatformContent({includePath, path});
    payload.platformContents[includePath] = doc?.mdxSource ?? null;
    if (doc) {
      await collectNested(doc.matter.content, path, payload);
    }
  }
}

export async function GET(
  _request: Request,
  {params}: {params: Promise<{guide: string; includePath: string[]; platform: string}>}
) {
  const {platform, guide, includePath} = await params;
  const path = ['platforms', platform, 'guides', guide];

  const doc = await resolvePlatformContent({includePath: includePath.join('/'), path});

  const payload: PlatformContentPayload = {
    code: doc?.mdxSource ?? null,
    includes: {},
    platformContents: {},
  };
  if (doc) {
    await collectNested(doc.matter.content, path, payload);
  }

  return Response.json(payload);
}
