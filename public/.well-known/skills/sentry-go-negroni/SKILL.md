---
name: sentry-go-negroni
description: Negroni is an idiomatic approach to web middleware in Go. Learn how to set it up with Sentry.
---

# Sentry Negroni

Negroni is an idiomatic approach to web middleware in Go. Learn how to set it up with Sentry.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/go/guides/negroni.md - Negroni is an idiomatic approach to web middleware in Go. Learn how to set it up with Sentry.

### Features
- https://docs.sentry.io/platforms/go/guides/negroni/usage.md - Use the SDK to capture errors and other events.
- https://docs.sentry.io/platforms/go/guides/negroni/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/instrumentation/custom-instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/instrumentation/custom-instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/instrumentation/opentelemetry.md - Using OpenTelemetry with Sentry Performance.
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/go/guides/negroni/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/go/guides/negroni/logs.md - Structured logs allow you to send, view, and query logs sent from your applications within Sen...
- https://docs.sentry.io/platforms/go/guides/negroni/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/go/guides/negroni/crons.md - Learn how to set up Crons with the Go SDK to monitor the uptime and performance of any schedul...
- https://docs.sentry.io/platforms/go/guides/negroni/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/go/guides/negroni/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.

### Configuration
- https://docs.sentry.io/platforms/go/guides/negroni/configuration.md - Learn more about additional configuration options for the Go SDK.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/transports.md - Transports let you change the way in which events are delivered to Sentry.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/go/guides/negroni/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/go/guides/negroni/integrations.md - Learn about the automatic integrations Sentry provides and how to configure them.
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/go/guides/negroni/data-management.md - Learn more about how to manage your data within your SDK, including how to scrub sensitive inf...
- https://docs.sentry.io/platforms/go/guides/negroni/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/go/guides/negroni/migration.md - Learn more about how to migrate from the deprecated Raven SDK.
- https://docs.sentry.io/platforms/go/guides/negroni/troubleshooting.md - Troubleshooting common Go Issues

### Enriching Events
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/scopes.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/go/guides/negroni/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/go/guides/negroni/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/go/guides/negroni/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Other
- https://docs.sentry.io/platforms/go/guides/negroni/usage/panics.md - Learn more about how our Go SDK captures unhandled panics.
- https://docs.sentry.io/platforms/go/guides/negroni/usage/concurrency.md - Learn more about how to use the SDK from concurrent goroutines.
- https://docs.sentry.io/platforms/go/guides/negroni/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/go/guides/negroni/usage/serverless.md - Learn more about serverless support, which is available out of the box.
- https://docs.sentry.io/platforms/go/guides/negroni/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
