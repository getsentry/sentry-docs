import type {NextRequest} from 'next/server';

// Profound's Custom Log Integration: https://docs.tryprofound.com/agent-analytics/custom
const PROFOUND_LOGS_URL = 'https://artemis.api.tryprofound.com/v1/logs/custom';

// Images, fonts and scripts a crawler loads along with a page.
const ASSET_PATH =
  /\.(?:js|css|map|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|zip)$/i;

const clip = (value: string, max: number) => value.slice(0, max);

function queryParams(url: URL): Record<string, string> | undefined {
  if (!url.search) {
    return undefined;
  }
  const params: Record<string, string> = {};
  for (const [key, value] of url.searchParams) {
    params[clip(key, 100)] = clip(value, 1000);
  }
  return params;
}

// Same event name as sentry.io and the changelog, so one search of Vercel's
// logs finds failures on every site.
function logFailure(details: Record<string, unknown>) {
  console.error(JSON.stringify({event: 'profound_log_failed', ...details}));
}

/**
 * Reports one AI agent visit to Profound Agent Analytics. Docs sends Profound no
 * log drain, so this call decides what Profound sees from docs: the caller passes
 * AI agents only, not search crawlers or people.
 *
 * Does nothing outside production or without PROFOUND_LOG_TOKEN. The returned
 * promise never rejects; hand it to `event.waitUntil` so the visitor doesn't wait.
 *
 * `statusCode` is the middleware's own answer: a redirect it issues, otherwise
 * 200. The page isn't rendered yet, so a missing page is reported as 200 too.
 */
export function reportToProfound(
  request: NextRequest,
  statusCode: number
): Promise<void> | undefined {
  const token = process.env.PROFOUND_LOG_TOKEN;
  const url = request.nextUrl;
  if (
    !token ||
    process.env.VERCEL_ENV !== 'production' ||
    ASSET_PATH.test(url.pathname)
  ) {
    return undefined;
  }

  const query = queryParams(url);
  const referer = request.headers.get('referer');
  const entry = {
    timestamp: new Date().toISOString(),
    method: request.method,
    host: clip(url.hostname, 255),
    path: clip(url.pathname, 2048),
    status_code: statusCode,
    ip: clip(
      request.headers.get('x-real-ip') ??
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        '',
      45
    ),
    user_agent: clip(request.headers.get('user-agent') ?? '', 1024),
    ...(query && {query_params: query}),
    ...(referer && {referer: clip(referer, 2048)}),
  };

  return fetch(PROFOUND_LOGS_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-api-key': token},
    body: JSON.stringify([entry]),
  })
    .then(async response => {
      // Profound answers 200 with an `errors` list when it rejects an entry.
      const body = (await response.json().catch(() => null)) as {
        errors?: unknown[];
      } | null;
      if (!response.ok || body?.errors?.length) {
        logFailure({status: response.status, errors: body?.errors});
      }
    })
    .catch(error => logFailure({error: String(error)}));
}
