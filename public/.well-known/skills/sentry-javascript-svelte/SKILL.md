---
name: sentry-javascript-svelte
description: Learn how to manually set up Sentry in your Svelte app and capture your first errors.
---

# Sentry Svelte

Learn how to manually set up Sentry in your Svelte app and capture your first errors.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/javascript/guides/svelte.md - Learn how to manually set up Sentry in your Svelte app and capture your first errors.

### Features
- https://docs.sentry.io/platforms/javascript/guides/svelte/usage.md - Learn how to use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps.md - Upload your source maps to Sentry to enable readable stack traces in your errors.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading.md - Learn how to provide your source maps to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/webpack.md - Upload your source maps with our webpack plugin.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/ionic-capacitor.md - Upload your source maps using ionic capacitor and Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/vite.md - Upload your source maps with the Sentry Vite Plugin.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/esbuild.md - Upload your source maps with the Sentry esbuild Plugin.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/rollup.md - Upload your source maps with the Sentry Rollup Plugin.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/cli.md - Upload your source maps using Sentry CLI.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/uploading/hosting-publicly.md - Learn about publicly hosting your source maps, including how to address various security conce...
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/troubleshooting_js.md - Troubleshooting for source maps.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/troubleshooting_js/legacy-uploading-methods.md - Learn about how to upload source maps with older SDKs and Sentry tools.
- https://docs.sentry.io/platforms/javascript/guides/svelte/sourcemaps/troubleshooting_js/debug-ids.md
- https://docs.sentry.io/platforms/javascript/guides/svelte/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/javascript/guides/svelte/session-replay.md - Learn how to enable Session Replay in your app if it is not already set up.
- https://docs.sentry.io/platforms/javascript/guides/svelte/session-replay/configuration.md - Learn about the general Session Replay configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/svelte/session-replay/privacy.md - Configuring Session Replay to maintain user and data privacy.
- https://docs.sentry.io/platforms/javascript/guides/svelte/session-replay/issue-types.md - Learn about the Issue types that Session Replay can detect.
- https://docs.sentry.io/platforms/javascript/guides/svelte/session-replay/understanding-sessions.md - Learn about customizing sessions with the Session Replay SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/session-replay/troubleshooting.md - Troubleshooting Session Replay-specific Issues
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing.md - Learn how to enable tracing in your app.
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/span-metrics.md - Learn how to add attributes to spans to monitor performance and debug applications 
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/span-metrics/examples.md - Examples of using span metrics to debug performance issues and monitor application behavior ac...
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/distributed-tracing.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/distributed-tracing/custom-instrumentation.md
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/distributed-tracing/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/configure-sampling.md - Learn how to configure sampling in your app.
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/instrumentation.md - Learn how to configure spans to capture trace data on any action in your app.
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/instrumentation/automatic-instrumentation.md - Learn what spans are captured after tracing is enabled.
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/javascript/guides/svelte/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/javascript/guides/svelte/ai-agent-monitoring-browser.md - Learn how to manually instrument AI agents in browser applications.
- https://docs.sentry.io/platforms/javascript/guides/svelte/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/javascript/guides/svelte/profiling.md - Collect & view performance insights for JavaScript programs with Sentry's Profiling integratio...
- https://docs.sentry.io/platforms/javascript/guides/svelte/user-feedback.md - Learn how to enable User Feedback in your app.
- https://docs.sentry.io/platforms/javascript/guides/svelte/user-feedback/configuration.md - Learn about general User Feedback configuration fields.
- https://docs.sentry.io/platforms/javascript/guides/svelte/user-feedback/configuration__v7.x.md - Learn about general User Feedback configuration fields for version 7 of the JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/javascript/guides/svelte/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events.md - Add additional data to your events to make them easier to debug.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration.md - Learn about additional configuration options for the JavaScript SDKs.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/apis.md - Learn more about APIs of the SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/custom.md - Learn how you can enable a custom integration.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/anthropic.md - Adds instrumentation for the Anthropic SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/breadcrumbs.md - Wraps native browser APIs to capture breadcrumbs. (default)
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/browserapierrors.md - Wraps native time and events APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`, `addE...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/browserprofiling.md - Capture profiling data for the Browser.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/browsersession.md - Track healthy Sessions in the Browser.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/browsertracing.md - Capture performance data for the Browser.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/captureconsole.md - Captures all Console API calls via `captureException` or `captureMessage`.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/contextlines.md - Adds source code from inline JavaScript of the current page's HTML.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/dedupe.md - Deduplicate certain events to avoid receiving duplicate errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/extraerrordata.md - Extracts all non-native attributes from the error object and attaches them to the event as ext...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/functiontostring.md - Allows the SDK to provide original functions and method names, even when those functions or me...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/featureflags.md - Learn how to attach custom feature flag data to Sentry error events.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/globalhandlers.md - Attaches global handlers to capture uncaught exceptions and unhandled rejections. (default)
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/google-genai.md - Adds instrumentation for Google Gen AI SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/graphqlclient.md - Enhance spans and breadcrumbs with data from GraphQL requests.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/httpclient.md - Captures errors on failed requests from Fetch and XHR and attaches request and response inform...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/httpcontext.md - Attaches HTTP request information, such as URL, user-agent, referrer, and other headers to the...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/inboundfilters.md - Allows you to ignore specific errors based on the type, message, or URLs in a given exception....
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/langchain.md - Adds instrumentation for LangChain.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/langgraph.md - Adds instrumentation for the LangGraph SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/launchdarkly.md - Learn how to use Sentry with LaunchDarkly.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/linkederrors.md - Allows you to configure linked errors. (default)
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/modulemetadata.md - Adds module metadata to stack frames.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/openai.md - Adds instrumentation for the OpenAI SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/openfeature.md - Learn how to use Sentry with OpenFeature.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/replay.md - Capture a video-like reproduction of what was happening in the user's browser.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/replaycanvas.md - Capture session replays from HTML canvas elements.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/reportingobserver.md - Captures the reports collected via the `ReportingObserver` interface and sends them to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/rewriteframes.md - Allows you to apply a transformation to each frame of the stack trace.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/statsig.md - Learn how to use Sentry with Statsig.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/unleash.md - Learn how to use Sentry with Unleash.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/webworker.md - Connect Web Workers with the SDK running on the main thread
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/integrations/zodErrors.md - Adds additional data to Zod validation errors.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/transports.md - Transports let you change the way in which events are delivered to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/filtering.md - Learn more about how to configure your JavaScript SDK to set up filtering for events reported ...
- https://docs.sentry.io/platforms/javascript/guides/svelte/configuration/tree-shaking.md - Learn how to reduce Sentry bundle size by tree shaking unused code.
- https://docs.sentry.io/platforms/javascript/guides/svelte/data-management.md - Learn about different ways to scrub data within your SDK before it gets sent to Sentry.
- https://docs.sentry.io/platforms/javascript/guides/svelte/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices.md - Learn how to set up Sentry for several specific use cases with these best practice guides.
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration.md - Migrate from an older version of our Sentry JavaScript SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/troubleshooting.md - If you need help solving issues with your Sentry JavaScript SDK integration, you can read the ...

### Enriching Events
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/javascript/guides/svelte/enriching-events/transaction-name.md - Learn how to set or override transaction names to improve issue and trace-grouping.

### Data Management
- https://docs.sentry.io/platforms/javascript/guides/svelte/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/javascript/guides/svelte/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Best Practices
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices/shared-environments.md - Learn how to use Sentry in shared environments (for example in browser extensions or VSCode ex...
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices/micro-frontends.md - Learn how to identify the source of errors and route events to different Sentry projects when ...
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices/multiple-sentry-instances.md - Learn how to manage several Sentry instances by creating your own clients.
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices/offline-caching.md - Learn how to cache Sentry events while being offline.
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices/web-workers.md - Learn how to use Sentry's Browser SDK in Web Workers API.
- https://docs.sentry.io/platforms/javascript/guides/svelte/best-practices/sentry-testkit.md - Learn how to assert that the right flow-tracking or error is being sent to Sentry, but without...

### Migration
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v9-to-v10.md - Learn about migrating from Sentry JavaScript SDK 9.x to 10.x
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v8-to-v9.md - Learn about migrating from Sentry JavaScript SDK 8.x to 9.x
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v7-to-v8.md - Learn about migrating from Sentry JavaScript SDK 7.x to 8.x
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v7-to-v8/v8-new-performance-api.md - Learn about new Tracing APIs in Sentry JavaScript SDK 8.x
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v7-to-v8/v7-deprecations.md - Learn about deprecations in Sentry JavaScript SDK 7.x and how to address them
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v6-to-v7.md - Learn about migrating from Sentry JavaScript SDK 6.x to 7.x
- https://docs.sentry.io/platforms/javascript/guides/svelte/migration/v4-to-v5_v6.md - Learn about migrating from Sentry JavaScript SDK 4.x to 5.x/6.x

### Troubleshooting
- https://docs.sentry.io/platforms/javascript/guides/svelte/troubleshooting/supported-browsers.md - We support a variety of browsers; check out our list.

### Other
- https://docs.sentry.io/platforms/javascript/guides/svelte/features.md - Learn how Sentry's Svelte SDK exposes features for first class integration with Svelte.
- https://docs.sentry.io/platforms/javascript/guides/svelte/features/component-tracking.md - Learn how Sentry's Svelte SDK allows you to monitor the rendering performance of your applicat...
