import {
  PlatformContentPayload,
  RUNTIMES,
} from 'sentry-docs/components/frameworkSelector/frameworks';
import {getFileBySlugWithCache} from 'sentry-docs/mdx';
import {resolvePlatformContent} from 'sentry-docs/platformContentResolver';

/**
 * Serves the compiled MDX of a `<PlatformContent>` include as it applies to a framework running
 * on a runtime, so a runtime's page can swap in framework snippets client-side
 * (see `<FrameworkSelector>`).
 *
 * Only the combinations from `generateStaticParams` are built; there is no runtime rendering.
 */

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.entries(RUNTIMES).flatMap(([runtime, {frameworks, includePaths}]) =>
    frameworks.flatMap(({key: framework}) =>
      includePaths.map(includePath => ({
        platform: 'javascript',
        runtime,
        framework,
        includePath: includePath.split('/'),
      }))
    )
  );
}

type SlugFile = Awaited<ReturnType<typeof getFileBySlugWithCache>>;

async function tryGetFile(slug: string): Promise<SlugFile | undefined> {
  try {
    return await getFileBySlugWithCache(slug);
  } catch {
    return undefined;
  }
}

/**
 * Resolves an include for a framework on a runtime:
 * 1. `<platform>.<runtime>.<framework>`, for snippets specific to both
 * 2. On Node.js, the framework guide's content, which falls back to Node.js
 *    Elsewhere, only a `<platform>.<framework>` snippet, to not pull in Node.js content
 * 3. The runtime guide's own content
 */
async function resolveForFramework(
  includePath: string,
  platform: string,
  runtime: string,
  framework: string
): Promise<SlugFile | undefined> {
  const base = `platform-includes/${includePath}/${platform}`;

  const doc = await tryGetFile(`${base}.${runtime}.${framework}`);
  if (doc) {
    return doc;
  }

  if (runtime === 'node') {
    return resolvePlatformContent({
      includePath,
      path: ['platforms', platform, 'guides', framework],
    });
  }

  return (
    (await tryGetFile(`${base}.${framework}`)) ??
    resolvePlatformContent({
      includePath,
      path: ['platforms', platform, 'guides', runtime],
    })
  );
}

const INCLUDE_RE = /<Include\s+name=["']([^"']+)["']/g;
const PLATFORM_CONTENT_RE = /<PlatformContent\s+includePath=["']([^"']+)["']/g;

async function collectNested(
  source: string,
  resolve: (includePath: string) => Promise<SlugFile | undefined>,
  payload: PlatformContentPayload
) {
  for (const [, rawName] of source.matchAll(INCLUDE_RE)) {
    const name = rawName.replace(/\.mdx$/, '');
    if (name in payload.includes) {
      continue;
    }
    // Missing includes render nothing, same as <Include>.
    const doc = await tryGetFile(`includes/${name}`);
    if (doc) {
      payload.includes[name] = doc.mdxSource;
      await collectNested(doc.matter.content, resolve, payload);
    }
  }

  for (const [, includePath] of source.matchAll(PLATFORM_CONTENT_RE)) {
    if (includePath in payload.platformContents) {
      continue;
    }
    const doc = await resolve(includePath);
    payload.platformContents[includePath] = doc?.mdxSource ?? null;
    if (doc) {
      await collectNested(doc.matter.content, resolve, payload);
    }
  }
}

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{
      framework: string;
      includePath: string[];
      platform: string;
      runtime: string;
    }>;
  }
) {
  const {platform, runtime, framework, includePath} = await params;
  const resolve = (path: string) =>
    resolveForFramework(path, platform, runtime, framework);

  const doc = await resolve(includePath.join('/'));

  const payload: PlatformContentPayload = {
    code: doc?.mdxSource ?? null,
    includes: {},
    platformContents: {},
  };
  if (doc) {
    await collectNested(doc.matter.content, resolve, payload);
  }

  return Response.json(payload);
}
