---
name: sentry-powershell
description: Integrate Sentry PowerShell SDK for error tracking and performance monitoring.
---

# Sentry PowerShell

Documentation for integrating Sentry into PowerShell applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/powershell.md

### Features
- https://docs.sentry.io/platforms/powershell/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/powershell/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/powershell/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/powershell/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/powershell/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.

### Configuration
- https://docs.sentry.io/platforms/powershell/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/powershell/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/powershell/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/powershell/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/powershell/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/powershell/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/powershell/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.

### Enriching Events
- https://docs.sentry.io/platforms/powershell/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/powershell/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/powershell/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/powershell/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/powershell/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/powershell/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/powershell/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/powershell/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/powershell/data-management/data-collected.md - See what data is collected by the Sentry SDK for PowerShell.
- https://docs.sentry.io/platforms/powershell/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Troubleshooting
- https://docs.sentry.io/platforms/powershell/troubleshooting.md - Learn more about how to troubleshoot common issues. 

### Other
- https://docs.sentry.io/platforms/powershell/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/powershell/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
