import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

// AI agents we want to track for docs/markdown consumption visibility
// These fetch markdown content and we need performance data on serving to agentic tools
const AI_AGENT_PATTERN = new RegExp(
  [
    'claudebot',
    'claude-web',
    'anthropic',
    'gptbot',
    'chatgpt',
    'openai',
    'cursor',
    'codex',
    'copilot',
    'perplexity',
    'cohere',
    'gemini',
  ].join('|'),
  'i'
);

// Bots/crawlers to filter out (SEO crawlers, social media, testing tools, monitors)
// Using explicit bot names to avoid false positives (e.g., "bot" would match Cubot phones)
const BOT_PATTERN = new RegExp(
  [
    // Search engine crawlers
    'googlebot',
    'bingbot',
    'yandexbot',
    'baiduspider',
    'duckduckbot',
    'applebot',
    // SEO tools
    'ahrefsbot',
    'semrushbot',
    'dotbot',
    'mj12bot',
    // Social media
    'slackbot',
    'twitterbot',
    'linkedinbot',
    'telegrambot',
    'discordbot',
    'facebookexternalhit',
    'whatsapp',
    // Generic patterns
    'crawler',
    'spider',
    'scraper',
    'headless',
    // Testing/automation tools
    'phantomjs',
    'selenium',
    'puppeteer',
    'playwright',
    // Performance/monitoring tools
    'lighthouse',
    'pagespeed',
    'gtmetrix',
    'pingdom',
    'uptimerobot',
  ].join('|'),
  'i'
);

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Use tracesSampler to filter out bot/crawler traffic while keeping AI agents
  tracesSampler: _samplingContext => {
    // Check if running in browser environment
    if (typeof navigator === 'undefined' || !navigator.userAgent) {
      return 0.3; // Default to sampling if userAgent not available
    }

    const userAgent = navigator.userAgent;

    // Always sample AI agents - we want full visibility into agentic docs consumption
    const isAIAgent = AI_AGENT_PATTERN.test(userAgent);
    if (isAIAgent) {
      return 1;
    }

    // Filter out traditional bots/crawlers
    const isBot = BOT_PATTERN.test(userAgent);

    // Drop traces for bots, sample 30% of real users
    return isBot ? 0 : 0.3;
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
