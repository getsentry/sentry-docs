# Preview share links

Auto-generates a **shareable link** for protection-gated Vercel preview
deployments and posts it as a sticky comment on the PR, so external
contractors can view previews without a Vercel login — while the bare preview
URLs stay locked down against bots and crawlers.

## How it works

1. **`.github/workflows/preview-share-link.yml`** runs on `deployment_status`.
   When Vercel reports a successful **preview** deployment (production is
   skipped), it:
   - resolves the PR from the deployed commit SHA,
   - builds an HMAC-signed, 30-day-expiring token for the preview origin,
   - upserts one sticky PR comment linking to this endpoint.
2. **`app/api/preview-share/route.ts`** (this endpoint, served publicly from
   `docs.sentry.io`) verifies the signature + expiry + host allowlist, then
   `302`-redirects to the preview origin with Vercel's bypass params
   (`x-vercel-protection-bypass` + `x-vercel-set-bypass-cookie=true`). Vercel
   sets a bypass cookie and the contractor can browse the whole preview.

The Vercel bypass secret lives **only** in this endpoint's server-side env
vars. It is never written into the (public) PR comment. Links are signed, so a
bot that merely discovers a preview URL cannot forge a working share link.

## One-time setup

### 1. Create the Vercel bypass secrets (both docs projects)

For **user-docs** and **develop-docs**:
Vercel → Project → Settings → Deployment Protection → _Protection Bypass for
Automation_ → **Create** (label e.g. "preview share links"). Copy each value.

Keep **Standard Protection** enabled (previews protected, production public).

### 2. Env vars — only on the `sentry-docs` (user-docs) project

The endpoint runs only where the share link points (`docs.sentry.io`), which is
the `sentry-docs` project. Set these there, for the **Production** environment.
One endpoint holds both projects' bypass secrets:

| Name                         | Value                                                  |
| ---------------------------- | ------------------------------------------------------ |
| `SHARE_LINK_SIGNING_KEY`     | a fresh random 32-byte secret (`openssl rand -hex 32`) |
| `BYPASS_SECRET_USER_DOCS`    | bypass secret from the `sentry-docs` project           |
| `BYPASS_SECRET_DEVELOP_DOCS` | bypass secret from the `develop-docs` project          |

The **`develop-docs`** project needs **no** endpoint env vars — you only create
its Protection Bypass secret (step 1) to copy the value above. The route code
also ships in the develop-docs deployment, but with no env vars it fails closed
there (harmless, unused).

### 3. GitHub repo config (getsentry/sentry-docs)

| Kind                 | Name                     | Value                    |
| -------------------- | ------------------------ | ------------------------ |
| Actions **secret**   | `SHARE_LINK_SIGNING_KEY` | same value as above      |
| Actions **variable** | `SHARE_BASE_URL`         | `https://docs.sentry.io` |

### 4. Ship it

Merge to `master` so the endpoint goes live on production. From then on every
new PR gets an automatic share-link comment. (The PR that introduces this
feature won't have a working link until it merges — one-time only.)

## Rotating the secret

Regenerate the bypass secret in Vercel, update `BYPASS_SECRET_*`, and redeploy.
To rotate signing, replace `SHARE_LINK_SIGNING_KEY` in both the Vercel project
and the GitHub Actions secret (existing links stop working immediately).

## Notes

- Allowed preview hosts: `sentry-docs*` / `develop-docs*` on `.sentry.dev` or
  `.vercel.app`. Anything else is rejected by the endpoint.
- The endpoint only ever redirects to a **preview** host. Each link's signature
  is bound to a specific host, and the workflow only signs non-production
  deployments, so no valid link to a production build URL can be minted. As an
  extra guard, the endpoint also hard-rejects the production `git-master` build
  alias.
- The endpoint is a redirector only — no preview content is served from
  `docs.sentry.io`. Hitting it without a valid signed link returns a harmless
  `400`.
- The endpoint is `noindex`/`no-store` on every response and is also
  `Disallow`ed in `robots.txt`. It is not linked from any page, nav, or the
  sitemap — it only appears in the PR comment.
- Tests: `pnpm test app/api/preview-share`.
