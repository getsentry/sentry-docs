/**
 * Shared traffic classification types and patterns.
 * Used by middleware (for classification) and tracesSampler (for metrics).
 */

/**
 * Traffic type classification for metrics and sampling decisions.
 */
export type TrafficType = 'ai_agent' | 'bot' | 'user' | 'unknown';

/**
 * AI agents we want to track for docs/markdown consumption visibility.
 * These fetch markdown content and we need performance data on serving to agentic tools.
 * Also used by middleware to decide whether to serve markdown content.
 */
export const AI_AGENT_PATTERN = /claude|anthropic|gptbot|chatgpt|openai|cursor|codex|copilot|perplexity|cohere|gemini/i;

/**
 * Bots/crawlers to filter out (SEO crawlers, social media, testing tools, monitors).
 * Used as fallback when Next.js isBot detection isn't available.
 */
export const BOT_PATTERN = /googlebot|bingbot|yandexbot|baiduspider|duckduckbot|applebot|ahrefsbot|semrushbot|dotbot|mj12bot|slackbot|twitterbot|linkedinbot|telegrambot|discordbot|facebookexternalhit|whatsapp|crawler|spider|scraper|headless|phantomjs|selenium|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot/i;

/**
 * Sample rates by traffic type.
 */
export const SAMPLE_RATES: Record<TrafficType, number> = {
  ai_agent: 1, // 100% - full visibility into agentic docs consumption
  bot: 0, // 0% - filter out noise
  user: 0.3, // 30% - reasonable sample of real users
  unknown: 0.3, // 30% - same as users, but tracked separately
};

/**
 * Checks if the input matches the pattern.
 * Returns the matched substring (lowercase), or undefined if no match.
 */
export function matchPattern(input: string, pattern: RegExp): string | undefined {
  const match = input.match(pattern);
  return match ? match[0].toLowerCase() : undefined;
}
