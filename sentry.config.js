import * as Sentry from "@sentry/gatsby";

const activeEnv =
  process.env.GATSBY_ENV || process.env.NODE_ENV || "development";

Sentry.init({
  debug: true,
  dsn: process.env.SENTRY_DSN,
  release: process.env.SENTRY_RELEASE,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: activeEnv === "development" ? 0 : 1,
  replaysSessionSampleRate: activeEnv === "development" ? 0 : 0.1,
  replaysOnErrorSampleRate: activeEnv === "development" ? 0 : 1,
});
