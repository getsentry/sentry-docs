---
name: sentry-php
description: Learn how to set up Sentry in your PHP application.
---

# Sentry PHP

Learn how to set up Sentry in your PHP application.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/php.md - Learn how to set up Sentry in your PHP application.

### Features
- https://docs.sentry.io/platforms/php/tracing.md - Learn how to set up and enable tracing in your PHP app and discover valuable performance insig...
- https://docs.sentry.io/platforms/php/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/php/tracing/instrumentation/automatic-instrumentation.md - Learn what instrumentation automatically captures transactions.
- https://docs.sentry.io/platforms/php/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/php/tracing/instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/php/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/php/tracing/instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/php/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/php/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/php/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/php/profiling.md - Learn more about how to configure our Profiling integration and start profiling your code.
- https://docs.sentry.io/platforms/php/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/php/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/php/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements sent from your app...
- https://docs.sentry.io/platforms/php/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/php/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.
- https://docs.sentry.io/platforms/php/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...
- https://docs.sentry.io/platforms/php/usage.md - Use the SDK to manually capture errors and other events.

### Configuration
- https://docs.sentry.io/platforms/php/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/php/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/php/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/php/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/php/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/php/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/php/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/php/integrations.md - Learn about the automatic integrations Sentry provides and how to configure them.
- https://docs.sentry.io/platforms/php/troubleshooting.md - Troubleshooting steps for PHP
- https://docs.sentry.io/platforms/php/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/php/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.

### Enriching Events
- https://docs.sentry.io/platforms/php/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/php/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/php/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/php/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/php/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/php/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Other
- https://docs.sentry.io/platforms/php/integrations/monolog.md - Learn how to enable Sentry's PHP SDK to capture Monolog events and logs.
- https://docs.sentry.io/platforms/php/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/php/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/php/legacy-sdk.md
- https://docs.sentry.io/platforms/php/legacy-sdk/usage.md
- https://docs.sentry.io/platforms/php/legacy-sdk/config.md
- https://docs.sentry.io/platforms/php/legacy-sdk/integrations.md
