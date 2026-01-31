---
name: sentry-dart
description: Integrate Sentry Dart SDK for error tracking and performance monitoring.
---

# Sentry Dart

Documentation for integrating Sentry into Dart applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/dart.md

### Features
- https://docs.sentry.io/platforms/dart/tracing.md - Learn how to enable tracing in your app and get valuable performance insights about your appli...
- https://docs.sentry.io/platforms/dart/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/dart/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/dart/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/dart/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/dart/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/dart/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/dart/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/dart/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/dart/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/dart/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/dart/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/dart/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/dart/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/dart/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/dart/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/dart/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.

### Enriching Events
- https://docs.sentry.io/platforms/dart/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/dart/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/dart/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/dart/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/dart/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/dart/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/dart/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/dart/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/dart/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/dart/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/dart/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Migration
- https://docs.sentry.io/platforms/dart/migration.md - Migrate between versions of Sentry's SDK for Dart.

### Other
- https://docs.sentry.io/platforms/dart/features.md - Learn about the features of Sentry's Dart SDK.
- https://docs.sentry.io/platforms/dart/debug-symbols.md
- https://docs.sentry.io/platforms/dart/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/dart/integrations/dio.md - Learn more about the Sentry Dio integration for the Dart SDK.
- https://docs.sentry.io/platforms/dart/integrations/file.md - Learn more about the Sentry file I/O integration for the Dart SDK.
- https://docs.sentry.io/platforms/dart/integrations/http-integration.md - Learn more about the Sentry HTTP integration for the Dart SDK.
- https://docs.sentry.io/platforms/dart/integrations/logging.md - Learn more about the Sentry Logging integration for the Dart SDK.
- https://docs.sentry.io/platforms/dart/integrations/firebase-remote-config.md - Learn more about the Sentry Firebase Remote Config integration for the Dart SDK.
- https://docs.sentry.io/platforms/dart/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/dart/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/dart/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/dart/overhead.md - Learn about Sentry's Dart SDK overhead and how you can tailor your configuration to minimize it.
