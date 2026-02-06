---
name: sentry-unity
description: Integrate Sentry Unity SDK for error tracking and performance monitoring.
---

# Sentry Unity

Documentation for integrating Sentry into Unity applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/unity.md

### Features
- https://docs.sentry.io/platforms/unity/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/unity/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/unity/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/unity/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/unity/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/unity/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/unity/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/unity/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/unity/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/unity/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...

### Configuration
- https://docs.sentry.io/platforms/unity/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/unity/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/unity/configuration/options/programmatic-configuration.md - Learn more about how to configure the Unity SDK programmatically.
- https://docs.sentry.io/platforms/unity/configuration/options/cli-options.md - Learn more about how to configure the options used by Sentry CLI.
- https://docs.sentry.io/platforms/unity/configuration/il2cpp.md - Learn how the SDK provides line numbers to issues from IL2CPP builds.
- https://docs.sentry.io/platforms/unity/configuration/app-not-responding.md - Learn how to turn off or specify ANR.
- https://docs.sentry.io/platforms/unity/configuration/diagnostic-logger.md - Learn more about enabling SDK logging to help troubleshooting.
- https://docs.sentry.io/platforms/unity/configuration/event-debouncing.md - Learn how the SDK handles high frequencies of events.
- https://docs.sentry.io/platforms/unity/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/unity/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/unity/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/unity/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.

### Enriching Events
- https://docs.sentry.io/platforms/unity/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/unity/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/unity/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/unity/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/unity/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/unity/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/unity/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/unity/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/unity/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...
- https://docs.sentry.io/platforms/unity/enriching-events/view-hierarchy.md - Learn more about debugging the view hierarchy when an error occurs. Sentry pairs the view hier...

### Data Management
- https://docs.sentry.io/platforms/unity/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/unity/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/unity/data-management/store-minidumps-as-attachments.md - Learn how to enable storing minidumps as attachments in issue details.
- https://docs.sentry.io/platforms/unity/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/unity/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/unity/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/unity/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/unity/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/unity/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/unity/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Migration
- https://docs.sentry.io/platforms/unity/migration.md - Learn more about migrating to the current version.

### Troubleshooting
- https://docs.sentry.io/platforms/unity/troubleshooting.md - Learn more about how to troubleshoot common issues with the Unity SDK. 
- https://docs.sentry.io/platforms/unity/troubleshooting/known-limitations.md - Learn more about the Unity SDK's known limitations. 

### Other
- https://docs.sentry.io/platforms/unity/game-consoles.md - Learn how to configure your Unity SDK to capture errors on Xbox, PlayStation and Nintendo Switch.
- https://docs.sentry.io/platforms/unity/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/unity/usage/automatic-error-capture.md - Learn more about how the SDK automatically captures errors and sends them to Sentry.
- https://docs.sentry.io/platforms/unity/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/unity/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/unity/native-support.md - Learn how the Unity SDK handles native support.
