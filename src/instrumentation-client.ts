import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Ignore errors injected by Brave/Firefox iOS browser scripts (third-party browser noise)
  ignoreErrors: [/__firefox__/, /DarkReader/],

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.3,

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

  // When a Chrome promise rejection is fired by a resource load failure, the
  // rejection reason is the DOM Event whose target is the HTML element that
  // failed (e.g. a <link> stylesheet). Without extra instrumentation, the
  // serialised event shows only "[object HTMLLinkElement]" and gives no clue
  // which URL caused the failure. This hook extracts the resource URL and
  // adds it as a searchable tag and as extra context so we can identify the
  // failing asset.
  beforeSend: (event, hint) => {
    const originalException = hint?.originalException;
    if (
      originalException instanceof Event &&
      originalException.target instanceof HTMLElement
    ) {
      const target = originalException.target as HTMLElement & {
        href?: string;
        src?: string;
      };
      const resourceUrl = target.href ?? target.src ?? target.tagName;
      event.tags = {
        ...event.tags,
        failing_resource_url: resourceUrl,
        failing_resource_tag: target.tagName.toLowerCase(),
      };
      event.extra = {
        ...event.extra,
        failing_resource_element: target.outerHTML?.slice(0, 300),
      };
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
