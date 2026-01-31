---
name: sentry-ruby-resque
description: Integrate Sentry Resque SDK for error tracking and performance monitoring.
---

# Sentry Resque

Documentation for integrating Sentry into Resque applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/ruby/guides/resque.md

### Features
- https://docs.sentry.io/platforms/ruby/guides/resque/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/automatic-instrumentation.md - Learn what instrumentation automatically captures transactions.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/custom-instrumentation/ai-agents-module.md - Learn how to manually instrument your code to use Sentry's Agents module.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/custom-instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/custom-instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/custom-instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/opentelemetry.md - Using OpenTelemetry with Sentry Performance.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/ruby/guides/resque/tracing/trace-propagation/limiting-trace-propagation.md
- https://docs.sentry.io/platforms/ruby/guides/resque/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements sent from your app...
- https://docs.sentry.io/platforms/ruby/guides/resque/profiling.md - Learn how to enable profiling in your app if it is not already set up.
- https://docs.sentry.io/platforms/ruby/guides/resque/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/ruby/guides/resque/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/ruby/guides/resque/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.

### Configuration
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration.md - Learn about additional configuration options for the Ruby SDK.
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/ruby/guides/resque/configuration/integration_options.md - Learn about configuring integrations.
- https://docs.sentry.io/platforms/ruby/guides/resque/integrations.md - Sentry provides additional integrations designed to change configuration or add instrumentatio...
- https://docs.sentry.io/platforms/ruby/guides/resque/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/ruby/guides/resque/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/ruby/guides/resque/migration.md - Learn about how to migrate from the deprecated sentry-raven SDK.
- https://docs.sentry.io/platforms/ruby/guides/resque/troubleshooting.md - Learn how to troubleshoot your SDK setup.

### Enriching Events
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/event-processors.md - Learn more about how you can add your own event processors globally or to the current scope.
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/scopes.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/ruby/guides/resque/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/ruby/guides/resque/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/ruby/guides/resque/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Other
- https://docs.sentry.io/platforms/ruby/guides/resque/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/ruby/guides/resque/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
