import {createHmac, timingSafeEqual} from 'node:crypto';

import {NextRequest, NextResponse} from 'next/server';

// This endpoint must run on the Node.js runtime (uses node:crypto) and must
// never be statically optimized, since it depends on per-request query params
// and server-only secrets.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Public redirect endpoint that grants contractors browser access to a
 * protected Vercel preview deployment WITHOUT exposing the Vercel
 * "Protection Bypass for Automation" secret in a public PR comment.
 *
 * Flow:
 *   1. The `preview-share-link` GitHub workflow signs a short-lived token for a
 *      specific preview origin and posts a link to this endpoint in the PR.
 *   2. A contractor clicks the link. This endpoint verifies the HMAC signature,
 *      the expiry, and that the target host is one of our docs preview domains.
 *   3. It then 302-redirects the browser to the preview origin with Vercel's
 *      bypass query params, which sets the bypass cookie and lets them browse.
 *
 * The bypass secret lives only in this server's env vars — it is never placed
 * in the (public) PR comment.
 */

// Only these hosts may ever be used as a redirect target. Both docs projects
// (user docs = `sentry-docs`, developer docs = `develop-docs`) deploy previews
// to `*.sentry.dev` and Vercel-generated `*.vercel.app` URLs.
const ALLOWED_PREVIEW_HOST =
  /^(sentry-docs|develop-docs)[a-z0-9-]*\.(sentry\.dev|vercel\.app)$/;

// Defense-in-depth: never redirect to the production (default-branch) build
// alias, even if a valid signature somehow existed for it. The workflow only
// ever signs non-production deployments, so this should never match in
// practice — it's a belt-and-suspenders guard for the production lockdown.
const PRODUCTION_BRANCH_ALIAS = /(^|[.-])git-master([-.])/;

function timingSafeStrEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    return false;
  }
  return timingSafeEqual(ab, bb);
}

function errorPage(message: string, status: number): NextResponse {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Preview link unavailable</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 3rem 1.5rem; color: #1a1523; }
      main { max-width: 32rem; margin: 0 auto; }
      h1 { font-size: 1.25rem; }
      p { line-height: 1.6; color: #4a4458; }
      code { background: #f1f0f3; padding: 0.1rem 0.35rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Preview link unavailable</h1>
      <p>${message}</p>
      <p>Push a new commit to the pull request (or re-run the deployment) to get a fresh preview link.</p>
    </main>
  </body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function GET(request: NextRequest): NextResponse {
  const signingKey = process.env.SHARE_LINK_SIGNING_KEY;
  if (!signingKey) {
    // Misconfiguration — fail closed.
    return errorPage('This preview link service is not configured.', 500);
  }

  const params = request.nextUrl.searchParams;
  const url = params.get('u');
  const exp = params.get('exp');
  const sig = params.get('sig');

  if (!url || !exp || !sig) {
    return errorPage('This preview link is missing required parameters.', 400);
  }

  // Verify signature first (covers both `u` and `exp`), using a constant-time
  // comparison so we don't leak information about the expected signature.
  const expected = createHmac('sha256', signingKey).update(`${url}|${exp}`).digest('hex');
  if (!timingSafeStrEqual(sig, expected)) {
    return errorPage('This preview link is invalid or has been tampered with.', 403);
  }

  // Verify expiry (seconds since epoch).
  const expSeconds = Number(exp);
  if (!Number.isFinite(expSeconds) || Date.now() > expSeconds * 1000) {
    return errorPage('This preview link has expired.', 410);
  }

  // Parse and validate the target host against the allowlist.
  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return errorPage('This preview link points to an invalid URL.', 400);
  }
  if (target.protocol !== 'https:' || !ALLOWED_PREVIEW_HOST.test(target.host)) {
    return errorPage('This preview link points to a host that is not allowed.', 400);
  }
  if (PRODUCTION_BRANCH_ALIAS.test(target.host)) {
    return errorPage('This preview link points to a production build URL.', 400);
  }

  // Pick the correct project's bypass secret based on the host. The host is
  // covered by the signature, so this decision is integrity-protected.
  const isDevelopDocs = target.host.startsWith('develop-docs');
  const bypassSecret = isDevelopDocs
    ? process.env.BYPASS_SECRET_DEVELOP_DOCS
    : process.env.BYPASS_SECRET_USER_DOCS;

  if (!bypassSecret) {
    return errorPage('This preview link service is missing a bypass secret.', 500);
  }

  // Redirect to the preview origin root with Vercel's bypass params. The
  // `x-vercel-set-bypass-cookie=true` flag makes Vercel set an auth-bypass
  // cookie so the contractor can browse the whole deployment normally.
  const redirectTarget = new URL('/', target.origin);
  redirectTarget.searchParams.set('x-vercel-protection-bypass', bypassSecret);
  redirectTarget.searchParams.set('x-vercel-set-bypass-cookie', 'true');

  const response = NextResponse.redirect(redirectTarget.toString(), 302);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
