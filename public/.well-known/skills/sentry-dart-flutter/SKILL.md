---
name: sentry-dart-flutter
description: Sentry's Flutter SDK enables automatic reporting of errors and performance data in your application.
---

# Sentry Flutter

Sentry's Flutter SDK enables automatic reporting of errors and performance data in your application.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/dart/guides/flutter.md - Sentry's Flutter SDK enables automatic reporting of errors and performance data in your applic...
- https://docs.sentry.io/platforms/dart/guides/flutter/manual-setup.md - Learn how to set up the SDK manually.

### Features
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/dart/guides/flutter/tracing/trace-propagation/limiting-trace-propagation.md
- https://docs.sentry.io/platforms/dart/guides/flutter/profiling.md - Learn how to enable profiling in your app if it is not already set up.
- https://docs.sentry.io/platforms/dart/guides/flutter/profiling/troubleshooting.md - Learn how to troubleshoot your profiling setup.
- https://docs.sentry.io/platforms/dart/guides/flutter/session-replay.md - Learn how to enable Session Replay in your mobile app.
- https://docs.sentry.io/platforms/dart/guides/flutter/session-replay/configuration.md - Learn about the general Session Replay configuration fields.
- https://docs.sentry.io/platforms/dart/guides/flutter/session-replay/privacy.md - Learn about the privacy-oriented settings for Session Replay.
- https://docs.sentry.io/platforms/dart/guides/flutter/session-replay/performance-overhead.md - Learn about how enabling Session Replay impacts the performance of your Flutter app.
- https://docs.sentry.io/platforms/dart/guides/flutter/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/dart/guides/flutter/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/dart/guides/flutter/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/rewriteframes.md - Learn how and why to rewrite stack trace frames in Sentry's flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/chrome-extensions.md - Learn how to set up the Sentry Flutter SDK for Chrome Extensions with Flutter Web.
- https://docs.sentry.io/platforms/dart/guides/flutter/configuration/webview.md - Learn how to set up the Sentry Flutter and Browser SDKs with WebView.

### Enriching Events
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...
- https://docs.sentry.io/platforms/dart/guides/flutter/enriching-events/viewhierarchy.md - Learn more about debugging the view hierarchy when an error occurs. Sentry pairs the view hier...

### Data Management
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/apple-privacy-manifest.md - Troubleshoot and resolve common issues with the Apple Privacy Manifest and Sentry Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/dart/guides/flutter/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Migration
- https://docs.sentry.io/platforms/dart/guides/flutter/migration.md
- https://docs.sentry.io/platforms/dart/guides/flutter/migration.md - Migrate between versions of Sentry's SDK for Dart.

### Troubleshooting
- https://docs.sentry.io/platforms/dart/guides/flutter/troubleshooting.md - Troubleshoot and resolve edge cases regarding known limitations and bundling.

### Other
- https://docs.sentry.io/platforms/dart/guides/flutter/features.md - Learn about the features of Sentry's Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/debug-symbols.md - Learn about uploading debug symbols to enable symbolication of stack traces in your Flutter ap...
- https://docs.sentry.io/platforms/dart/guides/flutter/debug-symbols/dart-plugin.md - Learn how to use the Sentry Dart Plugin to automatically upload debug symbols for your Flutter...
- https://docs.sentry.io/platforms/dart/guides/flutter/debug-symbols/manual-upload.md - Learn how to manually upload debug symbols for your Flutter applications.
- https://docs.sentry.io/platforms/dart/guides/flutter/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/dart/guides/flutter/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/dart/guides/flutter/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/native-init.md - Learn how to manually initialize the native SDKs.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/app-start-instrumentation.md - Learn more about the Sentry App Start Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/asset-bundle-instrumentation.md - Learn more about the Sentry Asset Bundle Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/dio.md - Learn more about the Sentry Dio integration for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/drift-instrumentation.md - Learn more about the Sentry Drift Database Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/file.md - Learn more about the Sentry file I/O integration for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/hive-instrumentation.md - Learn more about the Sentry Hive Database Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/firebase-remote-config.md - Learn more about the Sentry Firebase Remote Config integration for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/http-integration.md - Learn more about the Sentry HTTP integration for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/isar-instrumentation.md - Learn more about the Sentry Isar Database Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/logging.md - Learn more about the Sentry Logging integration for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/routing-instrumentation.md - Learn more about the Sentry Routing Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/slow-and-frozen-frames-instrumentation.md - Learn about slow and frozen frames and frame delay and how to track them using Sentry's Flutte...
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/sqflite-instrumentation.md - Learn more about the Sentry sqflite Database Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/integrations/user-interaction-instrumentation.md - Learn more about the User Interaction Instrumentation for the Flutter SDK.
- https://docs.sentry.io/platforms/dart/guides/flutter/size-analysis.md - Upload Flutter builds to Sentry for size analysis.
- https://docs.sentry.io/platforms/dart/guides/flutter/size-analysis/insights.md - Preview how Size Analysis highlights Flutter build trends.
- https://docs.sentry.io/platforms/dart/guides/flutter/build-distribution.md - Upload Flutter builds to Sentry for distribution to internal teams and beta testers.
- https://docs.sentry.io/platforms/dart/guides/flutter/releases.md - Learn about Sentry's release channels for Mobile SDK updates.
- https://docs.sentry.io/platforms/dart/guides/flutter/overhead.md - Learn about Sentry's Flutter SDK overhead and how you can tailor your configuration to minimiz...
