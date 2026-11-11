import {extractPlatforms, getDocsRootNode} from 'sentry-docs/docTree';

// Emitted as a static file at build time. Client components load this list
// lazily instead of every page embedding it.
export const dynamic = 'force-static';

export async function GET() {
  const rootNode = await getDocsRootNode();
  return Response.json(extractPlatforms(rootNode));
}
