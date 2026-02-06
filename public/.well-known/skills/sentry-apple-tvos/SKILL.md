---
name: sentry-apple-tvos
description: Learn how to use Sentry's Apple SDK to automatically report errors and exceptions in your application.
---

# Sentry tvOS

Learn how to use Sentry's Apple SDK to automatically report errors and exceptions in your application.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/apple/guides/tvos.md - Learn how to use Sentry's Apple SDK to automatically report errors and exceptions in your appl...

### Features
- https://docs.sentry.io/platforms/apple/guides/tvos/features/experimental-features.md - Learn about the experimental features available for Sentry's Apple SDK.
- https://docs.sentry.io/platforms/apple/guides/tvos/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing.md - Learn how to enable tracing in your app and get valuable performance insights about your appli...
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/instrumentation/swiftui-instrumentation.md - Learn how to monitor the performance of your SwiftUI views.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/apple/guides/tvos/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/apple/guides/tvos/session-replay.md - Learn how to enable Session Replay in your mobile app.
- https://docs.sentry.io/platforms/apple/guides/tvos/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/apple/guides/tvos/user-feedback.md - Learn how to enable User Feedback in your Cocoa app.
- https://docs.sentry.io/platforms/apple/guides/tvos/user-feedback/configuration.md - Learn about general User Feedback configuration fields.
- https://docs.sentry.io/platforms/apple/guides/tvos/profiling/troubleshooting.md - Learn how to troubleshoot your profiling setup.

### Configuration
- https://docs.sentry.io/platforms/apple/guides/tvos/sourcecontext.md - Sentry can show you snippets of code around the crash, so you can quickly identify the problem.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/out-of-memory.md - Learn how to turn off Out Of Memory tracking
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/watchdog-terminations.md - Learn how to turn off Watchdog Termination tracking
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/app-hangs.md - Learn about how to add app hang detection reporting.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/swizzling.md - Learn which features use swizzling
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/http-client-errors.md - This feature, once enabled, automatically captures HTTP client errors, like bad response codes...
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/graphql-operation-tracking.md - Enable tracking of GraphQL operation names in HTTP breadcrumbs and failed request events
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/metric-kit.md - This feature, once enabled, subscribes to MXDiagnosticPayload data of MetricKit and it to Sentry.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/shared-environments.md - Learn how to use the Sentry SDK within a shared environment, such as another SDK.
- https://docs.sentry.io/platforms/apple/guides/tvos/configuration/webview.md - Learn how to set up the Sentry Cocoa and Browser SDKs with WebView.
- https://docs.sentry.io/platforms/apple/guides/tvos/dsym.md - Learn more about how to upload debug symbols for iOS.
- https://docs.sentry.io/platforms/apple/guides/tvos/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/apple/guides/tvos/releases.md - Learn about Sentry's release channels for Mobile SDK updates.
- https://docs.sentry.io/platforms/apple/guides/tvos/overhead.md - Learn about Sentry's Apple SDK overhead and how you can tailor your configuration to minimize it.
- https://docs.sentry.io/platforms/apple/guides/tvos/migration.md
- https://docs.sentry.io/platforms/apple/guides/tvos/troubleshooting.md - Troubleshoot and resolve common issues with the Cocoa SDK.

### Enriching Events
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/apple/guides/tvos/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/apple-privacy-manifest.md - Troubleshoot and resolve common issues with the Apple Privacy Manifest and Sentry Cocoa SDK.
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/apple/guides/tvos/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Other
- https://docs.sentry.io/platforms/apple/guides/tvos/features.md - Learn about Sentry's Apple SDK features for tvOS.
- https://docs.sentry.io/platforms/apple/guides/tvos/install.md - All the installation methods for the Apple platform.
- https://docs.sentry.io/platforms/apple/guides/tvos/install/swift-package-manager.md - Integrate Sentry into your Xcode project using Swift Package Manager (SPM).
- https://docs.sentry.io/platforms/apple/guides/tvos/install/cocoapods.md - Learn about installing the Sentry SDK with CocoaPods.
- https://docs.sentry.io/platforms/apple/guides/tvos/install/manual-install.md - Integrate Sentry into your Xcode project by using our pre-compiled frameworks.
- https://docs.sentry.io/platforms/apple/guides/tvos/install/carthage.md - Learn about integrating Sentry into your Xcode project using Carthage.
- https://docs.sentry.io/platforms/apple/guides/tvos/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/apple/guides/tvos/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/apple/guides/tvos/usage/in-app-frames.md - Learn about how your SDK marks frames as in-app.
- https://docs.sentry.io/platforms/apple/guides/tvos/integrations/default.md - Learn more about the SentryCrashIntegration, SentryAutoBreadcrumbTrackingIntegration, SentryAu...
