<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

## Setting up an Environment

We use Next.js, `yarn` and `volta` to manage the environment.

```
cp .env.example .env.development
yarn

# Start dev server for user docs
yarn dev

# Start dev server for developer docs
yarn dev:developer-docs
```

With that, the repo is fully set up and you are ready to open local docs under http://localhost:3000
