import * as Sentry from '@sentry/nextjs';

// Sampling context passed to tracesSampler
// Using inline type to avoid dependency on internal Sentry types
interface SamplingContext {
  attributes?: Record<string, unknown>;
  name?: string;
  normalizedRequest?: {
    headers?: Record<string, string>;
  };
  parentSampled?: boolean;
}

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
// Uses specific bot names where possible, plus generic patterns for common crawler terms
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

// Default sample rate for real users
const DEFAULT_SAMPLE_RATE = 0.3;

/**
 * Determines trace sample rate based on user agent.
 * - AI agents: 100% (we want full visibility into agentic docs consumption)
 * - Bots/crawlers: 0% (filter out noise)
 * - Real users: 30%
 *
 * AI agents are checked first, so if something matches both AI and bot patterns, we sample it.
 */
export function tracesSampler(samplingContext: SamplingContext): number {
  // Try to get user agent from normalizedRequest headers (Sentry SDK provides this)
  // Falls back to OTel semantic convention attributes if normalizedRequest not available
  const userAgent =
    samplingContext.normalizedRequest?.headers?.['user-agent'] ??
    (samplingContext.attributes?.['http.user_agent'] as string | undefined) ??
    (samplingContext.attributes?.['user_agent.original'] as string | undefined);

  if (!userAgent) {
    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        traffic_type: 'unknown',
        sample_rate: DEFAULT_SAMPLE_RATE,
      },
    });
    return DEFAULT_SAMPLE_RATE;
  }

  const aiMatch = userAgent.match(AI_AGENT_PATTERN);
  if (aiMatch) {
    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        traffic_type: 'ai_agent',
        agent_match: aiMatch[0].toLowerCase(),
        sample_rate: 1,
      },
    });
    return 1;
  }

  const botMatch = userAgent.match(BOT_PATTERN);
  if (botMatch) {
    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        traffic_type: 'bot',
        bot_match: botMatch[0].toLowerCase(),
        sample_rate: 0,
      },
    });
    return 0;
  }

  // Sample real users at default rate
  Sentry.metrics.count('docs.trace.sampled', 1, {
    attributes: {
      traffic_type: 'user',
      sample_rate: DEFAULT_SAMPLE_RATE,
    },
  });
  return DEFAULT_SAMPLE_RATE;
}
