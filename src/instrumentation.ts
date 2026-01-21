import * as Sentry from '@sentry/nextjs';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      enableLogs: true,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
      spotlight: process.env.NODE_ENV === 'development',
      integrations: [Sentry.consoleLoggingIntegration()],

      // Filter sensitive metric attributes (no PII in metrics)
      beforeSendMetric: metric => {
        // Remove any accidentally added PII attributes
        if (metric.attributes) {
          // Remove user queries if accidentally added
          delete metric.attributes.user_query;
          // Remove full URLs
          delete metric.attributes.full_url;
          delete metric.attributes.full_path;
        }
        return metric;
      },
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1,
      enableLogs: true,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
      integrations: [Sentry.consoleLoggingIntegration()],

      // Filter sensitive metric attributes (no PII in metrics)
      beforeSendMetric: metric => {
        // Remove any accidentally added PII attributes
        if (metric.attributes) {
          // Remove user queries if accidentally added
          delete metric.attributes.user_query;
          // Remove full URLs
          delete metric.attributes.full_url;
          delete metric.attributes.full_path;
        }
        return metric;
      },

      // temporary change for investigating edge middleware tx names
      beforeSendTransaction(event) {
        if (
          event.transaction?.includes('middleware GET') &&
          event.contexts?.trace?.data
        ) {
          event.contexts.trace.data = {
            ...event.contexts.trace.data,
            'sentry.source': 'custom',
          };
        }
        return event;
      },
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
