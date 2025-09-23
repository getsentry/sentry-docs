import {NextResponse} from 'next/server';
import {promises as fs} from 'node:fs';
import path from 'node:path';

const PROJECT_ROOT = process.cwd();
const ALLOWED_TOP_LEVEL = new Set([
  'docs',
  'develop-docs',
  'includes',
  'platform-includes',
  'platform-includes-legacy',
]);

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
};

export const runtime = 'nodejs';

function isAllowedPath(resolvedPath: string) {
  const relative = path.relative(PROJECT_ROOT, resolvedPath);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

export async function GET(_request: Request, context: {params: {path?: string[]}}) {
  const segments = context.params.path ?? [];
  if (segments.length === 0) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }

  if (!ALLOWED_TOP_LEVEL.has(segments[0])) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }

  const relativePath = path.join(...segments);
  const absolutePath = path.join(PROJECT_ROOT, relativePath);

  if (!isAllowedPath(absolutePath)) {
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }

  try {
    const data = await fs.readFile(absolutePath);
    const contentType =
      MIME_MAP[path.extname(absolutePath).toLowerCase()] ?? 'application/octet-stream';
    return new NextResponse(data.toString(), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(`Unable to serve MDX asset at ${absolutePath}:`, error);
    }
    return NextResponse.json({error: 'Not found'}, {status: 404});
  }
}
