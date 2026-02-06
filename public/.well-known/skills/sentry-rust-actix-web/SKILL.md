---
name: sentry-rust-actix-web
description: Learn about monitoring your Actix Web application with Sentry.
---

# Sentry Actix Web

Learn about monitoring your Actix Web application with Sentry.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/rust/guides/actix-web.md - Learn about monitoring your Actix Web application with Sentry.

### Features
- https://docs.sentry.io/platforms/rust/guides/actix-web/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing/instrumentation/automatic-instrumentation.md - Learn what instrumentation automatically captures transactions.
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/rust/guides/actix-web/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/rust/guides/actix-web/logs.md - Structured logs allow you to send, view, and query logs sent from your applications within Sen...
- https://docs.sentry.io/platforms/rust/guides/actix-web/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/rust/guides/actix-web/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.

### Configuration
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/rust/guides/actix-web/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/rust/guides/actix-web/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/rust/guides/actix-web/source-context.md - Learn about showing your source code as part of stack traces.
- https://docs.sentry.io/platforms/rust/guides/actix-web/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/rust/guides/actix-web/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/rust/guides/actix-web/troubleshooting.md - If you need help solving issues with the Sentry Rust SDK, you can read the edge cases document...

### Enriching Events
- https://docs.sentry.io/platforms/rust/guides/actix-web/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/rust/guides/actix-web/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/rust/guides/actix-web/enriching-events/scopes.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/rust/guides/actix-web/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/rust/guides/actix-web/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/rust/guides/actix-web/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/rust/guides/actix-web/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Other
- https://docs.sentry.io/platforms/rust/guides/actix-web/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
