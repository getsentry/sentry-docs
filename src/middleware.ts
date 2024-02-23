import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'none';
    base-uri 'none';
    script-src 'self' 'unsafe-inline' 'nonce-${nonce}' 'strict-dynamic';
    connect-src 'self' o1.ingest.sentry.io plausible.io;
    style-src 'self' 'unsafe-inline';
    img-src 'self' docs.sentry.io storage.googleapis.com;
    font-src 'self';
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
}
