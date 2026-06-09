import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ignore errors injected by Brave/Firefox iOS browser scripts (third-party browser noise)
  ignoreErrors: [/__firefox__/, /DarkReader/],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.3,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.spanStreamingIntegration(),
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['sentry-docs'],
      behaviour: 'drop-error-if-exclusively-contains-third-party-frames',
    }),
    Sentry.browserTracingIntegration({
      linkPreviousTrace: 'session-storage',
    }),
    Sentry.consoleLoggingIntegration(),
  ],

  // Drop frameless errors caught by the global unhandled error handler.
  // These are typically from browser extensions or third-party scripts injected
  // into the page — they have no stack frames and no app context.
  beforeSend(event) {
    const framelessUnhandled =
      event.exception?.values?.length &&
      event.exception.values.every(ex => {
        const frames = ex.stacktrace?.frames;
        const noFrames = !frames || frames.length === 0;
        const mechanism = ex.mechanism;
        const isGlobalHandler =
          mechanism?.type === 'onerror' || mechanism?.type === 'onunhandledrejection';
        return noFrames && isGlobalHandler;
      });
    if (framelessUnhandled) {
      return null;
    }
    return event;
  },

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

if (process.env.NODE_ENV === 'development') {
  Spotlight.init({
    showClearEventsButton: true,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
