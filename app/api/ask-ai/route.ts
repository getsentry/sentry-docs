import {callFin, normalizeFinEvent, validateStreamUrl} from 'sentry-docs/lib/askAi/fin';
import {
  bearerToken,
  errorResponse,
  privateHeaders,
  readJson,
  requirePilot,
  requireSameOrigin,
} from 'sentry-docs/lib/askAi/http';
import {
  createPreviewSession,
  getPreviewSession,
  isStatelessPreview,
  updatePreviewSession,
} from 'sentry-docs/lib/askAi/previewSession';
import {
  AskAiError,
  createSession,
  getSession,
  key,
  lockSession,
  recordEvent,
  redis,
  saveSession,
  takeBudget,
} from 'sentry-docs/lib/askAi/store';
import {
  AskAiEvent,
  MAX_QUESTION_LENGTH,
  readEventStream,
} from 'sentry-docs/lib/askAi/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    requirePilot();
    requireSameOrigin(request);
    const stateless = isStatelessPreview();
    const persist = stateless ? async () => {} : saveSession;
    const record = stateless ? async () => {} : recordEvent;
    const body = await readJson(request);
    if (body.action === 'session') {
      const path = typeof body.path === 'string' ? body.path.split(/[?#]/)[0] : '/';
      if (
        !/^\/[a-zA-Z0-9/_\.~-]*$/.test(path) ||
        path.length > 500 ||
        path.startsWith('//')
      )
        throw new AskAiError(400, 'Invalid docs path.');
      const {token} = stateless ? createPreviewSession(path) : await createSession(path);
      return Response.json(
        {
          token,
          capabilities: {
            feedback: !stateless,
            handoff: !stateless && process.env.FIN_HANDOFF_ENABLED === 'true',
          },
        },
        {headers: privateHeaders}
      );
    }

    if (stateless && body.action !== 'message')
      throw new AskAiError(503, 'This feature is not enabled for this preview.');
    const token = bearerToken(request);
    const release = stateless ? async () => {} : await lockSession(token);
    let streaming = false;
    try {
      const session = stateless ? getPreviewSession(token) : await getSession(token);
      if (body.action === 'feedback') {
        if (
          !['helpful', 'unhelpful'].includes(String(body.rating)) ||
          typeof body.messageId !== 'string' ||
          body.messageId.length > 200
        )
          throw new AskAiError(400, 'Invalid feedback.');
        const exists = await redis(
          'GET',
          key(`answer:${session.conversationId}:${body.messageId}`)
        );
        if (!exists) throw new AskAiError(400, 'Answer not found.');
        await record(
          session.conversationId,
          'feedback',
          {messageId: body.messageId, rating: body.rating},
          `feedback:${body.messageId}`
        );
        return Response.json({ok: true}, {headers: privateHeaders});
      }

      if (body.action === 'handoff') {
        if (process.env.FIN_HANDOFF_ENABLED !== 'true')
          throw new AskAiError(503, 'use the support link.');
        if (!session.intercomId || session.state === 'busy' || session.handedOff)
          throw new AskAiError(409, 'This conversation cannot be handed off again.');
        if (
          typeof body.email !== 'string' ||
          body.email.length > 254 ||
          !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(body.email)
        )
          throw new AskAiError(400, 'Enter a valid email address.');
        // Persist before the external side effect; never automatically retry an
        // ambiguous result, which could create duplicate support conversations.
        session.handedOff = true;
        await persist(token, session);
        await record(session.conversationId, 'support_requested', {
          intercomConversationId: session.intercomId,
          path: session.path,
        });
        const result = await callFin('escalate', {
          conversation_id: session.conversationId,
          context: `Docs Ask AI pilot. Page: ${session.path}. Original Intercom conversation: ${session.intercomId}. User supplied this email for follow-up (unverified): ${body.email}. Do not use this email as proof of account ownership.`,
        });
        session.state = 'closed';
        await persist(token, session);
        await record(session.conversationId, 'support_handoff', {
          intercomConversationId: session.intercomId,
          supportConversationId: result.intercom_conversation_id ?? null,
        });
        return Response.json({ok: true}, {headers: privateHeaders});
      }

      if (
        body.action !== 'message' ||
        typeof body.question !== 'string' ||
        !body.question.trim() ||
        body.question.length > MAX_QUESTION_LENGTH
      )
        throw new AskAiError(400, 'Enter a question of 4,000 characters or fewer.');
      if (!['new', 'ready'].includes(session.state))
        throw new AskAiError(409, 'start a new conversation.');
      if (session.turns >= 20) throw new AskAiError(429, 'start a new conversation.');
      if (!stateless) {
        const configuredLimit = Number(process.env.FIN_DAILY_TURN_LIMIT || '100');
        if (!Number.isInteger(configuredLimit) || configuredLimit < 1)
          throw new AskAiError(503, 'Ask AI is not configured.');
        await takeBudget('turns', configuredLimit);
      }
      const start = session.state === 'new';
      session.state = 'busy';
      session.turns += 1;
      await persist(token, session);
      await record(session.conversationId, 'question', {
        question: body.question.trim(),
        path: session.path,
        turn: session.turns,
      });

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
        await persist(token, session);
        await record(session.conversationId, 'linked', {
          intercomConversationId: session.intercomId ?? null,
          metadataAccepted: !result.errors,
        });
        const streamUrl = validateStreamUrl(result.sse_subscription_url);
        const abort = new AbortController();
        const timeout = setTimeout(() => abort.abort(), 90_000);
        const upstream = await fetch(streamUrl, {
          cache: 'no-store',
          redirect: 'error',
          signal: abort.signal,
        }).catch(error => {
          clearTimeout(timeout);
          throw error;
        });
        if (
          !upstream.ok ||
          !upstream.body ||
          !upstream.headers.get('content-type')?.includes('text/event-stream')
        ) {
          clearTimeout(timeout);
          abort.abort();
          throw new AskAiError(
            502,
            'Ask AI could not connect. Start a new conversation.'
          );
        }

        const encoder = new TextEncoder();
        let cancelled = false;
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const send = (event: AskAiEvent) => {
              if (!cancelled)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
            };
            let finished = false;
            let closed = false;
            try {
              send({
                type: 'reference',
                reference: session.intercomId || session.conversationId,
              });
              for await (const raw of readEventStream(upstream.body!)) {
                const event = normalizeFinEvent(raw, session.conversationId);
                if (!event) continue;
                if (event.type === 'answer') {
                  await record(
                    session.conversationId,
                    'answer',
                    {...event},
                    `answer:${event.id}`
                  );
                  if (!stateless)
                    await redis(
                      'SET',
                      key(`answer:${session.conversationId}:${event.id}`),
                      '1',
                      'EX',
                      3600
                    );
                }
                if (event.type === 'status') {
                  if (event.status === 'escalated') session.handedOff = true;
                  await record(
                    session.conversationId,
                    'status',
                    {status: event.status},
                    `status:${event.status}:${raw.created_at_ms}`
                  );
                  closed ||=
                    event.status === 'escalated' ||
                    event.status === 'resolved' ||
                    event.status === 'complete';
                }
                if (
                  event.type === 'status' &&
                  ['awaiting_user_reply', 'complete'].includes(event.status)
                ) {
                  session.state = closed ? 'closed' : 'ready';
                  await persist(token, session);
                  if (stateless)
                    send({type: 'session', token: updatePreviewSession(token, session)});
                  send(event);
                  finished = true;
                  break;
                }
                send(event);
              }
              if (!finished) throw new Error('Incomplete Fin stream');
            } catch {
              session.state = 'failed';
              await persist(token, session).catch(() => {});
              send({
                type: 'error',
                message:
                  'The answer was interrupted. Start a new conversation or contact support.',
              });
            } finally {
              clearTimeout(timeout);
              abort.abort();
              await release().catch(() => {});
              if (!cancelled) controller.close();
            }
          },
          cancel() {
            cancelled = true;
            abort.abort();
          },
        });
        streaming = true;
        return new Response(stream, {
          headers: {
            ...privateHeaders,
            'Content-Type': 'text/event-stream',
            'X-Accel-Buffering': 'no',
          },
        });
      } catch (error) {
        session.state = 'failed';
        await persist(token, session).catch(() => {});
        throw error;
      }
    } finally {
      if (!streaming) await release();
    }
  } catch (error) {
    return errorResponse(error);
  }
}
