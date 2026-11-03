<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <picture>
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-logo-white.png" media="(prefers-color-scheme: dark)" />
      <source srcset="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" media="(prefers-color-scheme: light), (prefers-color-scheme: no-preference)" />
      <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280">
    </picture>
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
