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
 * Gets the traffic classification the middleware stamped onto the forwarded
 * request via the `x-traffic-type` header (see middleware.ts).
 */
function getForwardedTrafficType(
  headers?: Record<string, string>
): TrafficType | undefined {
  const rawTrafficType = getHeaderValue(headers, 'x-traffic-type');
  return VALID_TRAFFIC_TYPES.has(rawTrafficType as TrafficType)
    ? (rawTrafficType as TrafficType)
    : undefined;
}

/**
 * Middleware root spans are created by Next.js itself ('Middleware.execute')
 * before any request data reaches Sentry, so they can never be classified
 * here — and they carry no useful detail (the name is collapsed to
 * `middleware GET`). Per-request traffic classification is recorded as the
 * `docs.request.classified` metric in middleware.ts instead.
 */
function isMiddlewareRootSpan(samplingContext: SamplingContext): boolean {
  return (
    samplingContext.attributes?.['next.span_type'] === 'Middleware.execute' ||
    samplingContext.attributes?.['sentry.op'] === 'http.server.middleware' ||
    samplingContext.name === 'middleware' ||
    Boolean(samplingContext.name?.startsWith('middleware '))
  );
}

/**
 * Determines trace sample rate based on traffic classification.
 *
 * Sample rates (from shared config):
 * - Middleware root spans: 0% (unclassifiable by architecture and information-free;
 *   traffic counting happens in middleware.ts via the docs.request.classified metric)
 * - AI agents: 100% (full visibility into agentic docs consumption)
 * - Bots/crawlers: 0% (filter out noise)
 * - Real users: 30%
 * - Unknown: 30% (tracked separately for visibility)
 *
 * Classification prefers the `x-traffic-type` header stamped by the middleware
 * onto forwarded requests, falling back to user-agent pattern matching for
 * requests that didn't pass through the middleware. AI agents are checked
 * before bots; if something matches both patterns, we sample it.
 */
export function tracesSampler(samplingContext: SamplingContext): number {
  if (isMiddlewareRootSpan(samplingContext)) {
    return 0;
  }

  const headers = samplingContext.normalizedRequest?.headers;

  // Trust the classification the middleware stamped onto the forwarded request
  const forwardedType = getForwardedTrafficType(headers);
  if (forwardedType) {
    return SAMPLE_RATES[forwardedType];
  }

  // Fallback to user-agent pattern matching if no middleware classification
  // (e.g. requests that bypass the middleware matcher)
  const userAgent =
    getHeaderValue(headers, 'user-agent') ??
    (samplingContext.attributes?.['http.user_agent'] as string | undefined) ??
    (samplingContext.attributes?.['user_agent.original'] as string | undefined);

  if (!userAgent) {
    return SAMPLE_RATES.unknown;
  }

  if (matchPattern(userAgent, AI_AGENT_PATTERN)) {
    return SAMPLE_RATES.ai_agent;
  }

  if (matchPattern(userAgent, BOT_PATTERN)) {
    return SAMPLE_RATES.bot;
  }

  return SAMPLE_RATES.user;
}
