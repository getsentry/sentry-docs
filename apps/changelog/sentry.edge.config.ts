import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  environment: process.env.NODE_ENV,
  spotlight: process.env.NODE_ENV === 'development',
});
