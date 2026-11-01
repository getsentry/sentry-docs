import 'server-only';

import {createHash, randomBytes, randomUUID} from 'node:crypto';

export class AskAiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export type Session = {
  conversationId: string;
  userId: string;
  path: string;
  state: 'new' | 'busy' | 'ready' | 'closed' | 'failed';
  turns: number;
  intercomId?: string;
  handedOff?: boolean;
};

const SESSION_TTL = 60 * 60;
export const RETENTION_SECONDS = 7 * 24 * 60 * 60;
const PREFIX = 'docs-fin-pilot:';

// A REST-compatible Redis service keeps locks, budgets, and evidence shared
// across serverless instances. Never fall back to process memory in production.
export async function redis<T>(...command: (string | number)[]): Promise<T> {
  const url = process.env.FIN_REDIS_REST_URL;
  const token = process.env.FIN_REDIS_REST_TOKEN;
  if (!url?.startsWith('https://') || !token) {
    throw new AskAiError(503, 'Ask AI is not available yet. Use docs search.');
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(command),
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
    redirect: 'error',
  });
  if (!response.ok) throw new AskAiError(503, 'Ask AI is temporarily unavailable.');
  const data = (await response.json()) as {result: T; error?: string};
  if (data.error) throw new AskAiError(503, 'Ask AI is temporarily unavailable.');
  return data.result;
}

export function key(value: string) {
  return `${PREFIX}${value}`;
}

export function sessionKey(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token))
    throw new AskAiError(401, 'Start a new conversation.');
  return key(`session:${createHash('sha256').update(token).digest('hex')}`);
}

export async function saveSession(token: string, session: Session) {
  await redis('SET', sessionKey(token), JSON.stringify(session), 'EX', SESSION_TTL);
}

export async function getSession(token: string): Promise<Session> {
  const value = await redis<string | null>('GET', sessionKey(token));
  if (!value) throw new AskAiError(401, 'This conversation expired. Start a new one.');
  return JSON.parse(value) as Session;
}

export async function createSession(path: string) {
  await takeBudget('sessions', 500);
  const token = randomBytes(32).toString('hex');
  const session: Session = {
    conversationId: `docs-${randomUUID()}`,
    userId: `docs-anonymous-${randomUUID()}`,
    path,
    state: 'new',
    turns: 0,
  };
  await saveSession(token, session);
  // Lets signed webhooks reject conversations outside this pilot.
  await redis(
    'SET',
    key(`conversation:${session.conversationId}`),
    '1',
    'EX',
    RETENTION_SECONDS
  );
  return {token, session};
}

export async function takeBudget(name: string, limit: number) {
  const count = await redis<number>(
    'EVAL',
    "local n = redis.call('INCR', KEYS[1]); if n == 1 then redis.call('EXPIRE', KEYS[1], 172800) end; return n",
    1,
    key(`budget:${new Date().toISOString().slice(0, 10)}:${name}`)
  );
  if (count > limit)
    throw new AskAiError(429, 'Ask AI has reached its pilot limit. Use docs search.');
}

export async function lockSession(token: string) {
  const lock = `${sessionKey(token)}:lock`;
  const owner = randomUUID();
  if (!(await redis('SET', lock, owner, 'NX', 'EX', 150))) {
    throw new AskAiError(409, 'wait for the current answer to finish.');
  }
  return async () => {
    await redis(
      'EVAL',
      "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end; return 0",
      1,
      lock,
      owner
    );
  };
}

export async function recordEvent(
  conversationId: string,
  type: string,
  data: Record<string, unknown>,
  dedupeId: string = randomUUID()
) {
  const event = {
    schemaVersion: 1,
    id: dedupeId,
    conversationId,
    type,
    at: new Date().toISOString(),
    data,
  };
  const stream = key(`events:${event.at.slice(0, 10)}`);
  // Deduplication + append are atomic, so a failed append can be retried safely.
  await redis(
    'EVAL',
    `
    if redis.call('EXISTS', KEYS[1]) == 1 then return 0 end
    redis.call('XADD', KEYS[2], '*', 'event', ARGV[1])
    redis.call('EXPIRE', KEYS[2], ARGV[2])
    redis.call('SET', KEYS[1], '1', 'EX', ARGV[2])
    return 1
  `,
    2,
    key(
      `event:${createHash('sha256').update(`${conversationId}:${dedupeId}`).digest('hex')}`
    ),
    stream,
    JSON.stringify(event),
    RETENTION_SECONDS
  );
}
