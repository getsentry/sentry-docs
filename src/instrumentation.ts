import * as Sentry from '@sentry/nextjs';

import {tracesSampler} from './tracesSampler';

/**
 * Filter for suppressing expected runtime MDX compilation errors.
 * These occur when serverless functions attempt to compile MDX at runtime
 * because source files are excluded from the bundle to stay under Vercel's 250MB limit.
 * This is an infrastructure edge case that's already handled gracefully by returning 404.
 * See: app/[[...path]]/page.tsx for graceful error handling.
 */
function isExpectedMdxRuntimeError(event: Sentry.ErrorEvent): boolean {
  const exception = event.exception?.values?.[0];
  if (!exception) return false;

  const errorMessage = exception.value || '';
  const errorCode = (exception.mechanism?.data as Record<string, unknown>)?.code ||
    (exception as Record<string, unknown>).code;

  // Filter errors related to missing MDX files at runtime
  const isMdxRuntimeError =
    errorCode === 'MDX_RUNTIME_ERROR' ||
    (errorCode === 'ENOENT' && errorMessage.includes('Failed to find a valid source file'));

  // Filter errors from attempting to compile MDX when files aren't in bundle
  const isMdxCompilationError = errorMessage.includes(
    'Failed to find a valid source file for slug'
  );

  return isMdxRuntimeError || isMdxCompilationError;
}

function beforeSendEvent(event: Sentry.ErrorEvent) {
  if (isExpectedMdxRuntimeError(event)) {
    // Suppress this error from being reported to Sentry.
    // The error is handled gracefully in page.tsx with notFound() response.
    return null;
  }
  return event;
}

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampler,
      enableLogs: true,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
      spotlight: process.env.NODE_ENV === 'development',
      integrations: [Sentry.consoleLoggingIntegration()],
      beforeSendEvent,

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
      tracesSampler,
      enableLogs: true,
      debug: false,
      environment: process.env.NODE_ENV === 'development' ? 'development' : undefined,
      integrations: [Sentry.consoleLoggingIntegration()],
      beforeSendEvent,

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
