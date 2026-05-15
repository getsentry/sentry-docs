<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

## Setting up an Environment

We use Next.js, `pnpm` and `volta` to manage the environment.

```
make

# Start dev server for user docs
pnpm dev

# Start dev server for developer docs
pnpm dev:developer-docs
```

With that, the repo is fully set up and you are ready to open local docs under http://localhost:3000

`next-env.d.ts` is in `.gitignore` and is generated when you run `pnpm dev` or `pnpm build`. When we upgrade to Next 15.5+, we can run `next typegen` in CI and in `lint:ts` so the file is generated before type-check.

## Screenshots

Docs pages that contain screenshots of the Sentry UI use a `sentry_ui_url` field in their frontmatter. This tells the automated screenshot pipeline which Sentry page to capture when checking for stale images.

```yaml
---
title: Issue Details
sidebar_order: 10
description: Learn how to navigate the Issue Details page.
sentry_ui_url: https://sentry.io/organizations/{org}/issues/
---
```

Use `{org}` as a placeholder for the organization slug. The pipeline replaces it at capture time.

**This field is added automatically.** When you open a PR that adds or modifies images in a docs page, a GitHub Actions workflow will detect the missing field and commit it to your branch. You can also add it manually if you know the URL.

If the auto-detected URL is wrong (e.g., your screenshots show a specific sub-page), update it in the frontmatter and the bot won't overwrite it on future PRs.

See [`scripts/screenshot-pipeline/README.md`](scripts/screenshot-pipeline/README.md) for full pipeline documentation.
