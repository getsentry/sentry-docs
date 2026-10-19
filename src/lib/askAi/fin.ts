import 'server-only';

import {AskAiError} from './store';
import {AskAiEvent, safeSourceUrl} from './types';

export function apiOrigin() {
  const region = process.env.FIN_REGION || 'us';
  const origins: Record<string, string> = {
    us: 'https://api.intercom.io',
    eu: 'https://api.eu.intercom.io',
    au: 'https://api.au.intercom.io',
  };
  if (!origins[region]) throw new AskAiError(503, 'Ask AI is not configured.');
  return origins[region];
}

export async function callFin(path: 'start' | 'reply' | 'escalate', body: object) {
  const token = process.env.FIN_AGENT_API_KEY;
  if (!token) throw new AskAiError(503, 'Ask AI is not available yet. Use docs search.');
  const response = await fetch(`${apiOrigin()}/fin/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Intercom-Version': '2.17',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(15_000),
  });
  // Don't expose vendor responses, tokens, questions, or email addresses in logs.
  if (!response.ok)
    throw new AskAiError(
      502,
      'Ask AI could not complete this request. Start a new conversation.'
    );
  return (await response.json()) as {
    intercom_conversation_id?: string;
    sse_subscription_url?: string;
    errors?: unknown;
  };
}

export function validateStreamUrl(value: unknown): string {
  if (typeof value !== 'string')
    throw new AskAiError(503, 'Ask AI streaming is not available.');
  const url = new URL(value);
  // Explicit deployment allowlist, not a suffix match. These URLs contain a
  // short-lived bearer token and are fetched only by our backend.
  const hosts = (process.env.FIN_SSE_HOSTS || 'primary-realtime.intercom-messenger.com')
    .split(',')
    .map(host => host.trim());
  if (
    url.protocol !== 'https:' ||
    url.port ||
    url.username ||
    url.password ||
    !hosts.includes(url.hostname) ||
    url.pathname !== '/event-stream'
  ) {
    throw new AskAiError(502, 'Ask AI returned an unsupported stream.');
  }
  return url.href;
}

export function normalizeFinEvent(
  raw: Record<string, unknown>,
  conversationId: string
): AskAiEvent | null {
  if (raw.conversation_id !== conversationId) return null;
  if (
    raw.event_name === 'fin_reply_chunk' &&
    typeof raw.stream_id === 'string' &&
    typeof raw.chunk_text === 'string' &&
    Number.isInteger(raw.chunk_index)
  ) {
    return {
      type: 'chunk',
      id: raw.stream_id,
      text: raw.chunk_text,
      index: raw.chunk_index as number,
    };
  }
  if (raw.event_name === 'fin_replied') {
    const message = raw.message as
      | {id?: unknown; body?: unknown; sources?: unknown}
      | undefined;
    if (!message || typeof message.id !== 'string' || typeof message.body !== 'string')
      return null;
    const sources = Array.isArray(message.sources)
      ? message.sources.flatMap(source => {
          const url = safeSourceUrl(source?.url);
          return url && typeof source?.title === 'string'
            ? [{title: source.title, url}]
            : [];
        })
      : [];
    return {
      type: 'answer',
      id: message.id,
      html: message.body,
      sources,
      ...(typeof raw.stream_id === 'string' ? {streamId: raw.stream_id} : {}),
    };
  }
  if (
    raw.event_name === 'fin_status_updated' &&
    ['awaiting_user_reply', 'escalated', 'resolved', 'complete'].includes(
      String(raw.status)
    )
  ) {
    return {type: 'status', status: String(raw.status)};
  }
  return null;
}
