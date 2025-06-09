import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration(),
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['sentry-changelog'],
      behaviour: 'apply-tag-if-contains-third-party-frames',
    }),
  ],
});

if (process.env.NODE_ENV === 'development') {
  Spotlight.init();
}
