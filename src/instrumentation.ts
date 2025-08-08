import * as Sentry from '@sentry/nextjs';

export function register() {
  // if (process.env.NEXT_RUNTIME === 'nodejs') {
  //   Sentry.init({
  //     dsn: process.env.SENTRY_DSN,
  //     tracesSampleRate: 1,
  //     enableLogs: true,
  //     debug: false,
  //     environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
  //     spotlight: process.env.NODE_ENV === 'development',
  //     integrations: [Sentry.consoleLoggingIntegration()],
  //   });
  // }
  // if (process.env.NEXT_RUNTIME === 'edge') {
  //   Sentry.init({
  //     dsn: process.env.SENTRY_DSN,
  //     tracesSampleRate: 1,
  //     enableLogs: true,
  //     debug: false,
  //     environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
  //     integrations: [Sentry.consoleLoggingIntegration()],
  //     // temporary change for investigating edge middleware tx names
  //     beforeSendTransaction(event) {
  //       if (
  //         event.transaction?.includes('middleware GET') &&
  //         event.contexts?.trace?.data
  //       ) {
  //         event.contexts.trace.data = {
  //           ...event.contexts.trace.data,
  //           'sentry.source': 'custom',
  //         };
  //       }
  //       return event;
  //     },
  //   });
  // }
}

export const onRequestError = Sentry.captureRequestError;
