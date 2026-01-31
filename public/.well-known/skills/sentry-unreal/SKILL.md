---
name: sentry-unreal
description: Integrate Sentry Unreal Engine SDK for error tracking and performance monitoring.
---

# Sentry Unreal Engine

Documentation for integrating Sentry into Unreal Engine applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/unreal.md

### Features
- https://docs.sentry.io/platforms/unreal/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/unreal/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/unreal/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/unreal/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/unreal/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/unreal/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/unreal/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...

### Configuration
- https://docs.sentry.io/platforms/unreal/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/unreal/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/unreal/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/unreal/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/unreal/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/unreal/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/unreal/configuration/setup-crashreporter.md - Learn about Sentry's Unreal Engine integration with Crash Reporter Client.
- https://docs.sentry.io/platforms/unreal/configuration/debug-symbols.md - Learn how the Unreal Engine SDK handles debug symbols upload.

### Enriching Events
- https://docs.sentry.io/platforms/unreal/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/unreal/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/unreal/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/unreal/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/unreal/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/unreal/enriching-events/screenshots.md - Learn more about how to set up Sentry to take screenshots when an error occurs. The screenshot...
- https://docs.sentry.io/platforms/unreal/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/unreal/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/unreal/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/unreal/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/unreal/data-management/store-minidumps-as-attachments.md - Learn about to store minidumps as attachments for improved processing and download in issue de...
- https://docs.sentry.io/platforms/unreal/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/unreal/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/unreal/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/unreal/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/unreal/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/unreal/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/unreal/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Migration
- https://docs.sentry.io/platforms/unreal/migration.md - Learn more about migrating to the current version.

### Other
- https://docs.sentry.io/platforms/unreal/install.md - All the installation methods for the Unreal Engine SDK.
- https://docs.sentry.io/platforms/unreal/game-consoles.md - Learn how to configure your SDK to capture errors on Xbox, PlayStation and Nintendo Switch.
- https://docs.sentry.io/platforms/unreal/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/unreal/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/unreal/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
