import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
  let cspHeader = `
    upgrade-insecure-requests;
    default-src 'none';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' *.sentry-cdn.com www.googletagmanager.com plausible.io vercel.live;
    connect-src 'self' *.sentry.io sentry.io *.algolia.net *.algolianet.com *.algolia.io plausible.io reload.getsentry.net storage.googleapis.com;
    img-src * 'self' data: www.google.com www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    font-src 'self' fonts.gstatic.com;
    frame-src demo.arcade.software player.vimeo.com;
    worker-src blob:;
    report-uri https://o1.ingest.sentry.io/api/1267915/security/?sentry_key=ad63ba38287245f2803dc220be959636
  `;

  const requestHeaders = new Headers(request.headers);

  const url = new URL(request.url);
  if (url.pathname.startsWith('/changelog/')) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    cspHeader = `
        default-src 'none';
        base-uri 'none';
        script-src 'self' 'unsafe-inline' 'nonce-${nonce}' 'strict-dynamic';
        connect-src 'self' o1.ingest.sentry.io plausible.io;
        style-src 'self' 'unsafe-inline';
        img-src 'self' docs.sentry.io storage.googleapis.com;
        font-src 'self';
        worker-src blob:;
        upgrade-insecure-requests;
    `;

    requestHeaders.set('x-nonce', nonce);
  }

  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  let cspHeaderName = 'Content-Security-Policy-Report-Only';
  if (process.env.IS_PRODUCTION === 'true') {
    cspHeaderName = 'Content-Security-Policy';
  }
  response.headers.set(cspHeaderName, contentSecurityPolicyHeaderValue);

  return response;
}
