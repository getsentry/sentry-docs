/* eslint-env node */
/* eslint import/no-nodejs-modules:0 */

import * as Sentry from '@sentry/gatsby';

const activeEnv = process.env.GATSBY_ENV || process.env.NODE_ENV || 'development';

Sentry.init({
  dsn: process.env.GATSBY_SENTRY_DSN,
  release: process.env.GATSBY_SENTRY_RELEASE,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
      unmask: ['.hover-card-link'],
    }),
  ],
  tracesSampleRate: activeEnv === 'development' ? 0 : 1,
  replaysSessionSampleRate: activeEnv === 'development' ? 0 : 0.1,
  replaysOnErrorSampleRate: activeEnv === 'development' ? 0 : 1,
});
