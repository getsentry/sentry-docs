import 'server-only';

import {createHmac, randomUUID, timingSafeEqual} from 'node:crypto';

import {AskAiError, Session} from './store';

const TTL_MS = 60 * 60 * 1000;
type PreviewSession = {expiresAt: number; session: Session};

// A protected preview can evaluate Fin without provisioning shared storage.
// Never silently switch to this mode when a configured Redis service fails.
export function isStatelessPreview() {
  if (process.env.FIN_REDIS_REST_URL || process.env.FIN_REDIS_REST_TOKEN) return false;
  if (
    process.env.VERCEL_ENV === 'preview' ||
    (!process.env.VERCEL_ENV && process.env.NODE_ENV !== 'production')
  )
    return true;
  throw new AskAiError(503, 'Ask AI is not configured for this deployment.');
}

function signature(payload: string) {
  const secret = process.env.FIN_AGENT_API_KEY;
  if (!secret) throw new AskAiError(503, 'Ask AI is not available yet. Use docs search.');
  return createHmac('sha256', secret)
    .update('docs-fin-preview-v1\0')
    .update(process.env.FIN_PUBLIC_ORIGIN || 'local')
    .update('\0')
    .update(payload)
    .digest();
}

function encode(value: PreviewSession) {
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${payload}.${signature(payload).toString('base64url')}`;
}

function decode(token: string): PreviewSession {
  if (token.length > 4096 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/.test(token))
    throw new AskAiError(401, 'Start a new conversation.');
  const [payload, mac] = token.split('.');
  if (!timingSafeEqual(signature(payload), Buffer.from(mac, 'base64url')))
    throw new AskAiError(401, 'Start a new conversation.');
  const value = JSON.parse(
    Buffer.from(payload, 'base64url').toString()
  ) as PreviewSession;
  if (!Number.isFinite(value.expiresAt) || value.expiresAt <= Date.now())
    throw new AskAiError(401, 'This conversation expired. Start a new one.');
  return value;
}

export function createPreviewSession(path: string) {
  const session: Session = {
    conversationId: `docs-${randomUUID()}`,
    userId: `docs-anonymous-${randomUUID()}`,
    path,
    state: 'new',
    turns: 0,
  };
  return {session, token: encode({session, expiresAt: Date.now() + TTL_MS})};
}

export function getPreviewSession(token: string) {
  return decode(token).session;
}

// Only issue the next token after a complete answer. Keep the original expiry.
// Tokens are replayable: shared locks and hard usage budgets require Redis.
export function updatePreviewSession(token: string, session: Session) {
  return encode({...decode(token), session});
}
