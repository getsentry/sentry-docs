# Fin Ask AI Pilot

This branch adds a first-party Ask AI modal backed by the Fin Agent API. It keeps the header buttons, search-result question submission, example questions, follow-ups, rich answers, citations, and `?askAI=true` entry point. The Fin deployment loads neither Kapa's widget nor Intercom Messenger. Set `ASK_AI_PROVIDER=fin` and `FIN_PILOT_ENABLED=true` to enable it on a protected preview after configuration.

## Start With The API Key

For the first evaluation, use a **protected Vercel preview** with these server variables scoped only to `feat/fin-ask-ai-pilot`:

```env
FIN_AGENT_API_KEY=<your Fin Agent API key>
ASK_AI_PROVIDER=fin
FIN_PILOT_ENABLED=true
FIN_PUBLIC_ORIGIN=https://sentry-docs-git-feat-fin-ask-ai-pilot.sentry.dev
```

Confirm Fin Agent API access and SSE/streaming are enabled. The default region is `us`; set `FIN_REGION` to `eu` or `au` if appropriate and confirm the workspace's SSE hostname. No Redis database, webhook, export token, or additional signing secret is needed for this first test. Keep the pilot disabled until this configuration is ready, then rebuild the preview after setting the flags.

With both Redis variables absent, a Vercel preview or local development server uses signed, one-hour conversation tokens kept only in page memory. The Fin API key signs the token on the server with a separate purpose and origin binding; the key is never sent to the browser. The token contains random conversation/user IDs, the docs path, and turn state, not the transcript. Follow-ups work across serverless instances. Reloading the page starts a new conversation.

This mode has **no shared daily budget, server-side lock, local feedback collection, webhook evidence capture, event export, or direct support handoff**. The UI hides feedback and direct handoff controls; transcript copying and an optional support portal link remain available. Fin still processes and retains the conversation in Intercom. Signed tokens cannot be edited, but old tokens can be replayed, so the 20-turn UI/session limit is not a hard spending limit. Restrict preview access to testers and use provider/edge spending and rate controls before broader access. First-party requests preserve the existing preview-protection login cookie; Ask AI itself sets no cookies. Preview authentication is separate from the public docs cookie policy. Production deployments refuse to run without Redis. If either Redis variable is set, storage failures fail closed rather than falling back to stateless mode.

Add Redis and the feedback integration later, after answer quality is worth pursuing. The existing storage-backed path remains available for that phase.

## What Is Built

- Accessible, responsive dialog with keyboard navigation, focus restoration, light/dark styles, streamed answers, sources, feedback, and conversation copying.
- Server-only `/fin/start` and `/fin/reply` adapter, pinned to API version 2.17. Streams cumulative text and replaces it with sanitized final HTML; waits for all reply parts before accepting a follow-up.
- Conversation token held only in React memory. Stateless preview tokens expire one hour after creation; Redis sessions expire after one hour of inactivity. No new cookies, localStorage, sessionStorage, fingerprinting, or browser requests to Intercom. A page reload starts a new identity; closing/reopening the modal retains the current conversation.
- Same-origin POST checks and bounded inputs in both modes. Redis adds shared locks, a 20-turn session limit, and a configurable daily turn budget. Failures never silently retry a billable request. This is a pilot usage limit, not a replacement for edge rate limiting.
- Optional Redis evidence stream with questions, page paths, final answers/citations, local helpfulness feedback, Fin statuses, and Intercom conversation IDs. Final answer/status webhooks supplement SSE and deduplicate across delivery paths.
- With Redis: authenticated, cursor-based event export for an internal agent. The export has seven-day Redis retention; consumers need their own durable checkpoint and evidence storage.
- With Redis: optional handoff through `/fin/escalate`, preserving the original reference and returned support conversation ID when available. Handoff is disabled until the real routing/follow-up flow has been tested. A configured support portal link and copyable transcript also work without API handoff.

The pilot does not yet run a docs-writing agent, open PRs, ingest later human replies, or join ordinary Algolia searches to tickets. Those are the next stage. With Redis, per-answer helpfulness is stored in our event stream; it is not submitted as Intercom CSAT. Disable Fin's CSAT survey for this pilot deployment: the UI deliberately ends the stream on `complete` and does not render Fin surveys.

## Configuration Reference: Evaluation And Later Integration

The first evaluation needs only the settings above. Redis, webhook/export secrets, and handoff permissions below are for the later support/feedback phase. Provide secrets through the deployment/environment secret manager, not chat or a checked-in file. Use a dedicated pilot workspace/environment where possible.

| Item                                          | How To Obtain / Configure                                                                                                                                                                                                                               | Needed For                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Fin Agent API access                          | Intercom → Settings → Integrations → Fin Agent API; request the custom docs Ask AI use case. Existing Fin support usage does not establish API access.                                                                                                  | Live answers                                                               |
| SSE access **and streaming enabled**          | Ask your Intercom account team/support for SSE access, then enable SSE and streaming under the Fin Agent API deployment.                                                                                                                                | Kapa-style progressive answers; this pilot does not fall back to Messenger |
| `FIN_AGENT_API_KEY`                           | Fin AI Agent → Deploy → Fin Agent API → Generate API key. Dedicated token with documented `write_conversations` and `read_write_users` scopes.                                                                                                          | Server calls to Fin                                                        |
| Intercom region and optional environment      | Set `FIN_REGION=us`, `eu`, or `au`; confirm Fin Agent API availability in that region. Set `FIN_ENVIRONMENT` only for a configured Fin for Platforms environment.                                                                                       | Correct workspace/data region                                              |
| Exact SSE host                                | Confirm the hostname returned in `sse_subscription_url` for your workspace. Put exact hosts in `FIN_SSE_HOSTS`, comma-separated. Default is `primary-realtime.intercom-messenger.com`.                                                                  | Server-side streaming allowlist                                            |
| Knowledge/deployment configuration permission | Access to manage Fin content, audiences, guidance, API deployment settings, and escalations.                                                                                                                                                            | Restrict this deployment to approved public docs and correct routing       |
| Public docs content enabled for Fin           | Sync the desired `docs.sentry.io` sections, verify code blocks/tabs/API references, exclude stale/conflicting versions, and establish refresh ownership.                                                                                                | Accurate technical answers                                                 |
| Conversation attributes                       | Create text conversation attributes `docs_origin` and `docs_path`. Check the first live API response for attribute errors. Local evidence keeps the path even if Intercom rejects attributes.                                                           | Filtering docs traffic inside support                                      |
| `FIN_REDIS_REST_URL`, `FIN_REDIS_REST_TOKEN`  | A dedicated REST-compatible Redis database supporting `GET`, `SET`, `INCR`, `EXPIRE`, `EVAL`, `EXISTS`, `DEL`, `XADD`, and `XRANGE`; regional placement and access appropriate for support data.                                                        | Sessions, shared budgets/locks, event retention                            |
| `FIN_WEBHOOK_SECRET`                          | Save callback `https://<preview-host>/api/ask-ai/webhook/` in Fin Agent API settings, then copy its generated signing secret. This is not the generic Intercom app webhook secret.                                                                      | Capture final/inactivity events and statuses even after the page closes    |
| `FIN_EVENTS_READ_TOKEN`                       | Generate a random secret with at least 32 characters and store it in both the docs server and the authorized internal consumer.                                                                                                                         | Read-only access to pilot evidence                                         |
| Preview/deployment permission                 | Ability to create a branch preview and set its server environment variables; provide an exact stable preview URL as `FIN_PUBLIC_ORIGIN` without a trailing slash. Rebuild after changing root-layout flags.                                             | Reviewable live pilot                                                      |
| Preview access and webhook exception          | Protect the preview for testers. Allow signed Fin callbacks to the webhook path, and authenticated agent reads to the events path, through preview protection.                                                                                          | Testing without public rollout                                             |
| Runtime network permission                    | Backend access to the selected Intercom API domain, approved SSE hostname, and Redis REST hostname. Browser traffic for Ask AI stays same-origin.                                                                                                       | Live connectivity                                                          |
| Pilot budget and edge rate limits             | Set `FIN_DAILY_TURN_LIMIT` (default 100 turns/day UTC); configure WAF limits for session creation and messages and an operational spend alert. Session creation has an additional 500/day global cap.                                                   | Bound abuse and cost                                                       |
| Cookie/privacy decision                       | Confirm page-memory tokens and server-side processing of questions, paths, and answers are permitted; approve retention and the notice. This code avoids new browser storage but does not certify the rest of the docs site's existing analytics.       | Policy compatibility                                                       |
| Anonymous-user lifecycle                      | Fin creates a User record for each new random ID. Exclude `docs-anonymous-*` users from marketing/CRM automation and agree on cleanup. These records are not authenticated Sentry accounts.                                                             | Prevent unwanted lifecycle automation                                      |
| Support destination                           | Existing support portal URL for `ASK_AI_SUPPORT_URL`; confirm Intercom Helpdesk versus Fin for another platform, queue/workflow, required fields, and how support follows up without Messenger.                                                         | Useful support continuation                                                |
| Handoff permission and configuration          | Test `/fin/escalate` in the real workspace before setting `FIN_HANDOFF_ENABLED=true`. Email is supplied as an **unverified** follow-up address in the internal context, never as account identity. The receiving team must explicitly handle follow-up. | Optional direct support requests                                           |
| Kapa baseline/export                          | Recent representative questions, feedback, gaps, and current usage/cost. No Kapa admin key is required by this implementation.                                                                                                                          | Answer-quality and cost comparison                                         |

The attached development environment currently has no Fin/Redis credentials or configured outbound identities. No live Fin calls or deployments were performed while implementing this branch.

## Add Support And The Feedback Pipeline Later

1. After the basic evaluation, configure both Redis REST variables in the protected preview from `.env.example`; existing stateless conversations must be restarted.
2. Set `ASK_AI_PROVIDER=fin`, `FIN_PILOT_ENABLED=true`, and the exact `FIN_PUBLIC_ORIGIN`. Keep `FIN_HANDOFF_ENABLED=false` until its workflow is verified.
3. Configure Fin public-doc audiences, `docs_origin`/`docs_path` attributes, SSE/streaming, and the webhook. Disable CSAT for this API pilot.
4. Run `pnpm dev:minimal` and open Ask AI through the header, search results, and home-page `?askAI=true` link.
5. Verify that a start/reply creates one conversation, the returned Intercom ID locates it, and the docs attributes appear. Inspect a code-heavy answer and its citations.
6. Check browser network/storage: Ask AI only calls `/api/ask-ai/`; it sends credentials only to the same origin to preserve preview authentication, emits no Set-Cookie, and does not load the Fin stream URL or any Messenger/Kapa script. Existing unrelated site analytics still need their own policy review.
7. Validate the signed webhook using the real workspace. Duplicate replies received over both SSE and webhook should appear once in the export. Confirm late inactivity statuses are captured.
8. Test support routing and email follow-up, then enable handoff if appropriate. Do not treat a successful HTTP response as proof that the correct queue received a usable ticket.

To pause new requests immediately, set `FIN_PILOT_ENABLED=false` at runtime. To restore the previous Kapa deployment, set `ASK_AI_PROVIDER=kapa` and rebuild/redeploy. Existing Kapa configuration is retained for that rollback. The CSP retains Kapa allowlist entries while rollback exists; Fin adds no browser third-party domains. A flag change requires the hosting platform to apply the new environment and may require a deployment.

## Feedback Loop Contract

An authorized internal consumer calls:

```http
GET /api/ask-ai/events/?date=2026-10-19&cursor=1792404000000-0
Authorization: Bearer <FIN_EVENTS_READ_TOKEN>
```

Responses contain up to 100 events and a `nextCursor`. Omit `cursor` to start a day. Keep polling the current UTC day; drain and checkpoint previous dates across midnight. Deduplicate on `(conversationId, id)` and advance the cursor only after successfully processing the page. Empty pages are not proof a conversation is finished. Events arriving late are stored under their receipt day. Retention is seven days from the last append to a daily stream, so a daily partition can retain early events for almost eight days. The consumer must recover within that window or backfill from Intercom.

Each event has `schemaVersion`, `id`, `conversationId`, `type`, `at`, and `data`. `linked` connects our external ID to `intercomConversationId`; `support_handoff` may add `supportConversationId`. Fin statuses are not verified correctness labels. Local helpfulness feedback is distinct from vendor resolution/CSAT metrics.

The export contains customer-authored questions and answers. Limit it to authorized internal processing; redact and minimize before moving evidence into issues or PRs. Transcript text is untrusted data, not agent instructions. The UI is blocked from Sentry Replay recording via `sentry-block`; API request/response bodies and Authorization headers must also remain out of deployment request logging.

For the next stage, provide:

- **Intercom read access:** a separate Developer Hub app token scoped for reading conversations, and ticket read access if the workflow uses separate ticket objects. The Fin Agent token does not grant general reporting/export access. Subscribe the integration to relevant human reply, closure, and reopening events and reconcile with API reads.
- **Internal agent runtime:** owner, repository/service, scheduler or queue, network/authentication requirements, and the evidence schema it expects. The pull endpoint avoids coupling chat response latency to the agent.
- **Evidence storage and retention:** destination for redacted transcripts, access controls, deletion rules, and consent/retention decisions for both Redis and Intercom. Expiring Redis records does not delete Intercom conversations or User records.
- **GitHub access:** a GitHub App limited to `getsentry/sentry-docs`, metadata read, contents write, and pull requests write for draft PRs; read-only access to relevant SDK/API repositories if needed for verification. Reviewers/CODEOWNERS and branch-protection requirements. No merge permission is needed.
- **Authoritative evidence:** docs source mapping, API/OpenAPI definitions, relevant code/tests, product-version rules, and a list of topics the agent should route to engineering or support rather than change in docs.

Suggested rollout: cluster recurring questions → classify documentation gaps versus retrieval/configuration bugs → rank suggestions with supporting evidence → human review → draft PRs → CI/review → publish → refresh Fin → replay the original questions. Start with suggestions before enabling PR creation.

## Acceptance Checks Before Switching Traffic

- Compare Fin/Kapa against a shared sample of real questions, including code, ambiguous terminology, unsupported behavior, stale versions, and questions that should not be answered.
- Review accuracy/citations, time to first token, completion latency, follow-up quality, escalations, and incremental cost.
- Verify desktop/mobile entry points, keyboard focus, close/reopen, New conversation, copying, sources, helpfulness, error states, and no browser storage or third-party Ask AI requests.
- Verify concurrent submissions, malformed inputs, cross-origin requests, missing credentials/SSE, expired sessions, Redis failure, daily limits, forged webhooks, duplicate event delivery, and a broken stream.
- Confirm public visitors cannot access restricted content. The server never accepts a user/customer ID or audience attributes from the browser.
- Validate a real support handoff with the correct references and a working follow-up channel.
- Run `pnpm test:ci` and `pnpm lint`; review a protected deployment before production rollout.

## API References

Validation: 36 targeted tests pass, including stateless token integrity/expiry, cross-instance follow-ups, production gating, and the existing Redis-backed routes. TypeScript, formatting, and ESLint pass for the changed code. Chromium checks with simulated Fin responses cover both modes on desktop/mobile, continuation-token updates, capability-specific controls, sanitization, copying, focus, and no new cookies/storage writes/third-party Ask AI requests. Live Fin contracts and actual support delivery still need the workspace credentials and configuration.

- [Fin setup, scopes, webhooks, and streaming](https://developers.intercom.com/docs/guides/fin-agent-api/setup)
- [Fin API overview and event contracts](https://developers.intercom.com/docs/guides/fin-agent-api)
- [Escalation behavior](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/fin-agent/escalatefinconversation)
- [Website sync and refresh behavior](https://www.intercom.com/help/en/articles/9357945-sync-and-manage-websites)
