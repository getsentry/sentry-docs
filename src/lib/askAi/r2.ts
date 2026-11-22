import 'server-only';

import {createHash} from 'node:crypto';

import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import {AskAiError, Session} from './store';
import {AskAiEvent} from './types';

export type WebhookSession = {
  session: Session;
  expiresAt: number;
  // Fin's event timestamp at the end of the preceding turn, not our server clock.
  after: number;
};
export type StoredFinEvent = {at: number; event: AskAiEvent};

export function usesR2Webhooks() {
  return Boolean(process.env.FIN_R2_BUCKET);
}

function configuration() {
  const bucket = process.env.FIN_R2_BUCKET || '';
  const account = process.env.FIN_R2_ACCOUNT_ID || '773afa1f62ff86c80db4f24f7ff1e9c8';
  const accessKeyId = process.env.FIN_R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.FIN_R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
  if (
    !/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(bucket) ||
    ['sentry-docs', 'sentry-develop-docs'].includes(bucket) ||
    !/^[a-f0-9]{32}$/.test(account) ||
    !accessKeyId ||
    !secretAccessKey ||
    !process.env.FIN_PUBLIC_ORIGIN
  )
    throw new AskAiError(503, 'Ask AI is not configured. Use docs search.');
  return {bucket, account, accessKeyId, secretAccessKey};
}

let cached: {identity: string; client: S3Client} | undefined;
function storage() {
  const config = configuration();
  const identity = JSON.stringify(config);
  if (cached?.identity !== identity) {
    cached?.client.destroy();
    cached = {
      identity,
      client: new S3Client({
        region: 'auto',
        endpoint: `https://${config.account}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: config.accessKeyId!,
          secretAccessKey: config.secretAccessKey!,
        },
        // A failed conditional write may already have committed. Fail closed.
        maxAttempts: 1,
      }),
    };
  }
  return {bucket: config.bucket, client: cached.client};
}

function prefix(conversationId: string) {
  if (!/^docs-[a-f0-9-]{36}$/.test(conversationId))
    throw new AskAiError(401, 'Start a new conversation.');
  const origin = createHash('sha256')
    .update(process.env.FIN_PUBLIC_ORIGIN || '')
    .digest('hex');
  return `fin-ask-ai/${origin}/${conversationId}/`;
}

function status(error: unknown) {
  return (error as {$metadata?: {httpStatusCode?: number}})?.$metadata?.httpStatusCode;
}

async function get<T>(key: string): Promise<{value: T; etag: string} | null> {
  const {bucket, client} = storage();
  try {
    const result = await client.send(new GetObjectCommand({Bucket: bucket, Key: key}), {
      abortSignal: AbortSignal.timeout(5000),
    });
    if (!result.Body || !result.ETag) throw new Error('Missing R2 object body');
    return {value: JSON.parse(await result.Body.transformToString()), etag: result.ETag};
  } catch (error) {
    if (status(error) === 404) return null;
    throw error;
  }
}

function put(key: string, value: unknown, etag?: string) {
  const {bucket, client} = storage();
  return client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(value),
      ContentType: 'application/json',
      CacheControl: 'no-store, private',
      ...(etag ? {IfMatch: etag} : {IfNoneMatch: '*'}),
    }),
    {abortSignal: AbortSignal.timeout(5000)}
  );
}

export async function readWebhookSession(conversationId: string) {
  const result = await get<WebhookSession>(`${prefix(conversationId)}session.json`);
  if (!result || result.value.expiresAt <= Date.now()) return null;
  return result;
}

export async function writeWebhookSession(value: WebhookSession, etag?: string) {
  try {
    const result = await put(
      `${prefix(value.session.conversationId)}session.json`,
      value,
      etag
    );
    if (!result.ETag) throw new Error('Missing R2 object ETag');
    return result.ETag;
  } catch (error) {
    if (status(error) === 412 || status(error) === 409)
      throw new AskAiError(
        409,
        'This turn was already submitted. Start a new conversation.'
      );
    throw error;
  }
}

export async function saveWebhookEvent(
  conversationId: string,
  raw: Record<string, unknown>,
  event: AskAiEvent
) {
  const at =
    typeof raw.created_at_ms === 'number' || /^\d+$/.test(String(raw.created_at_ms))
      ? Number(raw.created_at_ms)
      : Date.parse(String(raw.created_at_ms));
  if (!Number.isSafeInteger(at) || at < 0)
    throw new AskAiError(400, 'Webhook event timestamp is missing or malformed.');
  // Stable keys make Fin retries idempotent. Never append to a shared JSON array.
  const id = createHash('sha256').update(JSON.stringify(event)).digest('hex');
  const key = `${prefix(conversationId)}events/${String(at).padStart(16, '0')}-${id}.json`;
  try {
    await put(key, {at, event} satisfies StoredFinEvent);
  } catch (error) {
    if (status(error) !== 412) throw error;
  }
}

export async function listWebhookEvents(conversationId: string) {
  const {bucket, client} = storage();
  const result = await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: `${prefix(conversationId)}events/`,
      MaxKeys: 1000,
    }),
    {abortSignal: AbortSignal.timeout(5000)}
  );
  // Bound work and response size instead of silently dropping overflow events.
  if (result.IsTruncated) throw new AskAiError(429, 'Start a new conversation.');
  return (result.Contents || []).flatMap(object => (object.Key ? [object.Key] : []));
}

export async function readWebhookEvent(key: string) {
  const result = await get<StoredFinEvent>(key);
  if (!result) throw new Error('Webhook event disappeared');
  return result.value;
}
