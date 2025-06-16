// these ranges are a copy of docs/security-legal-pii/security/ip-ranges.mdx
import ipRanges from './ip-ranges.json';

// 12h
const CACHE_DURATION = 12 * 60 * 60;

export function GET() {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': `public, max-age=${CACHE_DURATION}`,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  });

  return Response.json(ipRanges, {status: 200, headers});
}
