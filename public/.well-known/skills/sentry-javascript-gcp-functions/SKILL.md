---
name: sentry-javascript-gcp-functions
description: Learn how to manually set up Sentry in your Google Cloud Functions and capture your first errors.
---

# Sentry Google Cloud Functions

Learn how to manually set up Sentry in your Google Cloud Functions and capture your first errors.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions.md - Learn how to manually set up Sentry in your Google Cloud Functions and capture your first errors.

### Features
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/usage.md - Learn how to use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps.md - Upload your source maps to Sentry to enable readable stack traces in your errors.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading.md - Learn how to provide your source maps to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/webpack.md - Upload your source maps with our webpack plugin.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/ionic.md - Upload your source maps using Ionic and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/ionic-capacitor.md - Upload your source maps using ionic capacitor and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/typescript.md - Upload your source maps using tsc and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/vite.md - Upload your source maps with the Sentry Vite Plugin.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/esbuild.md - Upload your source maps with the Sentry esbuild Plugin.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/rollup.md - Upload your source maps with the Sentry Rollup Plugin.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/cli.md - Upload your source maps using Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/uglifyjs.md - Upload your source maps using UglifyJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/uploading/systemjs.md - Upload your source maps using SystemJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/troubleshooting_js.md - Troubleshooting for source maps.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/troubleshooting_js/legacy-uploading-methods.md - Learn about how to upload source maps with older SDKs and Sentry tools.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sourcemaps/troubleshooting_js/debug-ids.md
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing.md - Learn how to enable tracing in your app.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/span-metrics.md - Learn how to add attributes to spans to monitor performance and debug applications 
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/span-metrics/examples.md - Examples of using span metrics to debug performance issues and monitor application behavior ac...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/distributed-tracing.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/distributed-tracing/custom-instrumentation.md
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/configure-sampling.md - Learn how to configure sampling in your app.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/instrumentation.md - Learn how to configure spans to capture trace data on any action in your app.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/instrumentation/mcp-module.md - Learn how to manually instrument your code to use Sentry's MCP monitoring.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Cache module.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/ai-agent-monitoring.md - Monitor AI agents with token usage, latency, tool execution, and error tracking.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/ai-agent-monitoring/mastra.md - Learn how to export Mastra AI tracing to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/profiling.md - Collect & view performance insights for JavaScript programs with Sentry's Profiling integratio...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/crons/troubleshooting.md - Learn how to troubleshoot your Cron Monitoring setup.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/user-feedback.md - Learn how to enable User Feedback in your app.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/user-feedback/configuration.md - Learn about general User Feedback configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/user-feedback/configuration__v7.x.md - Learn about general User Feedback configuration fields for version 7 of the JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events.md - Add additional data to your events to make them easier to debug.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration.md - Learn about additional configuration options for the JavaScript SDKs.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/apis.md - Learn more about APIs of the SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/custom.md - Learn how you can enable a custom integration.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/amqplib.md - Adds instrumentation for Amqplib. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/anr.md - Capture events when the event loop is blocked and the application is no longer responding.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/anthropic.md - Adds instrumentation for the Anthropic SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/captureconsole.md - Captures all Console API calls via `captureException` or `captureMessage`.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/childProcess.md - Adds instrumentation for child processes and worker threads (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/console.md - Capture console logs as breadcrumbs. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/nodecontext.md - Capture context about the environment and the device that the client is running on, and add it...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/contextlines.md - Adds source code to your stack frames. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/dataloader.md - Adds instrumentation for Dataloader.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/dedupe.md - Deduplicate certain events to avoid receiving duplicate errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/event-loop-block.md - Monitor for blocked event loops in all threads of a Node.js application.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/extraerrordata.md - Extracts all non-native attributes from the error object and attaches them to the event as ext...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/fs.md - Adds instrumentation for filesystem operations.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/firebase.md - Adds instrumentation for Firebase. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/functiontostring.md - Allows the SDK to provide original functions and method names, even when those functions or me...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/featureflags.md - Learn how to attach custom feature flag data to Sentry error events.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/genericpool.md - Adds instrumentation for Generic Pool. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/google-genai.md - Adds instrumentation for Google Gen AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/googlecloudgrpc.md - Google Cloud Platform service requests tracking for GRPC APIs. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/googlecloudhttp.md - Google Cloud Platform service requests tracking for RESTful APIs. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/graphql.md - Adds instrumentation for GraphQL. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/http.md - Capture spans & breadcrumbs for http requests. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/inboundfilters.md - Allows you to ignore specific errors based on the type, message, or URLs in a given exception....
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/kafka.md - Adds instrumentation for KafkaJS. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/knex.md - Adds instrumentation for Knex.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/langchain.md - Adds instrumentation for LangChain.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/langgraph.md - Adds instrumentation for the LangGraph SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/linkederrors.md - Allows you to configure linked errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/localvariables.md - Add local variables to exception frames. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/lrumemoizer.md - Adds instrumentation for LRU Memoizer. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/modules.md - Add node modules / packages to the event. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/mongo.md - Adds instrumentation for MongoDB. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/mongoose.md - Adds instrumentation for Mongoose. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/mysql.md - Adds instrumentation for MySQL. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/mysql2.md - Adds instrumentation for MySQL2. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/nodefetch.md - Capture spans & breadcrumbs for node fetch requests. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/nodeprofiling.md - Capture profiling data for Node.js applications.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/onuncaughtexception.md - Registers handlers to capture global uncaught exceptions. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/unhandledrejection.md - Registers handlers to capture global unhandled promise rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/openai.md - Adds instrumentation for the OpenAI SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/pino.md - Capture logs and errors from Pino.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/postgres.md - Adds instrumentation for Postgres. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/prisma.md - Adds instrumentation for Prisma. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/prisma__v8.x.md - Adds instrumentation for Prisma.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/redis.md - Adds instrumentation for Redis. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/requestdata.md - Adds data about an incoming request to an event. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/rewriteframes.md - Allows you to apply a transformation to each frame of the stack trace.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/supabase.md - Adds instrumentation for Supabase client operations.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/tedious.md - Adds instrumentation for Tedious. (default)
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/trpc.md - Capture spans & errors for tRPC handlers.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/vercelai.md - Adds instrumentation for Vercel AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/integrations/zodErrors.md - Adds additional data to Zod validation errors.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/filtering.md - Learn more about how to configure your JavaScript SDK to set up filtering for events reported ...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/event-loop-block.md - Monitor for blocked event loops in Node.js applications
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/configuration/async-context.md - Learn more about how to isolate Sentry scope and breadcrumbs across requests.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/opentelemetry.md - Learn how to use OpenTelemetry with Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/opentelemetry/using-opentelemetry-apis.md - Learn how to use OpenTelemetry APIs with Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/opentelemetry/custom-setup.md - Learn how to use your existing custom OpenTelemetry setup with Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/data-management.md - Learn about different ways to scrub data within your SDK before it gets sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration.md - Migrate from an older version of our Sentry JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/troubleshooting.md - If you need help solving issues with your Sentry JavaScript SDK integration, you can read the ...

### Enriching Events
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/enriching-events/transaction-name.md - Learn how to set or override transaction names to improve issue and trace-grouping.

### Data Management
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Best Practices
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/best-practices/sentry-testkit.md - Learn how to assert that the right flow-tracking or error is being sent to Sentry, but without...

### Migration
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v9-to-v10.md - Learn about migrating from Sentry JavaScript SDK 9.x to 10.x
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v8-to-v9.md - Learn about migrating from Sentry JavaScript SDK 8.x to 9.x
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v7-to-v8.md - Learn about migrating from Sentry JavaScript SDK 7.x to 8.x
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v7-to-v8/v8-new-performance-api.md - Learn about new Tracing APIs in Sentry JavaScript SDK 8.x
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v7-to-v8/v8-opentelemetry.md - Learn OpenTelemetry support in SDK 8.x
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v7-to-v8/v7-deprecations.md - Learn about deprecations in Sentry JavaScript SDK 7.x and how to address them
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v6-to-v7.md - Learn about migrating from Sentry JavaScript SDK 6.x to 7.x
- https://docs.sentry.io/platforms/javascript/guides/gcp-functions/migration/v4-to-v5_v6.md - Learn about migrating from Sentry JavaScript SDK 4.x to 5.x/6.x
