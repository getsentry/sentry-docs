import 'server-only';

import {AskAiError} from './store';

export const privateHeaders = {
  'Cache-Control': 'no-store, private',
  'Referrer-Policy': 'no-referrer',
};

export function requirePilot() {
  if (process.env.ASK_AI_PROVIDER !== 'fin' || process.env.FIN_PILOT_ENABLED !== 'true') {
    throw new AskAiError(503, 'Ask AI is not available yet. Use docs search.');
  }
}

export function requireSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  // Fixed configuration prevents forwarded-host spoofing in production.
  const expected =
    process.env.FIN_PUBLIC_ORIGIN ||
    (process.env.NODE_ENV !== 'production' ? new URL(request.url).origin : '');
  if (
    !expected ||
    origin !== expected ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    throw new AskAiError(403, 'Request origin is not allowed.');
  }
}

export async function readJson(
  request: Request,
  maxBytes = 16_384
): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    throw new AskAiError(415, 'Expected JSON.');
  const text = await readBody(request, maxBytes);
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new AskAiError(400, 'Invalid request.');
  }
}

export async function readBody(request: Request, maxBytes: number) {
  if (Number(request.headers.get('content-length')) > maxBytes)
    throw new AskAiError(413, 'Request is too large.');
  if (!request.body) throw new AskAiError(400, 'Empty request.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      length += value.length;
      if (length > maxBytes) throw new AskAiError(413, 'Request is too large.');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return Buffer.concat(chunks).toString('utf8');
}

export function bearerToken(request: Request) {
  return request.headers.get('authorization')?.replace(/^Bearer /, '') || '';
}

export function errorResponse(error: unknown) {
  const status = error instanceof AskAiError ? error.status : 503;
  const message =
    error instanceof AskAiError
      ? error.message
      : 'Ask AI is temporarily unavailable. Use docs search.';
  return Response.json({error: message}, {status, headers: privateHeaders});
}
