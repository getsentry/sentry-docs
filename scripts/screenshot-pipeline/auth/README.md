# Auth Setup

This directory holds the Playwright session state for authenticating against Sentry.

## First-time setup

Run:

```bash
npm run auth:setup
```

This opens a Chromium browser. Log in to Sentry as you normally would, then **close the browser window**. Your session is saved to `auth/storageState.json`.

## Refreshing

When captures start failing with `capture_failed` (auth redirect), your session has expired. Just re-run:

```bash
npm run auth:setup
```

## CI usage

For GitHub Actions, base64-encode the storage state and store it as a secret:

```bash
base64 -i auth/storageState.json | pbcopy  # copies to clipboard on macOS
```

Then add it as the `SENTRY_STORAGE_STATE` repository secret.
