import {
  AI_AGENT_PATTERN,
  BOT_PATTERN,
  matchPattern,
  MIDDLEWARE_SAMPLE_RATE,
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
 * Ops the SDK has used for the Next.js middleware root span. `http.server.middleware`
 * is the v10 op; v11 renames it to the `@sentry/conventions` `middleware`. Both are
 * matched so the detection survives the upgrade.
 */
const MIDDLEWARE_SPAN_OPS = new Set(['http.server.middleware', 'middleware']);

/**
 * Middleware root spans are created by Next.js itself ('Middleware.execute')
 * before any request data reaches Sentry, so they can never be classified here —
 * no headers, no user-agent. They get a low blind rate instead; middleware.ts
 * stamps `traffic_type` on them so bots stay filterable at query time.
 *
 * `next.span_type` is the load-bearing check — it's set by Next.js at span
 * creation, so it's the one attribute reliably present this early. The op and
 * name checks are fallbacks for runtimes that get there another way.
 */
function isMiddlewareRootSpan(samplingContext: SamplingContext): boolean {
  return (
    samplingContext.attributes?.['next.span_type'] === 'Middleware.execute' ||
    MIDDLEWARE_SPAN_OPS.has(samplingContext.attributes?.['sentry.op'] as string) ||
    samplingContext.name === 'middleware' ||
    Boolean(samplingContext.name?.startsWith('middleware '))
  );
}

/**
 * Determines trace sample rate based on traffic classification.
 *
 * Sample rates (from shared config):
 * - Middleware root spans: 1% (unclassifiable by architecture, so sampled blind
 *   at a low rate for latency visibility; named and tagged in middleware.ts)
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
    return MIDDLEWARE_SAMPLE_RATE;
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
