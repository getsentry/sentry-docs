---
name: sentry-javascript-cloudflare
description: Learn how to manually set up Sentry for Cloudflare Workers and Cloudflare Pages and capture your first errors.
---

# Sentry Cloudflare

Learn how to manually set up Sentry for Cloudflare Workers and Cloudflare Pages and capture your first errors.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/javascript/guides/cloudflare.md - Learn how to manually set up Sentry for Cloudflare Workers and Cloudflare Pages and capture yo...

### Features
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/usage.md - Learn how to use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps.md - Upload your source maps to Sentry to enable readable stack traces in your errors.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading.md - Learn how to provide your source maps to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/webpack.md - Upload your source maps with our webpack plugin.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/ionic.md - Upload your source maps using Ionic and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/ionic-capacitor.md - Upload your source maps using ionic capacitor and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/typescript.md - Upload your source maps using tsc and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/vite.md - Upload your source maps with the Sentry Vite Plugin.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/esbuild.md - Upload your source maps with the Sentry esbuild Plugin.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/rollup.md - Upload your source maps with the Sentry Rollup Plugin.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/cli.md - Upload your source maps using Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/uglifyjs.md - Upload your source maps using UglifyJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/systemjs.md - Upload your source maps using SystemJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/hosting-publicly.md - Learn about publicly hosting your source maps, including how to address various security conce...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/uploading/wrangler.md - Upload your Cloudflare Workers source maps using Wrangler and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/troubleshooting_js.md - Troubleshooting for source maps.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/troubleshooting_js/legacy-uploading-methods.md - Learn about how to upload source maps with older SDKs and Sentry tools.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sourcemaps/troubleshooting_js/debug-ids.md
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing.md - Learn how to enable tracing in your app.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/span-metrics.md - Learn how to add attributes to spans to monitor performance and debug applications 
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/span-metrics/examples.md - Examples of using span metrics to debug performance issues and monitor application behavior ac...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/distributed-tracing.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/distributed-tracing/custom-instrumentation.md
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/distributed-tracing/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/configure-sampling.md - Learn how to configure sampling in your app.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/instrumentation.md - Learn how to configure spans to capture trace data on any action in your app.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/instrumentation/automatic-instrumentation.md - Learn what spans are captured after tracing is enabled.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/instrumentation/mcp-module.md - Learn how to manually instrument your code to use Sentry's MCP monitoring.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Cache module.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/ai-agent-monitoring.md - Monitor AI agents with token usage, latency, tool execution, and error tracking.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/crons/troubleshooting.md - Learn how to troubleshoot your Cron Monitoring setup.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/user-feedback.md - Learn how to enable User Feedback in your app.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/user-feedback/configuration.md - Learn about general User Feedback configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/user-feedback/configuration__v7.x.md - Learn about general User Feedback configuration fields for version 7 of the JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events.md - Add additional data to your events to make them easier to debug.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration.md - Learn about additional configuration options for the JavaScript SDKs.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/apis.md - Learn more about APIs of the SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/custom.md - Learn how you can enable a custom integration.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/anthropic.md - Adds instrumentation for the Anthropic SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/captureconsole.md - Captures all Console API calls via `captureException` or `captureMessage`.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/console.md - Capture console logs as breadcrumbs. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/dedupe.md - Deduplicate certain events to avoid receiving duplicate errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/extraerrordata.md - Extracts all non-native attributes from the error object and attaches them to the event as ext...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/fetchIntegration.md - A default integration that creates spans and attaches tracing headers to fetch requests in Clo...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/functiontostring.md - Allows the SDK to provide original functions and method names, even when those functions or me...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/featureflags.md - Learn how to attach custom feature flag data to Sentry error events.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/globalhandlers.md - Attaches global handlers to capture uncaught exceptions and unhandled rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/google-genai.md - Adds instrumentation for Google Gen AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/hono.md - Reports Hono errors to Sentry. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/inboundfilters.md - Allows you to ignore specific errors based on the type, message, or URLs in a given exception....
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/langchain.md - Adds instrumentation for LangChain.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/langgraph.md - Adds instrumentation for the LangGraph SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/linkederrors.md - Allows you to configure linked errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/modules.md - Add node modules / packages to the event. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/onuncaughtexception.md - Registers handlers to capture global uncaught exceptions. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/unhandledrejection.md - Registers handlers to capture global unhandled promise rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/openai.md - Adds instrumentation for the OpenAI SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/requestdata.md - Adds data about an incoming request to an event. (default)
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/rewriteframes.md - Allows you to apply a transformation to each frame of the stack trace.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/supabase.md - Adds instrumentation for Supabase client operations.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/trpc.md - Capture spans & errors for tRPC handlers.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/vercelai.md - Adds instrumentation for Vercel AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/integrations/zodErrors.md - Adds additional data to Zod validation errors.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/transports.md - Transports let you change the way in which events are delivered to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/filtering.md - Learn more about how to configure your JavaScript SDK to set up filtering for events reported ...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/configuration/tree-shaking.md - Learn how to reduce Sentry bundle size by tree shaking unused code.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/data-management.md - Learn about different ways to scrub data within your SDK before it gets sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/best-practices.md - Learn how to set up Sentry for several specific use cases with these best practice guides.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration.md - Migrate from an older version of our Sentry JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/troubleshooting.md - If you need help solving issues with your Sentry JavaScript SDK integration, you can read the ...

### Enriching Events
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/enriching-events/transaction-name.md - Learn how to set or override transaction names to improve issue and trace-grouping.

### Data Management
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Best Practices
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/best-practices/shared-environments.md - Learn how to use Sentry in shared environments (for example in browser extensions or VSCode ex...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/best-practices/micro-frontends.md - Learn how to identify the source of errors and route events to different Sentry projects when ...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/best-practices/multiple-sentry-instances.md - Learn how to manage several Sentry instances by creating your own clients.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/best-practices/offline-caching.md - Learn how to cache Sentry events while being offline.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/best-practices/sentry-testkit.md - Learn how to assert that the right flow-tracking or error is being sent to Sentry, but without...

### Migration
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v9-to-v10.md - Learn about migrating from Sentry JavaScript SDK 9.x to 10.x
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v8-to-v9.md - Learn about migrating from Sentry JavaScript SDK 8.x to 9.x
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v7-to-v8.md - Learn about migrating from Sentry JavaScript SDK 7.x to 8.x
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v7-to-v8/v8-new-performance-api.md - Learn about new Tracing APIs in Sentry JavaScript SDK 8.x
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v7-to-v8/v7-deprecations.md - Learn about deprecations in Sentry JavaScript SDK 7.x and how to address them
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v6-to-v7.md - Learn about migrating from Sentry JavaScript SDK 6.x to 7.x
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/migration/v4-to-v5_v6.md - Learn about migrating from Sentry JavaScript SDK 4.x to 5.x/6.x

### Troubleshooting
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/troubleshooting/supported-browsers.md - We support a variety of browsers; check out our list.

### Other
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/features.md - Learn how Sentry's Cloudflare SDK exposes features for first class integration with Cloudflare.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/features/d1.md - Learn how to add span instrumentation for Cloudflare D1.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/features/durableobject.md - Learn how to add Sentry instrumentation for Cloudflare Durable Objects.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/features/workflows.md - Learn how to add Sentry instrumentation for Cloudflare Workflows.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks.md - Learn how to set up the Cloudflare SDK with popular Frameworks like Astro, SvelteKit, Remix, a...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/astro.md - Learn how to add Cloudflare instrumentation to your Astro app.
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hono.md - Learn how to instrument your Hono app on Cloudflare Workers and capture your first errors with...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hydrogen-react-router.md - Learn how to use the Sentry React Router SDK to instrument your Hydrogen app (versions 2025.5....
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/hydrogen-remix.md - Learn how to use the Sentry Remix SDK to instrument your Hydrogen app (versions before 2025.5.0).
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/nuxt.md - Learn how to instrument your Nuxt app on Cloudflare Workers and Pages and capture your first e...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/remix.md - Learn how to instrument your Remix app on Cloudflare Workers and Pages and capture your first ...
- https://docs.sentry.io/platforms/javascript/guides/cloudflare/frameworks/sveltekit.md - Learn how to instrument your SvelteKit app on Cloudflare Workers and Pages and capture your fi...
