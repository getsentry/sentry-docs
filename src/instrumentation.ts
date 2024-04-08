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
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 1,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
    });
  }
}
