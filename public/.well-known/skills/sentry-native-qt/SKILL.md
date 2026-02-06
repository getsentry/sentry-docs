---
name: sentry-native-qt
description: Learn how to use Sentry with Qt.
---

# Sentry Qt

Learn how to use Sentry with Qt.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/native/guides/qt.md - Learn how to use Sentry with Qt.

### Features
- https://docs.sentry.io/platforms/native/guides/qt/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/native/guides/qt/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/native/guides/qt/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/native/guides/qt/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/native/guides/qt/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/native/guides/qt/tracing/trace-propagation/dealing-with-cors-issues.md

### Configuration
- https://docs.sentry.io/platforms/native/guides/qt/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/native/guides/qt/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/native/guides/qt/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/native/guides/qt/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/native/guides/qt/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/native/guides/qt/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/native/guides/qt/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/native/guides/qt/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.

### Enriching Events
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/attributes.md - Learn how to construct custom attributes to enrich logs.
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/native/guides/qt/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/native/guides/qt/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/native/guides/qt/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/native/guides/qt/data-management/store-minidumps-as-attachments.md - Learn how to enable storing minidumps as attachments in issue details.
- https://docs.sentry.io/platforms/native/guides/qt/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/native/guides/qt/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/native/guides/qt/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/native/guides/qt/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/native/guides/qt/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/native/guides/qt/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/native/guides/qt/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Other
- https://docs.sentry.io/platforms/native/guides/qt/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/native/guides/qt/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/native/guides/qt/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/native/guides/qt/debug-information.md - Learn about allowing Sentry to fully process native crashes and provide you with symbolicated ...
