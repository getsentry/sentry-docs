---
name: sentry-kotlin-kotlin-multiplatform
description: Integrate Sentry Kotlin Multiplatform SDK for error tracking and performance monitoring.
---

# Sentry Kotlin Multiplatform

Documentation for integrating Sentry into Kotlin Multiplatform applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform.md
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/manual-setup.md - Learn how to manually set up the SDK.

### Features
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...

### Configuration
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration/gradle.md - Learn how to set up Sentry's Kotlin Multiplatform Gradle Plugin.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.

### Enriching Events
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/scopes.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/enriching-events/viewhierarchy.md - Learn more about debugging the view hierarchy when an error occurs. Sentry pairs the view hier...

### Data Management
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/data-management/apple-privacy-manifest.md - Troubleshoot and resolve common issues with the Apple Privacy Manifest and Sentry Kotlin Multi...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Troubleshooting
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/troubleshooting.md - Troubleshoot and resolve edge cases when using Sentry's Kotlin Multiplatform SDK.

### Other
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/features.md - Learn about the features of Sentry's Kotlin Multiplatform SDK.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/initialization-strategies.md - Different options for initializing the Kotlin Multiplatform SDK.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/native-access-sdk.md - How to directly access the SDK without the shared module.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/kotlin/guides/kotlin-multiplatform/debug-symbols.md - Learn more about how to upload debug symbols in Sentry Kotlin Multiplatform.
