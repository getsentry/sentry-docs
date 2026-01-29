import * as Sentry from '@sentry/nextjs';
import * as Spotlight from '@spotlightjs/spotlight';

// AI agents we want to track for docs/markdown consumption visibility
// These fetch markdown content and we need performance data on serving to agentic tools
const AI_AGENT_PATTERN =
  /claudebot|claude-web|anthropic|gptbot|chatgpt|openai|cursor|codex|copilot|perplexity|cohere|gemini/i;

// Bots/crawlers to filter out (SEO crawlers, social media, testing tools, monitors)
// Note: 'bot' is broad but AI agents are allowlisted above
const BOT_PATTERN =
  /bot|crawler|spider|scraper|headless|facebookexternalhit|whatsapp|phantomjs|selenium|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot/i;

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Use tracesSampler to filter out bot/crawler traffic while keeping AI agents
  tracesSampler: _samplingContext => {
    // Check if running in browser environment
    if (typeof navigator === 'undefined' || !navigator.userAgent) {
      return 1; // Default to sampling if userAgent not available
    }

    const userAgent = navigator.userAgent;

    // Always sample AI agents - we want visibility into how agentic tools consume our docs
    const isAIAgent = AI_AGENT_PATTERN.test(userAgent);
    if (isAIAgent) {
      return 1;
    }

    // Filter out traditional bots/crawlers
    const isBot = BOT_PATTERN.test(userAgent);

    // Drop traces for bots (return 0), keep for real users (return 1)
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
