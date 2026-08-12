import {createHmac} from 'node:crypto';

import {NextRequest} from 'next/server';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {GET} from './route';

const SIGNING_KEY = 'test-signing-key';
const USER_SECRET = 'user-bypass-secret';
const DEVELOP_SECRET = 'develop-bypass-secret';

const ENDPOINT = 'https://docs.sentry.io/api/preview-share';

function sign(url: string, exp: number): string {
  return createHmac('sha256', SIGNING_KEY).update(`${url}|${exp}`).digest('hex');
}

function buildRequest({
  u,
  exp,
  sig,
}: {
  exp?: number | string;
  sig?: string;
  u?: string;
}): NextRequest {
  const params = new URLSearchParams();
  if (u !== undefined) params.set('u', u);
  if (exp !== undefined) params.set('exp', String(exp));
  if (sig !== undefined) params.set('sig', sig);
  return new NextRequest(`${ENDPOINT}?${params.toString()}`);
}

const FUTURE = () => Math.floor(Date.now() / 1000) + 60 * 60;
const PAST = () => Math.floor(Date.now() / 1000) - 60;

describe('preview-share route', () => {
  beforeEach(() => {
    vi.stubEnv('SHARE_LINK_SIGNING_KEY', SIGNING_KEY);
    vi.stubEnv('BYPASS_SECRET_USER_DOCS', USER_SECRET);
    vi.stubEnv('BYPASS_SECRET_DEVELOP_DOCS', DEVELOP_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('redirects a valid user-docs link with the user bypass secret', () => {
    const u = 'https://sentry-docs-git-my-branch.sentry.dev';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));

    expect(res.status).toBe(302);
    const location = new URL(res.headers.get('location')!);
    expect(location.host).toBe('sentry-docs-git-my-branch.sentry.dev');
    expect(location.searchParams.get('x-vercel-protection-bypass')).toBe(USER_SECRET);
    expect(location.searchParams.get('x-vercel-set-bypass-cookie')).toBe('true');
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('redirects a valid develop-docs link with the develop bypass secret', () => {
    const u = 'https://develop-docs-git-my-branch.sentry.dev';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));

    expect(res.status).toBe(302);
    const location = new URL(res.headers.get('location')!);
    expect(location.searchParams.get('x-vercel-protection-bypass')).toBe(DEVELOP_SECRET);
  });

  it('accepts vercel.app generated preview hosts', () => {
    const u = 'https://sentry-docs-abc123-getsentry.vercel.app';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));
    expect(res.status).toBe(302);
  });

  it('returns 400 when params are missing', () => {
    const res = GET(buildRequest({u: 'https://sentry-docs-git-x.sentry.dev'}));
    expect(res.status).toBe(400);
  });

  it('returns 403 for a bad signature', () => {
    const u = 'https://sentry-docs-git-my-branch.sentry.dev';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: 'deadbeef'}));
    expect(res.status).toBe(403);
  });

  it('returns 403 if the url is swapped after signing', () => {
    const signed = 'https://sentry-docs-git-my-branch.sentry.dev';
    const evil = 'https://develop-docs-git-my-branch.sentry.dev';
    const exp = FUTURE();
    const res = GET(buildRequest({u: evil, exp, sig: sign(signed, exp)}));
    expect(res.status).toBe(403);
  });

  it('returns 410 for an expired link', () => {
    const u = 'https://sentry-docs-git-my-branch.sentry.dev';
    const exp = PAST();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));
    expect(res.status).toBe(410);
  });

  it('returns 400 for a disallowed host', () => {
    const u = 'https://evil.example.com';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));
    expect(res.status).toBe(400);
  });

  it('returns 400 for a non-https target', () => {
    const u = 'http://sentry-docs-git-my-branch.sentry.dev';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));
    expect(res.status).toBe(400);
  });

  it('fails closed when the signing key is not configured', () => {
    vi.stubEnv('SHARE_LINK_SIGNING_KEY', '');
    const u = 'https://sentry-docs-git-my-branch.sentry.dev';
    const exp = FUTURE();
    const res = GET(buildRequest({u, exp, sig: sign(u, exp)}));
    expect(res.status).toBe(500);
  });
});
