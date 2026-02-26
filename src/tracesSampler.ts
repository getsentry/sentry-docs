import * as Sentry from '@sentry/nextjs';

import {
  AI_AGENT_PATTERN,
  BOT_PATTERN,
  matchPattern,
  SAMPLE_RATES,
  type TrafficType,
} from './lib/trafficClassification';

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

/**
 * Gets a header value from headers object, handling case-insensitivity.
 * HTTP headers are case-insensitive, but JS objects are case-sensitive.
 */
function getHeaderValue(
  headers: Record<string, string> | undefined,
  headerName: string
): string | undefined {
  if (!headers) {
    return undefined;
  }
  const lowerName = headerName.toLowerCase();
  const key = Object.keys(headers).find(k => k.toLowerCase() === lowerName);
  return key ? headers[key] : undefined;
}

/**
 * Valid traffic types for validation of header values.
 */
const VALID_TRAFFIC_TYPES = new Set<TrafficType>(['ai_agent', 'bot', 'user', 'unknown']);

/**
 * Gets middleware traffic classification from headers.
 * Validates that traffic type is one of the expected values.
 */
function getMiddlewareClassification(headers?: Record<string, string>): {
  deviceType: string | undefined;
  trafficType: TrafficType | undefined;
} {
  const rawTrafficType = getHeaderValue(headers, 'x-traffic-type');
  return {
    deviceType: getHeaderValue(headers, 'x-device-type'),
    trafficType: VALID_TRAFFIC_TYPES.has(rawTrafficType as TrafficType)
      ? (rawTrafficType as TrafficType)
      : undefined,
  };
}

/**
 * Determines trace sample rate based on traffic classification.
 * Uses middleware classification headers when available, falls back to user-agent pattern matching.
 *
 * Sample rates (from shared config):
 * - AI agents: 100% (full visibility into agentic docs consumption)
 * - Bots/crawlers: 0% (filter out noise)
 * - Real users: 30%
 * - Unknown: 30% (tracked separately for visibility)
 *
 * AI agents are checked first; if something matches both AI and bot patterns, we sample it.
 */
export function tracesSampler(samplingContext: SamplingContext): number {
  const spanName = samplingContext.name || '';

  // Middleware spans don't receive normalizedRequest in Sentry's Edge runtime instrumentation,
  // so they can't be classified. Skip sampling them entirely - the corresponding page span
  // (e.g., "GET /path") will capture the same request with full classification data.
  if (spanName.startsWith('middleware ')) {
    return 0;
  }

  const headers = samplingContext.normalizedRequest?.headers;

  // Check for middleware classification headers first (most reliable)
  const middlewareClassification = getMiddlewareClassification(headers);

  // If middleware provided valid classification, use it
  if (middlewareClassification.trafficType) {
    const {trafficType, deviceType} = middlewareClassification;
    const sampleRate = SAMPLE_RATES[trafficType];

    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        sample_rate: sampleRate,
        traffic_type: trafficType,
        device_type: deviceType || 'unknown',
      },
    });

    return sampleRate;
  }

  // Fallback to user-agent pattern matching if no middleware classification
  // This handles cases where middleware didn't run (API routes, etc.)
  const userAgent =
    getHeaderValue(headers, 'user-agent') ??
    (samplingContext.attributes?.['http.user_agent'] as string | undefined) ??
    (samplingContext.attributes?.['user_agent.original'] as string | undefined);

  // No user-agent = unknown traffic, track it explicitly
  if (!userAgent) {
    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        sample_rate: SAMPLE_RATES.unknown,
        traffic_type: 'unknown',
        device_type: 'unknown',
      },
    });
    return SAMPLE_RATES.unknown;
  }

  // Check for AI agents first
  const aiAgent = matchPattern(userAgent, AI_AGENT_PATTERN);
  if (aiAgent) {
    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        sample_rate: SAMPLE_RATES.ai_agent,
        traffic_type: 'ai_agent',
        agent_match: aiAgent,
      },
    });
    return SAMPLE_RATES.ai_agent;
  }

  // Check for bots/crawlers
  const bot = matchPattern(userAgent, BOT_PATTERN);
  if (bot) {
    Sentry.metrics.count('docs.trace.sampled', 1, {
      attributes: {
        sample_rate: SAMPLE_RATES.bot,
        traffic_type: 'bot',
        bot_match: bot,
      },
    });
    return SAMPLE_RATES.bot;
  }

  // Sample real users at default rate
  Sentry.metrics.count('docs.trace.sampled', 1, {
    attributes: {
      sample_rate: SAMPLE_RATES.user,
      traffic_type: 'user',
    },
  });
  return SAMPLE_RATES.user;
}
