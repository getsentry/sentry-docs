const isDeveloperDocs = !!process.env.NEXT_PUBLIC_DEVELOPER_DOCS;

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const developerDocsRedirects = [
  {
    source: '/sdk/unified-api/tracing/:path*',
    destination: '/sdk/performance/:path*',
  },
  {
    source: '/onpremise/:path*',
    destination: '/self-hosted/:path*',
  },
  {
    source: '/self-hosted/mail/:path*',
    destination: '/self-hosted/email/:path*',
  },
  {
    source: '/processing-tickets(/?)',
    destination: 'https://open.sentry.io/triage/',
  },
];

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const userDocsRedirects = [
  {
    source: '/internal/:path*',
    destination: 'https://develop.sentry.dev',
  },
  {
    source: '/development/(contribute|server)/:path*',
    destination: 'https://develop.sentry.dev',
  },
  {
    source: '/development/sdk-dev/:path*',
    destination: 'https://develop.sentry.dev',
  },
  {
    source: '/client-dev/:path*',
    destination: 'https://develop.sentry.dev/sdk/',
  },
  {
    source: '/clientdev/:path*',
    destination: 'https://develop.sentry.dev/sdk/',
  },
  {
    source: '/server/config/:path*',
    destination: 'https://develop.sentry.dev/config/',
  },
  {
    source: '/server/queue/:path*',
    destination: 'https://develop.sentry.dev/services/queue/',
  },
  {
    source: '/server/:path*',
    destination: 'https://develop.sentry.dev/self-hosted/',
  },
  {
    source: '/meta/relay/:path*',
    destination: '/product/relay/:path*',
  },
  {
    source: '/meta/:path*',
    destination: '/product/security/:path*',
  },
  {
    source: '/:type(hosted|on-premise)/:path*',
    destination: '/:path*',
  },
  {
    source: '/error-reporting/:path*',
    destination: '/platform-redirect/',
  },
  {
    source: '/product/cli/:path*',
    destination: '/cli/:path*',
  },
  {
    source: '/product/reference/:path*',
    destination: '/concepts/:path*',
  },
  {
    source: '/product/sentry-basics/concepts/:path*',
    destination: '/concepts/key-terms/:path*',
  },
  {
    source: '/product/security/:path*',
    destination: '/security-legal-pii/security/:path*',
  },
  {
    source: '/product/data-management-settings/scrubbing/:path*',
    destination: '/security-legal-pii/scrubbing/:path*',
  },
  {
    source: '/product/data-management-settings/:path*',
    destination: '/concepts/data-management/:path*',
  },
  {
    source: '/data-management/:path*',
    destination: '/concepts/data-management/',
  },
  {
    source: '/product/integrations/:path*',
    destination: '/organization/integrations/:path*',
  },
  {
    source: '/product/accounts/:path*',
    destination: '/account/:path*',
  },
  {
    source: '/accounts/:path*',
    destination: '/account/:path*',
  },
  {
    source: '/accounts/pricing/:path*',
    destination: '/pricing/:path*',
  },
  {
    source: '/account/pricing/:path*',
    destination: '/pricing/:path*',
  },
  {
    source: '/account/sso/:path*',
    destination: '/organization/authentication/sso/:path*',
  },
  {
    source: '/account/quotas/:path*',
    destination: '/pricing/quotas/:path*',
  },
  {
    source: '/account/migration/:path*',
    destination: '/concepts/migration/:path*',
  },
  {
    source: '/organization/quotas/:path*',
    destination: '/pricing/quotas/:path*',
  },
  {
    source: '/platforms/cocoa/:path*',
    destination: '/platforms/apple/:path*',
  },
  {
    source: '/platforms/unrealengine/:path*',
    destination: '/platforms/unreal/:path*',
  },
  {
    source: '/platforms/node/guides/:path*',
    destination: '/platforms/javascript/guides/:path*',
  },
  {
    source: '/platforms/node/:path*',
    destination: '/platforms/javascript/guides/node/:path*',
  },
  {
    source: '/platforms/:platform/configuration/capture/:path*',
    destination: '/platforms/:platform/usage/',
  },
  {
    source: '/platforms/:platform/guides/:guide/configuration/capture/:path*',
    destination: '/platforms/:platform/guides/:guide/usage/',
  },
  {
    source: '/platforms/:platform/configuration/install-cdn/:path*',
    destination: '/platforms/:platform/install/loader/',
  },
  {
    source: '/platforms/:platform/enriching-error-data/set-level/:path*',
    destination: '/platforms/:platform/usage/set-level/',
  },
  {
    source: '/platforms/:platform/guides/:guide/enriching-error-data/set-level/:path*',
    destination: '/platforms/:platform/guides/:guide/usage/set-level/',
  },
  {
    source:
      '/platforms/:platform/enriching-error-data/additional-data/manage-context/:path*',
    destination: '/platforms/:platform/enriching-events/context/',
  },
  {
    source:
      '/platforms/:platform/guides/:guide/enriching-error-data/additional-data/manage-context/:path*',
    destination: '/platforms/:platform/guides/:guide/enriching-events/context/',
  },
  {
    source:
      '/platforms/:platform/enriching-error-data/additional-data/adding-tags/:path*',
    destination: '/platforms/:platform/enriching-events/tags/',
  },
  {
    source: '/platforms/:platform/enriching-error-data/additional-data/:path*',
    destination: '/platforms/:platform/enriching-events/:path*',
  },
  {
    source:
      '/platforms/:platform/guides/:guide/enriching-error-data/additional-data/:path*',
    destination: '/platforms/:platform/guides/:guide/enriching-events/:path*',
  },
  {
    source: '/platforms/:platform/enriching-error-data/:path*',
    destination: '/platforms/:platform/enriching-events/:path*',
  },
  {
    source: '/platforms/:platform/guides/:guide/enriching-error-data/:path*',
    destination: '/platforms/:platform/guides/:guide/enriching-events/:path*',
  },
  {
    source: '/enriching-error-data/:path*',
    destination: '/platforms/javascript/enriching-events/:path*',
  },
  {
    source: '/platforms/javascript/guides/:guide/integrations/default/',
    destination: '/platforms/javascript/guides/:guide/configuration/integrations/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/integrations/default/',
    destination: '/platforms/javascript/guides/:guide/configuration/integrations/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/integrations/plugin/',
    destination: '/platforms/javascript/guides/:guide/configuration/integrations/',
  },
  {
    source: '/platforms/javascript/guides/:guide/config/',
    destination: '/platforms/javascript/guides/:guide/configuration/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/sourcemaps/',
    destination: '/platforms/javascript/guides/:guide/sourcemaps/',
  },
  {
    source: '/platforms/javascript/guides/:guide/integrations/plugin/',
    destination: '/platforms/javascript/guides/:guide/configuration/integrations/plugin/',
  },
  {
    source: '/platforms/:platform/context/',
    destination: '/platforms/:platform/enriching-events/context/',
  },
  {
    source: '/platforms/:platform/data-management/advanced-datascrubbing/',
    destination: '/platforms/:platform/data-management/sensitive-data/',
  },
  {
    source: '/platforms/:platform/data-management/data-forwarding/',
    destination: '/concepts/data-management/data-forwarding/',
  },
  {
    source: '/platforms/:platform/data-management/event-grouping/',
    destination: '/concepts/data-management/event-grouping/',
  },
  {
    source: '/platforms/:platform/data-management/event-grouping/sdk-fingerprinting/',
    destination: '/concepts/data-management/event-grouping/fingerprint-rules/',
  },
  {
    source: '/platforms/:platform/data-management/server-side-scrubbing/',
    destination: '/platforms/:platform/data-management/sensitive-data/',
  },
  {
    source:
      '/platforms/:platform/guides/:guide/data-management/event-grouping/fingerprint-rules/',
    destination: '/concepts/data-management/event-grouping/fingerprint-rules/',
  },
  {
    source: '/platforms/:platform/data-management/sensitive-data/advanced-datascrubbing/',
    destination: '/platforms/:platform/data-management/sensitive-data/',
  },
  {
    source: '/platforms/dotnet/guides/:guide/compatibility/',
    destination: '/platforms/dotnet/guides/:guide/',
  },
  {
    source: '/platforms/javascript/guides/:guide/sourcemaps/uploading/multiple-origins/',
    destination:
      '/platforms/javascript/guides/:guide/sourcemaps/troubleshooting_js/#multiple-origins',
  },
  {
    source: '/platforms/python/configuration/integrations/:integration/',
    destination: '/platforms/python/integrations/:integration/',
  },
  {
    source: '/platforms/python/guides/:guide/configuration/integrations/:integration/',
    destination: '/platforms/python/integrations/:integration/',
  },
  {
    source: '/platforms/python/guides/:guide/',
    destination: '/platforms/python/integrations/:guide',
  },
  {
    source: '/platforms/python/guides/:guide/:path*',
    destination: '/platforms/python/:path*',
  },
  {
    source: '/platforms/php/guides/laravel/other-versions/laravel8-10/usage/:path*',
    destination: '/platforms/php/guides/laravel/usage/:path*',
  },
  {
    source:
      '/platforms/php/guides/laravel/other-versions/laravel8-10/configuration/:path*',
    destination: '/platforms/php/guides/laravel/configuration/:path*',
  },
  {
    source:
      '/platforms/javascript/guides/:guide/sourcemaps/troubleshooting_js/uploading-without-debug-ids/',
    destination: '/platforms/javascript/guides/:guide/sourcemaps/troubleshooting_js/',
  },
  {
    source: '/platforms/javascript/guides/:guide/sourcemaps/hosting-publicly/',
    destination:
      '/platforms/javascript/guides/:guide/sourcemaps/uploading/hosting-publicly',
  },
  {
    source:
      '/platforms/:platform/sourcemaps/:section(generating|validating|best-practices|artifact-and-release-bundles|)/',
    destination: '/platforms/:platform/sourcemaps/',
  },
  {
    source:
      '/platforms/:platform/guides/:guide/sourcemaps/:section(generating|validating|best-practices|artifact-and-release-bundles)/',
    destination: '/platforms/:platform/guides/:guide/sourcemaps/',
  },
  {
    source: '/platforms/minidump/crashpad/:path*',
    destination: '/platforms/native/guides/crashpad/:path*',
  },
  {
    source: '/platforms/minidump/breakpad/:path*',
    destination: '/platforms/native/guides/breakpad/:path*',
  },
  {
    source: '/platforms/:platform/performance/troubleshooting-performance/',
    destination: '/platforms/:platform/tracing/troubleshooting/',
  },
  {
    source: '/platforms/:platform/performance/troubleshooting/',
    destination: '/platforms/:platform/tracing/troubleshooting/',
  },
  {
    source: '/platforms/:platform/guides/:guide/performance/troubleshooting-performance/',
    destination: '/platforms/:platform/guides/:guide/tracing/troubleshooting/',
  },
  {
    source: '/platforms/:platform/guides/:guide/performance/troubleshooting/',
    destination: '/platforms/:platform/guides/:guide/tracing/troubleshooting/',
  },
  {
    source: '/platforms/:platform/performance/connect-services/',
    destination: '/platforms/:platform/tracing/trace-propagation/',
  },
  {
    source: '/platforms/:platform/guides/:guide/performance/connect-services/',
    destination: '/platforms/:platform/guides/:guide/tracing/trace-propagation/',
  },
  {
    source: '/platforms/:platform/usage/distributed-tracing/',
    destination: '/platforms/:platform/tracing/trace-propagation/',
  },
  {
    source: '/platforms/:platform/guides/:guide/usage/distributed-tracing/:path*',
    destination: '/platforms/:platform/guides/:guide/tracing/trace-propagation/:path*',
  },
  {
    source: '/platforms/:platform/distributed-tracing/:path*',
    destination: '/platforms/:platform/tracing/trace-propagation/:path*',
  },
  {
    source: '/platforms/:platform/guides/:guide/distributed-tracing/:path*',
    destination: '/platforms/:platform/guides/:guide/tracing/trace-propagation/:path*',
  },
  {
    source: '/platforms/python/guides/asgi/:path*',
    destination: '/platforms/python/configuration/integrations/asgi/',
  },
  {
    source: '/platforms/python/guides/wsgi/:path*',
    destination: '/platforms/python/configuration/integrations/wsgi/',
  },
  {
    source: '/platforms/:platform/performance/sampling/',
    destination: '/platforms/:platform/tracing/',
  },
  {
    source: '/platforms/:platform/guides/:guide/performance/sampling/',
    destination: '/platforms/:platform/guides/:guide/tracing/',
  },
  {
    source: '/platforms/:platform/performance/:path*',
    destination: '/platforms/:platform/tracing/:path*',
  },
  {
    source: '/platforms/:platform/guides/:guide/performance/:path*',
    destination: '/platforms/:platform/guides/:guide/tracing/:path*',
  },
  {
    source: '/platforms/java/configuration/integrations/:integration/',
    destination: '/platforms/java/integrations/:integration/',
  },
  {
    source: '/platforms/java/guides/:guide/configuration/integrations/:integration/',
    destination: '/platforms/java/guides/:guide/integrations/:integration/',
  },
  {
    source: '/platforms/apple/configuration/integrations/:integration/',
    destination: '/platforms/apple/integrations/:integration/',
  },
  {
    source: '/platforms/apple/guides/:guide/configuration/integrations/',
    destination: '/platforms/apple/guides/:guide/integrations/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/micro-frontend-support/',
    destination: '/platforms/javascript/guides/:guide/best-practices/micro-frontends/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/sentry-testkit/',
    destination: '/platforms/javascript/guides/:guide/best-practices/sentry-testkit/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/webworkers/',
    destination: '/platforms/javascript/guides/:guide/best-practices/web-workers/',
  },
  {
    source: '/platforms/apple/guides/:guide/configuration/integrations/:integration/',
    destination: '/platforms/apple/guides/:guide/integrations/:integration/',
  },
  {
    source: '/platforms/:platform/crons/troubleshooting-crons/',
    destination: '/platforms/:platform/crons/troubleshooting/',
  },
  {
    source: '/platforms/:platform/guides/:guide/crons/troubleshooting-crons/',
    destination: '/platforms/:platform/guides/:guide/crons/troubleshooting/',
  },
  {
    source: '/platforms/:platform/guides/:guide/enriching-events/user-feedback/',
    destination: '/platforms/:platform/guides/:guide/user-feedback/',
  },
  {
    source: '/platforms/:platform/enriching-events/user-feedback/',
    destination: '/platforms/:platform/user-feedback/',
  },
  {
    source: '/product/metrics/:path*',
    destination: '/product/explore/metrics/:path*',
  },
  {
    source: '/product/profiling/:path*',
    destination: '/product/explore/profiling/:path*',
  },
  {
    source: '/product/discover-queries/:path*',
    destination: '/product/explore/discover-queries/:path*',
  },
  {
    source: '/product/session-replay/:path*',
    destination: '/product/explore/session-replay/:path*',
  },
  {
    source: '/platforms/javascript/best-practices/browser-extensions/',
    destination: '/platforms/javascript/best-practices/shared-environments/',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/integrations/trycatch/',
    destination: '/platforms/javascript/configuration/integrations/browserapierrors/',
  },
];

/**
 * @type {import('next').NextConfig['redirects']}
 *
 * loads the redirects based on the environment variable `NEXT_PUBLIC_DEVELOPER_DOCS`
 */
const redirects = async () => {
  console.log(
    '🔄 using',
    isDeveloperDocs ? 'developer' : 'sdk',
    'docs redirects in next.config.js'
  );
  return (isDeveloperDocs ? developerDocsRedirects : userDocsRedirects).map(r => {
    return {...r, permanent: true};
  });
};

module.exports = {redirects};
