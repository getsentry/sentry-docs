import {createHmac, timingSafeEqual} from 'node:crypto';

import {normalizeFinEvent} from 'sentry-docs/lib/askAi/fin';
import {errorResponse, privateHeaders, readBody} from 'sentry-docs/lib/askAi/http';
import {AskAiError, key, recordEvent, redis} from 'sentry-docs/lib/askAi/store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const secret = process.env.FIN_WEBHOOK_SECRET;
    if (!secret) throw new AskAiError(503, 'Webhook is not configured.');
    const body = await readBody(request, 512_000);
    const signature = request.headers
      .get('x-fin-agent-api-webhook-signature')
      ?.replace(/^sha256=/, '');
    const digest = createHmac('sha256', secret).update(body).digest();
    if (
      !signature ||
      !/^[a-fA-F0-9]{64}$/.test(signature) ||
      !timingSafeEqual(digest, Buffer.from(signature, 'hex'))
    )
      throw new AskAiError(401, 'Invalid signature.');
    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(body);
    } catch {
      throw new AskAiError(400, 'Invalid JSON.');
    }
    if (
      !raw ||
      typeof raw.conversation_id !== 'string' ||
      !/^docs-[a-f0-9-]{36}$/.test(raw.conversation_id)
    )
      return Response.json({ok: true}, {headers: privateHeaders});
    const conversationId = raw.conversation_id;
    if (!(await redis('GET', key(`conversation:${conversationId}`))))
      return Response.json({ok: true}, {headers: privateHeaders});
    const event = normalizeFinEvent(raw, conversationId);
    if (event?.type === 'answer')
      await recordEvent(conversationId, 'answer', {...event}, `answer:${event.id}`);
    if (event?.type === 'status')
      await recordEvent(
        conversationId,
        'status',
        {status: event.status},
        `status:${event.status}:${raw.created_at_ms}`
      );
    return Response.json({ok: true}, {headers: privateHeaders});
  } catch (error) {
    return errorResponse(error);
  }
}
