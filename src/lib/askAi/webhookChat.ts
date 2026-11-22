import 'server-only';

import {callFin} from './fin';
import {bearerToken, privateHeaders} from './http';
import {
  createPreviewSession,
  getPreviewSession,
  updatePreviewSession,
} from './previewSession';
import {
  listWebhookEvents,
  readWebhookEvent,
  readWebhookSession,
  WebhookSession,
  writeWebhookSession,
} from './r2';
import {AskAiError} from './store';
import {AskAiEvent, MAX_QUESTION_LENGTH} from './types';

const TURN_TIMEOUT_MS = 90_000;
const POLL_MS = 1000;
const SETTLE_MS = 3000;

function pause(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const cancel = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', cancel);
      resolve();
    }, POLL_MS);
    signal.addEventListener('abort', cancel, {once: true});
  });
}

export async function webhookChat(request: Request, body: Record<string, unknown>) {
  // This remains a restricted evaluation, not a public production rollout.
  if (
    process.env.VERCEL_ENV !== 'preview' &&
    (process.env.VERCEL_ENV || process.env.NODE_ENV === 'production')
  )
    throw new AskAiError(503, 'Ask AI is not configured for this deployment.');
  if (!process.env.FIN_WEBHOOK_SECRET)
    throw new AskAiError(503, 'Ask AI is not configured. Use docs search.');

  if (body.action === 'session') {
    const path = typeof body.path === 'string' ? body.path.split(/[?#]/)[0] : '/';
    if (!/^\/[a-zA-Z0-9/_.~-]*$/.test(path) || path.length > 500 || path.startsWith('//'))
      throw new AskAiError(400, 'Invalid docs path.');
    const {session, token} = createPreviewSession(path);
    await writeWebhookSession({session, expiresAt: Date.now() + 3_600_000, after: 0});
    return Response.json(
      {token, capabilities: {feedback: false, handoff: false}},
      {headers: privateHeaders}
    );
  }

  if (body.action !== 'message')
    throw new AskAiError(503, 'This feature is not enabled for this preview.');
  if (
    typeof body.question !== 'string' ||
    !body.question.trim() ||
    body.question.length > MAX_QUESTION_LENGTH
  )
    throw new AskAiError(400, 'Enter a question of 4,000 characters or fewer.');

  const token = bearerToken(request);
  const signed = getPreviewSession(token);
  const stored = await readWebhookSession(signed.conversationId);
  if (!stored) throw new AskAiError(401, 'This conversation expired. Start a new one.');
  const value: WebhookSession = stored.value;
  const {session} = value;
  if (
    session.turns !== signed.turns ||
    session.userId !== signed.userId ||
    !['new', 'ready'].includes(session.state)
  )
    throw new AskAiError(
      409,
      'This turn was already submitted. Start a new conversation.'
    );
  if (session.turns >= 20) throw new AskAiError(429, 'Start a new conversation.');
  const start = session.state === 'new';
  session.state = 'busy';
  session.turns += 1;
  // Conditional object writes serialize turns across Vercel instances. An old
  // token, concurrent submit, or ambiguous upstream failure cannot submit twice.
  let etag = await writeWebhookSession(value, stored.etag);
  try {
    const result = await callFin(start ? 'start' : 'reply', {
      conversation_id: session.conversationId,
      user: {id: session.userId},
      message: {
        author: 'user',
        body: body.question.trim(),
        timestamp: new Date().toISOString(),
      },
      ...(start
        ? {
            conversation_metadata: {
              attributes: {docs_origin: 'docs_ask_ai', docs_path: session.path},
            },
            ...(process.env.FIN_ENVIRONMENT
              ? {environment: process.env.FIN_ENVIRONMENT}
              : {}),
          }
        : {}),
    });
    session.intercomId = result.intercom_conversation_id || session.intercomId;
    etag = await writeWebhookSession(value, etag);
  } catch (error) {
    session.state = 'failed';
    await writeWebhookSession(value, etag).catch(() => {});
    throw error;
  }

  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), TURN_TIMEOUT_MS);
  let cancelled = false;
  const disconnect = () => {
    cancelled = true;
    abort.abort();
  };
  request.signal.addEventListener('abort', disconnect, {once: true});
  if (request.signal.aborted) disconnect();
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AskAiEvent) => {
        if (!cancelled)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      const seen = new Set<string>();
      const answers = new Set<string>();
      let terminal: {at: number; status: string} | undefined;
      let changedAt = Date.now();
      let closed = false;
      try {
        send({
          type: 'reference',
          reference: session.intercomId || session.conversationId,
        });
        while (!abort.signal.aborted) {
          if (value.expiresAt <= Date.now()) throw new Error('Session expired');
          // List the complete prefix each time: late deliveries can sort before
          // earlier arrivals. Fetch only objects this connection has not read.
          const keys = await listWebhookEvents(session.conversationId);
          for (const key of keys) {
            if (seen.has(key)) continue;
            const {at, event} = await readWebhookEvent(key);
            seen.add(key);
            // Replay answers on follow-up so a delayed previous-turn webhook can
            // still be recovered. The client upserts by message ID.
            if (event.type === 'answer' && !answers.has(event.id)) {
              answers.add(event.id);
              send(event);
              changedAt = Date.now();
            }
            if (at <= value.after || event.type !== 'status') continue;
            changedAt = Date.now();
            closed ||= ['resolved', 'escalated', 'complete'].includes(event.status);
            if (['awaiting_user_reply', 'complete'].includes(event.status)) {
              if (!terminal || at >= terminal.at) terminal = {at, status: event.status};
            } else {
              send(event);
            }
          }
          // Webhook delivery can be reordered. Give trailing answer parts time
          // to arrive before finishing this connection; later parts are retained
          // for replay on the next turn. This is not token-by-token streaming.
          if (terminal && Date.now() - changedAt >= SETTLE_MS) {
            if (closed && terminal.status !== 'complete') {
              await pause(abort.signal);
              continue;
            }
            session.state = closed ? 'closed' : 'ready';
            value.after = terminal.at;
            etag = await writeWebhookSession(value, etag);
            send({type: 'session', token: updatePreviewSession(token, session)});
            send({type: 'status', status: terminal.status});
            return;
          }
          if (!cancelled) controller.enqueue(encoder.encode(': waiting\n\n'));
          await pause(abort.signal);
        }
        throw new Error('Fin webhook timeout');
      } catch {
        session.state = 'failed';
        await writeWebhookSession(value, etag).catch(() => {});
        send({
          type: 'error',
          message:
            'The answer was interrupted. Start a new conversation or contact support.',
        });
      } finally {
        clearTimeout(timeout);
        request.signal.removeEventListener('abort', disconnect);
        if (!cancelled) controller.close();
      }
    },
    cancel: disconnect,
  });
  return new Response(stream, {
    headers: {
      ...privateHeaders,
      'Content-Type': 'text/event-stream',
      'X-Accel-Buffering': 'no',
    },
  });
}
