const isDeveloperDocs = !!process.env.NEXT_PUBLIC_DEVELOPER_DOCS;

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const developerDocsRedirects = [
  {
    source: '/sdk/miscellaneous/unified-api/tracing/:path*',
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
    source: '/processing-tickets',
    destination: 'https://open.sentry.io/triage/',
  },
  {
    source: '/api/:path*',
    destination: '/application/api/:path*',
  },
  {
    source: '/sdk/performance/:path*',
    destination: '/sdk/telemetry/traces/:path*',
  },
  {
    source: '/sdk/data-model/event-payloads/types/',
    destination: '/sdk/data-model/event-payloads/',
  },
  {
    source: '/sdk/basics/:path*',
    destination: '/sdk/processes/basics/:path*',
  },
  {
    source: '/sdk/data-handling/:path*',
    destination: '/sdk/expected-features/data-handling/:path*',
  },
  {
    source: '/sdk/features/:path*',
    destination: '/sdk/expected-features/:path*',
  },
  {
    source: '/sdk/rate-limiting/:path*',
    destination: '/sdk/expected-features/rate-limiting/:path*',
  },
  {
    source: '/sdk/envelopes/:path*',
    destination: '/sdk/data-model/envelopes/:path*',
  },
  {
    source: '/sdk/event-payloads/:path*',
    destination: '/sdk/data-model/event-payloads/:path*',
  },
  {
    source: '/sdk/hub_and_scope_refactoring/:path*',
    destination: '/sdk/miscellaneous/hub_and_scope_refactoring/:path*',
  },
  {
    source: '/sdk/unified-api/:path*',
    destination: '/sdk/miscellaneous/unified-api/:path*',
  },
  {
    source: '/sdk/sessions/:path*',
    destination: '/sdk/telemetry/sessions/:path*',
  },
  {
    source: '/sdk/client-reports/:path*',
    destination: '/sdk/telemetry/client-reports/:path*',
  },
  {
    source: '/sdk/replays/:path*',
    destination: '/sdk/telemetry/replays/:path*',
  },
  {
    source: '/sdk/setup-wizards/:path*',
    destination: '/sdk/expected-features/setup-wizards/:path*',
  },
  {
    source: '/sdk/serverless/:path*',
    destination: '/sdk/platform-specifics/serverless-sdks/:path*',
  },
  {
    source: '/sdk/serverless-sdks/:path*',
    destination: '/sdk/platform-specifics/serverless-sdks/:path*',
  },
  {
    source: '/sdk/native-sdks/:path*',
    destination: '/sdk/platform-specifics/native-sdks/:path*',
  },
  {
    source: '/sdk/javascript-sdks/:path*',
    destination: '/sdk/platform-specifics/javascript-sdks/:path*',
  },
  {
    source: '/sdk/signal-handlers/:path*',
    destination: '/sdk/platform-specifics/native-sdks/signal-handlers/:path*',
  },
  {
    source: '/sdk/store/:path*',
    destination: '/sdk/miscellaneous/store/:path*',
  },
  {
    source: '/sdk/development-process/:path*',
    destination: '/sdk/processes/:path*',
  },
  {
    source: '/application/ab-testing/',
    destination: '/backend/ab-testing/',
  },
  {
    source: '/application/api/:path*',
    destination: '/backend/api/:path*',
  },
  {
    source: '/api-server/:path*',
    destination: '/backend/:path*',
  },
  {
    source: '/application/serializers/',
    destination: '/backend/serializers/',
  },
  {
    source: '/application/feature-flags/:path*',
    destination: '/backend/feature-flags/:path*',
  },
  {
    source: '/application/grouping/',
    destination: '/backend/grouping/',
  },
  {
    source: '/application/issue-platform/',
    destination: '/backend/issue-platform/',
  },
  {
    source: '/application/transaction-clustering/',
    destination: '/backend/transaction-clustering/',
  },
  {
    source: '/application/translations/',
    destination: '/backend/translations/',
  },
  {
    source: '/application/pii/:path*',
    destination: '/backend/pii/:path*',
  },
  {
    source: '/backend/control-silo/',
    destination: '/application/control-silo/',
  },
  {
    source: '/backend/cross-region-replication/',
    destination: '/application/cross-region-replication/',
  },
  {
    source: '/backend/cross-region-rpc/',
    destination: '/application/cross-region-rpc/',
  },
  {
    source: '/development/python-dependencies/',
    destination: '/backend/python-dependencies/',
  },
  {
    source: '/development/docs/',
    destination: '/development/documentation/',
  },
  {
    source: '/development/philosophy/',
    destination: '/getting-started/philosophy/',
  },
  {
    source: '/development/database-migrations/',
    destination: '/backend/database-migrations/',
  },
  {
    source: '/services/metrics/',
    destination: '/backend/metrics/',
  },
  {
    source: '/services/nodestore/',
    destination: '/backend/nodestore/',
  },
  {
    source: '/services/devservices/',
    destination: '/development/devservices/',
  },
  {
    source: '/services/queue/',
    destination: '/backend/queue/',
  },
  {
    source: '/services/quotas/',
    destination: '/backend/quotas/',
  },
  {
    source: '/services/tsdb/',
    destination: '/services/tsdb/',
  },
  {
    source: '/services/ports/',
    destination: '/development/environment/ports/',
  },
  {
    source: '/services/buffers/',
    destination: '/backend/buffers/',
  },
  {
    source: '/services/digests/',
    destination: '/backend/digests/',
  },
  {
    source: '/services/emails/',
    destination: '/backend/emails/',
  },
];

/** @type {import('next/dist/lib/load-custom-routes').Redirect[]} */
const userDocsRedirects = [
  {
    source: '/organization/integrations/cloudflare-workers/',
    destination: '/organization/integrations/cloud-monitoring/cloudflare-workers/',
  },
  {
    source: '/account/require-2fa/',
    destination: '/organization/authentication/two-factor-authentication/',
  },
  {
    source: '/organization/integrations/msteams/',
    destination: '/organization/integrations/notification-incidents/msteams/',
  },
  {
    source: '/product/explore/session-replay/hydration-errors/',
    destination: '/product/issues/issue-details/replay-issues/hydration-error/',
  },
  {
    source: '/product/explore/session-replay/privacy/',
    destination: '/security-legal-pii/scrubbing/protecting-user-privacy/',
  },
  {
    source: '/product/explore/session-replay/rage-dead-clicks/',
    destination: '/product/issues/issue-details/replay-issues/rage-clicks/',
  },
  {
    source: '/organization/integrations/launchdarkly/',
    destination: '/organization/integrations/feature-flag/launchdarkly/',
  },
  {
    source: '/product/explore/session-replay/replay-details/',
    destination: '/product/explore/session-replay/web/replay-details/',
  },
  {
    source: '/platforms/javascript/guides/nextjs/sourcemaps/uploading/',
    destination: '/platforms/javascript/guides/nextjs/sourcemaps/',
  },
  {
    source: '/organization/integrations/vercel/',
    destination: '/organization/integrations/deployment/vercel/',
  },
  {
    source: '/product/accounts/quotas/org-stats/',
    destination: '/product/stats/',
  },
  {
    source: '/internal/:path*',
    destination: 'https://develop.sentry.dev',
  },
  {
    source: '/development/(contribute|server)/:path*',
    destination: 'https://develop.sentry.dev',
  },
  {
    source: '/organization/integrations/goastai/',
    destination: '/organization/integrations/issue-tracking/goast/',
  },
  {
    source: '/organization/integrations/github-deployment-gates/',
    destination: '/product/releases/setup/release-automation/github-deployment-gates/',
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
    source: '/platforms/javascript/configuration/environments/',
    destination: '/platforms/javascript/configuration/options/#environment',
  },
  {
    source: '/platforms/javascript/guides/:guide/configuration/environments/',
    destination: '/platforms/javascript/guides/:guide/configuration/options/#environment',
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
    source: '/platforms/javascript/guides/:guide/user-feedback/v7/',
    destination: '/platforms/javascript/guides/:guide/user-feedback/configuration__v7.x',
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
  {
    source: '/api/releases/post-organization-release-files/',
    destination: '/api/releases/update-an-organization-release-file/',
  },
  {
    source: '/api/releases/post-release-deploys/',
    destination: '/api/releases/create-a-new-deploy-for-an-organization/',
  },
  {
    source: '/api/projects/post-project-user-reports/',
    destination: '/api/projects/submit-user-feedback/',
  },
  {
    source: '/api/projects/post-project-keys/',
    destination: '/api/projects/create-a-new-client-key/',
  },
  {
    source: '/api/events/get-group-events-latest/',
    destination: '/api/events/retrieve-the-latest-event-for-an-issue/',
  },
  {
    source: '/api/organizations/get-event-id-lookup/',
    destination: '/api/organizations/resolve-an-event-id/',
  },
  {
    source: '/api/events/get-project-group-index/',
    destination: '/api/events/list-a-projects-issues/',
  },
  {
    source: '/api/events/get-group-hashes/',
    destination: '/api/events/list-an-issues-hashes/',
  },
  {
    source: '/api/projects/get-project-stats/',
    destination: '/api/projects/retrieve-event-counts-for-a-project/',
  },
  {
    source: '/api/projects/get-project-index/',
    destination: '/api/projects/list-your-projects/',
  },
  {
    source: '/api/organizations/get-organization-users/',
    destination: '/api/organizations/list-an-organizations-members/',
  },
  {
    source: '/api/events/get-group-details/',
    destination: '/api/events/retrieve-an-issue/',
  },
  {
    source: '/api/events/get-project-event-details/',
    destination: '/api/events/retrieve-an-event-for-a-project/',
  },
  {
    source: '/api/events/get-group-tag-key-details/',
    destination: '/api/events/retrieve-tag-details/',
  },
  {
    source: '/api/organizations/get-organization-projects/',
    destination: '/api/organizations/list-an-organizations-projects/',
  },
  {
    source: '/api/releases/post-project-release-files/',
    destination: '/api/releases/upload-a-new-project-release-file/',
  },
  {
    source: '/api/projects/get-project-users/',
    destination: '/api/projects/list-a-projects-users/',
  },
  {
    source: '/api/projects/put-project-details/',
    destination: '/api/projects/update-a-project/',
  },
  {
    source: '/api/projects/post-debug-files/',
    destination: '/api/projects/upload-a-new-file/',
  },
  {
    source: '/api/organizations/get-organization-stats/',
    destination: '/api/organizations/retrieve-event-counts-for-an-organization/',
  },
  {
    source: '/api/releases/post-organization-releases/',
    destination: '/api/releases/create-a-new-release-for-an-organization/',
  },
  {
    source: '/api/projects/get-project-keys/',
    destination: '/api/projects/list-a-projects-client-keys/',
  },
  {
    source: '/api/teams/get-organization-teams/',
    destination: '/api/teams/list-an-organizations-teams/',
  },
  {
    source: '/api/teams/post-team-projects/',
    destination: '/api/teams/create-a-new-project/',
  },
  {
    source: '/api/events/put-project-group-index/',
    destination: '/api/events/bulk-mutate-a-list-of-issues/',
  },
  {
    source: '/api/events/delete-project-group-index/',
    destination: '/api/events/bulk-remove-a-list-of-issues/',
  },
  {
    source: '/api/projects/delete-project-details/',
    destination: '/api/projects/delete-a-project/',
  },
  {
    source: '/api/events/get-group-events/',
    destination: '/api/events/list-an-issues-events/',
  },
  {
    source: '/api/organizations/get-organization-details/',
    destination: '/api/organizations/retrieve-an-organization/',
  },
  {
    source: '/api/organizations/experimental-retrieve-release-health-session-statistics/',
    destination: '/api/releases/retrieve-release-health-session-statistics/',
  },
  {
    source: '/api/rate-limits/',
    destination: '/api/ratelimits/',
  },
  {
    source: '/platforms/react-native/manual-setup/codepush/',
    destination: '/platforms/react-native/sourcemaps/uploading/codepush/',
  },
  {
    source: '/organization/integrations/launchdarkly/',
    destination: '/organization/integrations/feature-flag/launchdarkly/',
  },
  {
    source:
      '/platforms/react-native/data-management/debug-files/source-context/data-management/debug-files/upload/',
    destination: '/platforms/react-native/data-management/debug-files/upload/',
  },
  // Redirects for prior Insights information architecture:
  {
    source: '/product/insights/requests/',
    destination: '/product/insights/backend/requests/',
  },
  {
    source: '/product/insights/queries/',
    destination: '/product/insights/backend/queries/',
  },
  {
    source: '/product/insights/assets/',
    destination: '/product/insights/frontend/assets/',
  },
  {
    source: '/product/insights/mobile-vitals/',
    destination: '/product/insights/mobile/',
  },
  {
    source: '/product/insights/mobile-vitals/app-starts/',
    destination: '/product/insights/mobile/app-starts/',
  },
  {
    source: '/product/insights/mobile-vitals/screen-loads/',
    destination: '/product/insights/mobile/screen-loads/',
  },
  {
    source: '/product/insights/web-vitals/',
    destination: '/product/insights/frontend/web-vitals/',
  },
  {
    source: '/product/insights/web-vitals/web-vitals-concepts/',
    destination: '/product/insights/frontend/web-vitals/web-vitals-concepts/',
  },
  {
    source: '/product/insights/caches/',
    destination: '/product/insights/backend/caches/',
  },
  {
    source: '/product/insights/caches/cache-page/',
    destination: '/product/insights/backend/caches/cache-page/',
  },
  {
    source: '/product/insights/queue-monitoring/',
    destination: '/product/insights/backend/queue-monitoring/',
  },
  {
    source: '/product/insights/queue-monitoring/queues-page/',
    destination: '/product/insights/backend/queue-monitoring/queues-page/',
  },
  {
    source: '/product/insights/llm-monitoring/',
    destination: '/product/insights/ai/llm-monitoring/',
  },
  {
    source: '/product/insights/llm-monitoring/getting-started/',
    destination: '/product/insights/ai/llm-monitoring/getting-started/',
  },
  {
    source: '/product/insights/llm-monitoring/getting-started/the-dashboard/',
    destination: '/product/insights/ai/llm-monitoring/getting-started/the-dashboard/',
  },
  // End of Insights reduirects.
  {
    source: '/platforms/javascript/guides/astro/manual-setup/',
    destination: '/platforms/javascript/guides/astro/',
  },
  {
    source: '/product/error-monitoring/dashboards/',
    destination: '/product/dashboards/',
  },
  {
    source: '/product/error-monitoring/filtering/',
    destination: '/concepts/data-management/filtering/',
  },
  {
    source: '/product/error-monitoring/issue-owners/',
    destination: '/product/issues/ownership-rules/',
  },
  {
    source: '/product/error-monitoring/reprocessing/',
    destination: '/product/issues/reprocessing/',
  },
  {
    source: '/product/error-monitoring/breadcrumbs/',
    destination: '/product/issues/issue-details/breadcrumbs/',
  },
  {
    source: '/product/error-monitoring/user-impact/',
    destination: '/product/issues/issue-details/',
  },
  {
    source: '/product/error-monitoring/stacktrace/',
    destination: '/product/issues/issue-details/#stack-trace',
  },
  {
    source: '/product/error-monitoring/:path*',
    destination: '/product/issues',
  },
  {
    source: '/platforms/kotlin-multiplatform/:path*',
    destination: '/platforms/kotlin/guides/kotlin-multiplatform/:path*',
  },
  {
    source: '/product/explore/feature-flags/:path*',
    destination: '/product/issues/issue-details/feature-flags/:path*',
  },
];

/**
 * @type {import('next').NextConfig['redirects']}
 *
 * loads the redirects based on the environment variable `NEXT_PUBLIC_DEVELOPER_DOCS`
 */
// eslint-disable-next-line require-await
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
