import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ignore errors injected by Brave/Firefox iOS browser scripts (third-party browser noise)
  // and non-Error DOM Event rejections from failed third-party resource loads (DOCS-9E9).
  ignoreErrors: [
    /__firefox__/,
    /DarkReader/,
    /Event `Event` \(type=error\) captured as promise rejection/,
  ],

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

  // Drop frameless global-handler noise (browser extensions, failed third-party
  // <script>/<link> loads). thirdPartyErrorFilterIntegration only covers errors
  // that have frames; zero-frame Event rejections bypass it and become DOCS-9E9.
  beforeSend(event) {
    const values = event.exception?.values;
    if (!values?.length) {
      return event;
    }

    const framelessGlobalHandlerNoise = values.every(exception => {
      const frames = exception.stacktrace?.frames;
      const noFrames = !frames || frames.length === 0;
      if (!noFrames) {
        return false;
      }

      const mechanismType = exception.mechanism?.type ?? '';
      const isGlobalHandler =
        mechanismType === 'onerror' ||
        mechanismType === 'onunhandledrejection' ||
        mechanismType.includes('global_handlers');

      const isDomErrorEvent =
        exception.type === 'Event' ||
        /type=error/.test(exception.value ?? '') ||
        /captured as promise rejection/i.test(exception.value ?? '');

      return isGlobalHandler || isDomErrorEvent;
    });

    if (framelessGlobalHandlerNoise) {
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
