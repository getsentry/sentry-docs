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

  // Replay is added after page load (see loadReplay below), not here, so it
  // stays out of the first-load bundle.
  integrations: [
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

/**
 * Session Replay is the largest part of the SDK and was the most expensive
 * script on first load. Fetch it from the Sentry CDN once the page has loaded
 * instead. The replay sample rates above still apply when it's added. Replays
 * miss the first moments of a visit, and the CDN request can be blocked (for
 * example by ad blockers), in which case the session runs without Replay.
 */
function loadReplay() {
  Sentry.lazyLoadIntegration('replayIntegration')
    .then(replayIntegration =>
      Sentry.addIntegration(
        replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        })
      )
    )
    .catch(() => {});
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    loadReplay();
  } else {
    window.addEventListener('load', loadReplay, {once: true});
  }
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
