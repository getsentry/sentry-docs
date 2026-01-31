---
name: sentry-javascript-deno
description: Learn how to manually set up Sentry in your Deno app and capture your first errors.
---

# Sentry Deno

Learn how to manually set up Sentry in your Deno app and capture your first errors.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/javascript/guides/deno.md - Learn how to manually set up Sentry in your Deno app and capture your first errors.

### Features
- https://docs.sentry.io/platforms/javascript/guides/deno/usage.md - Learn how to use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps.md - Upload your source maps to Sentry to enable readable stack traces in your errors.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading.md - Learn how to provide your source maps to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/webpack.md - Upload your source maps with our webpack plugin.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/ionic.md - Upload your source maps using Ionic and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/ionic-capacitor.md - Upload your source maps using ionic capacitor and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/typescript.md - Upload your source maps using tsc and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/vite.md - Upload your source maps with the Sentry Vite Plugin.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/esbuild.md - Upload your source maps with the Sentry esbuild Plugin.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/rollup.md - Upload your source maps with the Sentry Rollup Plugin.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/cli.md - Upload your source maps using Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/uglifyjs.md - Upload your source maps using UglifyJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/systemjs.md - Upload your source maps using SystemJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/uploading/hosting-publicly.md - Learn about publicly hosting your source maps, including how to address various security conce...
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/troubleshooting_js.md - Troubleshooting for source maps.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/troubleshooting_js/legacy-uploading-methods.md - Learn about how to upload source maps with older SDKs and Sentry tools.
- https://docs.sentry.io/platforms/javascript/guides/deno/sourcemaps/troubleshooting_js/debug-ids.md
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing.md - Learn how to enable tracing in your app.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/span-metrics.md - Learn how to add attributes to spans to monitor performance and debug applications 
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/span-metrics/examples.md - Examples of using span metrics to debug performance issues and monitor application behavior ac...
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/distributed-tracing.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/distributed-tracing/custom-instrumentation.md
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/distributed-tracing/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/configure-sampling.md - Learn how to configure sampling in your app.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/instrumentation.md - Learn how to configure spans to capture trace data on any action in your app.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/instrumentation/automatic-instrumentation.md - Learn what spans are captured after tracing is enabled.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/instrumentation/mcp-module.md - Learn how to manually instrument your code to use Sentry's MCP monitoring.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Cache module.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/javascript/guides/deno/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/javascript/guides/deno/ai-agent-monitoring.md - Monitor AI agents with token usage, latency, tool execution, and error tracking.
- https://docs.sentry.io/platforms/javascript/guides/deno/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/javascript/guides/deno/crons/troubleshooting.md - Learn how to troubleshoot your Cron Monitoring setup.
- https://docs.sentry.io/platforms/javascript/guides/deno/user-feedback.md - Learn how to enable User Feedback in your app.
- https://docs.sentry.io/platforms/javascript/guides/deno/user-feedback/configuration.md - Learn about general User Feedback configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/deno/user-feedback/configuration__v7.x.md - Learn about general User Feedback configuration fields for version 7 of the JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/javascript/guides/deno/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events.md - Add additional data to your events to make them easier to debug.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration.md - Learn about additional configuration options for the JavaScript SDKs.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/apis.md - Learn more about APIs of the SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/breadcrumbs.md - Learn how Sentry wraps native APIs of Deno to capture breadcrumbs.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/custom.md - Learn how you can enable a custom integration.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/amqplib.md - Adds instrumentation for Amqplib. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/anthropic.md - Adds instrumentation for the Anthropic SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/captureconsole.md - Captures all Console API calls via `captureException` or `captureMessage`.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/console.md - Capture console logs as breadcrumbs. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/contextlines.md - Adds source code to your stack frames. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/dedupe.md - Deduplicate certain events to avoid receiving duplicate errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/denocontext.md - Capture context about the environment and the device that the client is running on, and add it...
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/denocron.md - Instruments Deno.cron to automatically capture cron check-ins.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/extraerrordata.md - Extracts all non-native attributes from the error object and attaches them to the event as ext...
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/functiontostring.md - Allows the SDK to provide original functions and method names, even when those functions or me...
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/featureflags.md - Learn how to attach custom feature flag data to Sentry error events.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/globalhandlers.md - Attaches global handlers to capture uncaught exceptions and unhandled rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/google-genai.md - Adds instrumentation for Google Gen AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/inboundfilters.md - Allows you to ignore specific errors based on the type, message, or URLs in a given exception....
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/langchain.md - Adds instrumentation for LangChain.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/langgraph.md - Adds instrumentation for the LangGraph SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/linkederrors.md - Allows you to configure linked errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/lrumemoizer.md - Adds instrumentation for LRU Memoizer. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/modules.md - Add node modules / packages to the event. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/normalizepath.md - Normalises paths to the app root directory. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/onuncaughtexception.md - Registers handlers to capture global uncaught exceptions. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/unhandledrejection.md - Registers handlers to capture global unhandled promise rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/openai.md - Adds instrumentation for the OpenAI SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/pino.md - Capture logs and errors from Pino.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/requestdata.md - Adds data about an incoming request to an event. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/rewriteframes.md - Allows you to apply a transformation to each frame of the stack trace.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/supabase.md - Adds instrumentation for Supabase client operations.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/tedious.md - Adds instrumentation for Tedious. (default)
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/trpc.md - Capture spans & errors for tRPC handlers.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/vercelai.md - Adds instrumentation for Vercel AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/zodErrors.md - Adds additional data to Zod validation errors.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/transports.md - Transports let you change the way in which events are delivered to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/filtering.md - Learn more about how to configure your JavaScript SDK to set up filtering for events reported ...
- https://docs.sentry.io/platforms/javascript/guides/deno/configuration/tree-shaking.md - Learn how to reduce Sentry bundle size by tree shaking unused code.
- https://docs.sentry.io/platforms/javascript/guides/deno/data-management.md - Learn about different ways to scrub data within your SDK before it gets sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/deno/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/javascript/guides/deno/best-practices.md - Learn how to set up Sentry for several specific use cases with these best practice guides.
- https://docs.sentry.io/platforms/javascript/guides/deno/migration.md - Migrate from an older version of our Sentry JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/troubleshooting.md - If you need help solving issues with your Sentry JavaScript SDK integration, you can read the ...

### Enriching Events
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/javascript/guides/deno/enriching-events/transaction-name.md - Learn how to set or override transaction names to improve issue and trace-grouping.

### Data Management
- https://docs.sentry.io/platforms/javascript/guides/deno/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/javascript/guides/deno/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Best Practices
- https://docs.sentry.io/platforms/javascript/guides/deno/best-practices/shared-environments.md - Learn how to use Sentry in shared environments (for example in browser extensions or VSCode ex...
- https://docs.sentry.io/platforms/javascript/guides/deno/best-practices/micro-frontends.md - Learn how to identify the source of errors and route events to different Sentry projects when ...
- https://docs.sentry.io/platforms/javascript/guides/deno/best-practices/multiple-sentry-instances.md - Learn how to manage several Sentry instances by creating your own clients.
- https://docs.sentry.io/platforms/javascript/guides/deno/best-practices/offline-caching.md - Learn how to cache Sentry events while being offline.
- https://docs.sentry.io/platforms/javascript/guides/deno/best-practices/sentry-testkit.md - Learn how to assert that the right flow-tracking or error is being sent to Sentry, but without...

### Migration
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v9-to-v10.md - Learn about migrating from Sentry JavaScript SDK 9.x to 10.x
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v8-to-v9.md - Learn about migrating from Sentry JavaScript SDK 8.x to 9.x
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v7-to-v8.md - Learn about migrating from Sentry JavaScript SDK 7.x to 8.x
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v7-to-v8/v8-new-performance-api.md - Learn about new Tracing APIs in Sentry JavaScript SDK 8.x
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v7-to-v8/v7-deprecations.md - Learn about deprecations in Sentry JavaScript SDK 7.x and how to address them
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v6-to-v7.md - Learn about migrating from Sentry JavaScript SDK 6.x to 7.x
- https://docs.sentry.io/platforms/javascript/guides/deno/migration/v4-to-v5_v6.md - Learn about migrating from Sentry JavaScript SDK 4.x to 5.x/6.x

### Troubleshooting
- https://docs.sentry.io/platforms/javascript/guides/deno/troubleshooting/supported-browsers.md - We support a variety of browsers; check out our list.
