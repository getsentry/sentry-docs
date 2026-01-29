import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Use tracesSampler to filter out bot/crawler traffic
  tracesSampler: _samplingContext => {
    // Check if running in browser environment
    if (typeof navigator === 'undefined' || !navigator.userAgent) {
      return 1; // Default to sampling if userAgent not available
    }

    const userAgent = navigator.userAgent.toLowerCase();

    // Patterns to identify bots, crawlers, and headless browsers
    const botPatterns = [
      'headlesschrome',
      'headless',
      'bot',
      'crawler',
      'spider',
      'scraper',
      'googlebot',
      'bingbot',
      'yandexbot',
      'slackbot',
      'facebookexternalhit',
      'twitterbot',
      'linkedinbot',
      'whatsapp',
      'telegrambot',
      'phantomjs',
      'selenium',
      'puppeteer',
      'playwright',
    ];

    // Check if userAgent matches any bot pattern
    const isBot = botPatterns.some(pattern => userAgent.includes(pattern));

    // Drop spans for bots (return 0), keep for real users (return 1)
    return isBot ? 0 : 1;
  },

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
    Sentry.thirdPartyErrorFilterIntegration({
      filterKeys: ['sentry-docs'],
      behaviour: 'apply-tag-if-contains-third-party-frames',
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

if (process.env.NODE_ENV === 'development') {
  Spotlight.init({
    showClearEventsButton: true,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
