import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
      spotlight: process.env.NODE_ENV === 'development',
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: 'https://ad63ba38287245f2803dc220be959636@o1.ingest.sentry.io/1267915',
      tracesSampleRate: 1,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
    });
  }
}
