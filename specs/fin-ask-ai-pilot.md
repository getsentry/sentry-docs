# Fin Ask AI Pilot

This branch preserves the docs Ask AI buttons, dialog, example questions, follow-ups, sanitized answers, citations, and transcript copying. Fin runs through server-side API calls. Neither Intercom Messenger nor new browser cookies or storage are required. Kapa remains the default outside explicitly configured deployments.

## Use The Existing Private R2 Bucket

The webhook pilot uses Cloudflare R2, which docs already uses for Markdown exports. **Use an existing private bucket, not the public docs export buckets.** The application rejects the known `sentry-docs` and `sentry-develop-docs` bucket names. Other buckets must be checked for public access by their owner; the application cannot verify their access policy.

Set these server variables in Vercel, scoped to Preview and `feat/fin-ask-ai-pilot`:

```env
ASK_AI_PROVIDER=fin
FIN_PILOT_ENABLED=true
FIN_AGENT_API_KEY=<existing Fin Agent API key>
FIN_PUBLIC_ORIGIN=https://sentry-docs-git-feat-fin-ask-ai-pilot.sentry.dev
FIN_R2_BUCKET=<existing private bucket name>
FIN_WEBHOOK_SECRET=<Fin Agent API webhook signing secret>
```

`FIN_R2_BUCKET` selects webhook delivery. This mode does not call Redis or consume Fin's SSE subscription URL. Keep the preview disabled until the bucket and webhook are configured, then redeploy so Vercel applies the environment changes.

The R2 client defaults to the docs Cloudflare account and reuses `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` when available to the runtime. The credentials need object read, list, and write access to the private bucket. If the existing credentials lack that access, use a bucket-scoped credential pair in `FIN_R2_ACCESS_KEY_ID` and `FIN_R2_SECRET_ACCESS_KEY`. For a different account, set its 32-character ID as `FIN_R2_ACCOUNT_ID`. Keep credentials in Vercel secrets, never in chat or source control.

Before sending live questions:

1. Confirm that public access and public custom domains are disabled for the private bucket.
2. Add a lifecycle rule deleting objects under **`fin-ask-ai/` after one day**. Restrict the rule to this prefix so unrelated bucket contents are unaffected. Session expiry prevents reads after one hour; it does not physically delete objects. The lifecycle rule performs deletion asynchronously.
3. In **Fin AI Agent → Deploy → Fin Agent API**, configure the webhook URL:
   `https://sentry-docs-git-feat-fin-ask-ai-pilot.sentry.dev/api/ask-ai/webhook/`
4. Copy the generated signing secret to `FIN_WEBHOOK_SECRET`. If a webhook already serves support, coordinate delivery with its owner; do not replace an existing support callback without checking its consumers.
5. Restrict the preview to testers. Fin must be able to reach the webhook path through deployment protection; requests still require a valid Fin HMAC signature. Keep the chat endpoint protected. The pilot has no shared daily spending limit.
6. Redeploy, open Ask AI, and start a new conversation. Check a multi-part answer, citations, a follow-up, and a completed or escalated conversation.

The default Intercom region is `us`. Set `FIN_REGION=eu` or `au` when appropriate. Set `FIN_ENVIRONMENT` only for a configured Fin for Platforms environment. The server pins `Intercom-Version` to `2.17`, which includes the 2.16 multi-part response semantics.

## How Replies Reach The Dialog

The dialog immediately shows its working indicator. The server submits `/fin/start` or `/fin/reply`, then opens a first-party event stream to the browser. Fin delivers signed `fin_replied` and `fin_status_updated` webhooks to a separate request handler. That handler verifies the signature, checks that the conversation was created by this deployment and has not expired, and writes individual immutable event objects to R2.

The browser-facing server polls that conversation's R2 prefix once per second and forwards new answer parts with their citations. It does not wait for the entire answer to render the first part. Webhooks provide answer parts, not token-by-token `fin_reply_chunk` events.

A turn finishes at the first `awaiting_user_reply` or `complete` in Fin's event timeline. A later `complete`, `resolved`, or `escalated` cannot override that terminal event. Escalation or resolution before the terminal event closes the conversation, matching the direct-SSE adapter. State changes are buffered during the three-second settling period so reordered delivery cannot prematurely close the dialog. If terminal timestamps tie, `awaiting_user_reply` takes precedence.

Each request also uses Fin's response `created_at_ms` as its lower timestamp boundary. A delayed status from the preceding turn is ignored if it predates this response, even when it is later than the preceding `awaiting_user_reply`. Request and event timestamps use Fin's clock, not the Vercel server's clock. A missing or malformed response timestamp fails the request without retrying it. Fin's events do not carry a turn ID, so timestamp-based separation still depends on the provider's event chronology; it cannot identify an old-turn event newly timestamped after the next request's response.

The settling period accommodates parts delivered after a terminal status. Answer parts delayed beyond that window are retained and replayed on a subsequent turn; they are not pushed into an already closed connection. This limitation needs evaluation with real delivery latency before rollout. Missing terminal events time out after 90 seconds without resending the billable Fin request.

R2 conditional writes serialize turns across server instances. Replayed tokens and concurrent submissions cannot start the same turn twice. An ambiguous Fin or storage failure ends the session rather than risking a duplicate question. Duplicate webhook deliveries use the same object key. Listing the full event prefix on each poll picks up out-of-order arrivals; previously read objects are not fetched again within that connection.

Signed session tokens remain only in React memory. Sessions expire after one hour and are limited to 20 turns. Tokens are bound to the configured origin; all chat requests require the same origin. Object paths also separate deployments by origin. Production use is blocked: this is still a protected evaluation, not a public launch.

R2 contains session metadata, final answer parts, sources, and statuses. Questions are sent to Fin but are not separately stored in R2; answers can quote questions. No access keys or Fin stream URLs are sent to the browser. The bucket is read only by server code; there are no browser R2 requests or public object URLs. The existing CSP's `connect-src 'self'` covers Ask AI. No Fin or R2 browser allowlist is needed.

## Existing Paths And Future Work

If `FIN_R2_BUCKET` is unset, the earlier direct-SSE path remains available for workspaces that actually return `sse_subscription_url`. There is no assumed SSE settings toggle. That path can use signed preview tokens or the older Redis-backed implementation. Neither Redis nor that older feedback/export path is required for the R2 evaluation.

The R2 pilot hides local feedback and direct support handoff controls. It retains transcript copying and an optional `ASK_AI_SUPPORT_URL`. Fin may still escalate according to its configured workflow. Confirm support routing before live evaluation and avoid configuring API traffic to change existing support behavior unexpectedly.

The internal docs-agent feedback loop is not implemented by this transport change. A later iteration can consume verified webhook events using the existing R2 stack, add redacted questions and helpfulness signals, and join conversations to support outcomes. It does not need a Redis dependency. Agree on retention and access before exporting evidence. Suggested sequence: cluster recurring questions, identify documentation gaps, propose changes with supporting sources, obtain review, then open draft PRs.

## Validation And Rollback

Tests cover signed session access, separate handler instances, multi-part replies without a Fin SSE URL, duplicate and reordered events, replay and concurrent-submission protection, expiration, storage failures, upstream timeouts, escalation completion, and protection against using the public docs buckets. Existing SSE and Redis tests remain regression coverage for their respective paths. Live private-bucket permissions, webhook configuration, lifecycle deletion, and actual Fin answer delivery require deployment verification.

To pause the pilot, set `FIN_PILOT_ENABLED=false` and redeploy. To restore Kapa, set `ASK_AI_PROVIDER=kapa` and redeploy. These changes do not delete data already held by R2 or Intercom.

References:

- [Fin events and turn completion](https://developers.intercom.com/docs/guides/fin-agent-api#listening-to-events)
- [Fin webhook setup and signature verification](https://developers.intercom.com/docs/guides/fin-agent-api/setup)
- [R2 conditional operations](https://developers.cloudflare.com/r2/api/s3/conditional-operations/)
- [R2 object lifecycle rules](https://developers.cloudflare.com/r2/buckets/object-lifecycles/)
