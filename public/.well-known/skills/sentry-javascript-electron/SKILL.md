---
name: sentry-javascript-electron
description: Learn how to manually set up Sentry in your Electron app and capture your first errors.
---

# Sentry Electron

Learn how to manually set up Sentry in your Electron app and capture your first errors.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/javascript/guides/electron.md - Learn how to manually set up Sentry in your Electron app and capture your first errors.

### Features
- https://docs.sentry.io/platforms/javascript/guides/electron/usage.md - Learn how to use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps.md - Upload your source maps to Sentry to enable readable stack traces in your errors.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading.md - Learn how to provide your source maps to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/webpack.md - Upload your source maps with our webpack plugin.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/ionic.md - Upload your source maps using Ionic and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/ionic-capacitor.md - Upload your source maps using ionic capacitor and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/typescript.md - Upload your source maps using tsc and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/vite.md - Upload your source maps with the Sentry Vite Plugin.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/esbuild.md - Upload your source maps with the Sentry esbuild Plugin.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/rollup.md - Upload your source maps with the Sentry Rollup Plugin.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/cli.md - Upload your source maps using Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/uglifyjs.md - Upload your source maps using UglifyJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/systemjs.md - Upload your source maps using SystemJS and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/uploading/hosting-publicly.md - Learn about publicly hosting your source maps, including how to address various security conce...
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/troubleshooting_js.md - Troubleshooting for source maps.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/troubleshooting_js/legacy-uploading-methods.md - Learn about how to upload source maps with older SDKs and Sentry tools.
- https://docs.sentry.io/platforms/javascript/guides/electron/sourcemaps/troubleshooting_js/debug-ids.md
- https://docs.sentry.io/platforms/javascript/guides/electron/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/javascript/guides/electron/session-replay.md - Learn how to enable Session Replay in your app if it is not already set up.
- https://docs.sentry.io/platforms/javascript/guides/electron/session-replay/configuration.md - Learn about the general Session Replay configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/electron/session-replay/privacy.md - Configuring Session Replay to maintain user and data privacy.
- https://docs.sentry.io/platforms/javascript/guides/electron/session-replay/issue-types.md - Learn about the Issue types that Session Replay can detect.
- https://docs.sentry.io/platforms/javascript/guides/electron/session-replay/understanding-sessions.md - Learn about customizing sessions with the Session Replay SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/session-replay/troubleshooting.md - Troubleshooting Session Replay-specific Issues
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing.md - Learn how to enable tracing in your app.
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/span-metrics.md - Learn how to add attributes to spans to monitor performance and debug applications 
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/span-metrics/examples.md - Examples of using span metrics to debug performance issues and monitor application behavior ac...
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/distributed-tracing.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/distributed-tracing/custom-instrumentation.md
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/distributed-tracing/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/configure-sampling.md - Learn how to configure sampling in your app.
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/instrumentation.md - Learn how to configure spans to capture trace data on any action in your app.
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/instrumentation/automatic-instrumentation.md - Learn what spans are captured after tracing is enabled.
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/javascript/guides/electron/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/javascript/guides/electron/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/javascript/guides/electron/profiling.md - Collect & view performance insights for JavaScript programs with Sentry's Profiling integratio...
- https://docs.sentry.io/platforms/javascript/guides/electron/user-feedback.md - Learn how to enable User Feedback in your app.
- https://docs.sentry.io/platforms/javascript/guides/electron/user-feedback/configuration.md - Learn about general User Feedback configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/electron/user-feedback/configuration__v7.x.md - Learn about general User Feedback configuration fields for version 7 of the JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/javascript/guides/electron/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events.md - Add additional data to your events to make them easier to debug.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration.md - Learn about additional configuration options for the JavaScript SDKs.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/apis.md - Learn more about APIs of the SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/additionalcontext.md - Adds additional device context to events. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/childprocess.md - Captures breadcrumbs and events for child process exits and crashes. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/electronbreadcrumbs.md - Supports capturing events from `uncaughtException` while retaining Electrons default behaviour...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/electronminidump.md - Captures and sends minidumps via Electrons built in `crashReporter` uploader.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/net.md - Captures breadcrumbs and tracing spans for Electrons `net` module. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/gpucontext.md - Adds GPU device context to events. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/maincontext.md - Adds app, operating system and runtime context to all events. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/mainprocesssession.md - Captures sessions linked to the lifetime of the Electron main process. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/onuncaughtexception.md - Supports capturing events from `uncaughtException` while retaining Electrons default behaviour...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/preloadinjection.md - Injects a preload script via the Electron. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/scopetomain.md - Captures scope updates and breadcrumbs in renderer processes and forwards them to the Electron...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/sentryminidump.md - Captures minidumps and sends them with full context to the Sentry Envelope endpoint using a cu...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/browserwindowsession.md - Captures sessions linked to the focus of Electron BrowserWindows.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/custom.md - Learn how you can enable a custom integration.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/amqplib.md - Adds instrumentation for Amqplib. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/anr.md - Capture events when the event loop is blocked and the application is no longer responding.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/anthropic.md - Adds instrumentation for the Anthropic SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/breadcrumbs.md - Wraps native browser APIs to capture breadcrumbs. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/browserprofiling.md - Capture profiling data for the Browser.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/browsersession.md - Track healthy Sessions in the Browser.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/browsertracing.md - Capture performance data for the Browser.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/captureconsole.md - Captures all Console API calls via `captureException` or `captureMessage`.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/childProcess.md - Adds instrumentation for child processes and worker threads (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/console.md - Capture console logs as breadcrumbs. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/nodecontext.md - Capture context about the environment and the device that the client is running on, and add it...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/contextlines.md - Adds source code from inline JavaScript of the current page's HTML.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/dataloader.md - Adds instrumentation for Dataloader.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/dedupe.md - Deduplicate certain events to avoid receiving duplicate errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/event-loop-block.md - Monitor for blocked event loops in all threads of a Node.js application.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/extraerrordata.md - Extracts all non-native attributes from the error object and attaches them to the event as ext...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/fs.md - Adds instrumentation for filesystem operations.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/functiontostring.md - Allows the SDK to provide original functions and method names, even when those functions or me...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/featureflags.md - Learn how to attach custom feature flag data to Sentry error events.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/genericpool.md - Adds instrumentation for Generic Pool. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/google-genai.md - Adds instrumentation for Google Gen AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/graphql.md - Adds instrumentation for GraphQL. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/graphqlclient.md - Enhance spans and breadcrumbs with data from GraphQL requests.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/http.md - Capture spans & breadcrumbs for http requests. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/httpclient.md - Captures errors on failed requests from Fetch and XHR and attaches request and response inform...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/inboundfilters.md - Allows you to ignore specific errors based on the type, message, or URLs in a given exception....
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/kafka.md - Adds instrumentation for KafkaJS. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/knex.md - Adds instrumentation for Knex.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/langchain.md - Adds instrumentation for LangChain.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/langgraph.md - Adds instrumentation for the LangGraph SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/linkederrors.md - Allows you to configure linked errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/localvariables.md - Add local variables to exception frames. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/lrumemoizer.md - Adds instrumentation for LRU Memoizer. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/modules.md - Add node modules / packages to the event. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/mongo.md - Adds instrumentation for MongoDB. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/mongoose.md - Adds instrumentation for Mongoose. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/mysql.md - Adds instrumentation for MySQL. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/mysql2.md - Adds instrumentation for MySQL2. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/nodefetch.md - Capture spans & breadcrumbs for node fetch requests. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/nodeprofiling.md - Capture profiling data for Node.js applications.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/unhandledrejection.md - Registers handlers to capture global unhandled promise rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/openai.md - Adds instrumentation for the OpenAI SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/pino.md - Capture logs and errors from Pino.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/postgres.md - Adds instrumentation for Postgres. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/redis.md - Adds instrumentation for Redis. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/replay.md - Capture a video-like reproduction of what was happening in the user's browser.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/replaycanvas.md - Capture session replays from HTML canvas elements.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/reportingobserver.md - Captures the reports collected via the `ReportingObserver` interface and sends them to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/rewriteframes.md - Allows you to apply a transformation to each frame of the stack trace.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/supabase.md - Adds instrumentation for Supabase client operations.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/tedious.md - Adds instrumentation for Tedious. (default)
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/trpc.md - Capture spans & errors for tRPC handlers.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/vercelai.md - Adds instrumentation for Vercel AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/webworker.md - Connect Web Workers with the SDK running on the main thread
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/integrations/zodErrors.md - Adds additional data to Zod validation errors.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/filtering.md - Learn more about how to configure your JavaScript SDK to set up filtering for events reported ...
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/event-loop-block.md - Monitor for blocked event loops in Electron applications
- https://docs.sentry.io/platforms/javascript/guides/electron/configuration/tree-shaking.md - Learn how to reduce Sentry bundle size by tree shaking unused code.
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management.md - Learn about different ways to scrub data within your SDK before it gets sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/electron/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/javascript/guides/electron/best-practices.md - Learn how to set up Sentry for several specific use cases with these best practice guides.
- https://docs.sentry.io/platforms/javascript/guides/electron/troubleshooting.md - If you need help solving issues with your Sentry JavaScript SDK integration, you can read the ...

### Enriching Events
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/javascript/guides/electron/enriching-events/transaction-name.md - Learn how to set or override transaction names to improve issue and trace-grouping.

### Data Management
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/javascript/guides/electron/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Best Practices
- https://docs.sentry.io/platforms/javascript/guides/electron/best-practices/shared-environments.md - Learn how to use Sentry in shared environments (for example in browser extensions or VSCode ex...
- https://docs.sentry.io/platforms/javascript/guides/electron/best-practices/micro-frontends.md - Learn how to identify the source of errors and route events to different Sentry projects when ...
- https://docs.sentry.io/platforms/javascript/guides/electron/best-practices/multiple-sentry-instances.md - Learn how to manage several Sentry instances by creating your own clients.
- https://docs.sentry.io/platforms/javascript/guides/electron/best-practices/web-workers.md - Learn how to use Sentry's Browser SDK in Web Workers API.
- https://docs.sentry.io/platforms/javascript/guides/electron/best-practices/sentry-testkit.md - Learn how to assert that the right flow-tracking or error is being sent to Sentry, but without...

### Troubleshooting
- https://docs.sentry.io/platforms/javascript/guides/electron/troubleshooting/supported-browsers.md - We support a variety of browsers; check out our list.

### Other
- https://docs.sentry.io/platforms/javascript/guides/electron/features.md - Learn how Sentry's Electron SDK exposes features for first class integration with Electron.
- https://docs.sentry.io/platforms/javascript/guides/electron/features/inter-process-communication.md - Learn how the Sentry Electron SDK communicates across processes to capture detailed error data.
- https://docs.sentry.io/platforms/javascript/guides/electron/features/native-crash-reporting.md - Learn how Sentry captures and processes native crashes from Electron processes.
- https://docs.sentry.io/platforms/javascript/guides/electron/features/offline-support.md - Learn how to customize the automatic caching of Sentry events while being offline.
