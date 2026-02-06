---
name: sentry-java-log4j2
description: Integrate Sentry Log4j 2.x SDK for error tracking and performance monitoring.
---

# Sentry Log4j 2.x

Documentation for integrating Sentry into Log4j 2.x applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/java/guides/log4j2.md

### Features
- https://docs.sentry.io/platforms/java/guides/log4j2/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/java/guides/log4j2/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/instrumentation/custom-instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/instrumentation/custom-instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/instrumentation/opentelemetry.md - Using OpenTelemetry with Sentry Performance.
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/java/guides/log4j2/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/java/guides/log4j2/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements from your Sentry-c...
- https://docs.sentry.io/platforms/java/guides/log4j2/profiling.md - Learn how to enable profiling in your app if it is not already set up.
- https://docs.sentry.io/platforms/java/guides/log4j2/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/java/guides/log4j2/crons/troubleshooting.md - Learn how to troubleshoot your Cron Monitoring setup.
- https://docs.sentry.io/platforms/java/guides/log4j2/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/java/guides/log4j2/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...
- https://docs.sentry.io/platforms/java/guides/log4j2/gradle.md - Learn about using the Sentry Gradle Plugin.
- https://docs.sentry.io/platforms/java/guides/log4j2/maven.md - Learn about using the Sentry Maven Plugin.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry.md - Using OpenTelemetry with Sentry.

### Configuration
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration.md - Learn more about how to configure the SDK. These options are set when the SDK is first initial...
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/java/guides/log4j2/configuration/bill-of-materials.md
- https://docs.sentry.io/platforms/java/guides/log4j2/integrations.md - Learn more about how integrations extend the functionality of our SDK to cover common librarie...
- https://docs.sentry.io/platforms/java/guides/log4j2/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/java/guides/log4j2/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/java/guides/log4j2/advanced_usage.md - Learn about ThreadContext parameters that display in sentry.io.
- https://docs.sentry.io/platforms/java/guides/log4j2/source-context.md - Learn about showing your source code as part of stack traces.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry/setup.md - Setting up Sentry with OpenTelemetry.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry/setup/agent.md - Using OpenTelemetry with sentry-opentelemetry-agent.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry/setup/agent/auto-init.md - Using OpenTelemetry with sentry-opentelemetry-agent and AUTO_INIT enabled.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry/setup/agent/no-auto-init.md - Using OpenTelemetry with sentry-opentelemetry-agent and AUTO_INIT disabled.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry/setup/agentless.md - Using OpenTelemetry with  sentry-opentelemetry-agentless.
- https://docs.sentry.io/platforms/java/guides/log4j2/opentelemetry/usage.md - Using OpenTelemetry with Sentry.
- https://docs.sentry.io/platforms/java/guides/log4j2/migration.md - Learn about migrating to a newer version of the Java SDK.
- https://docs.sentry.io/platforms/java/guides/log4j2/troubleshooting.md - Troubleshoot and resolve common issues with the Java SDK.
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy.md

### Enriching Events
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/scopes.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/scopes__v7.x.md - The SDK will in most cases automatically manage the scopes for you in the framework integratio...
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/java/guides/log4j2/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/java/guides/log4j2/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/java/guides/log4j2/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Migration
- https://docs.sentry.io/platforms/java/guides/log4j2/migration/7.x-to-8.0.md - Learn about migrating from version 7.x to 8.0.0
- https://docs.sentry.io/platforms/java/guides/log4j2/migration/6.x-to-7.0.md - Learn about migrating from version 6.x to 7.0.0
- https://docs.sentry.io/platforms/java/guides/log4j2/migration/5.x-to-6.0.md - Learn about migrating from version 5.x to 6.0.0
- https://docs.sentry.io/platforms/java/guides/log4j2/migration/4.3-to-5.0.md - Learn about migrating from version 4.3.0 to 5.0.0
- https://docs.sentry.io/platforms/java/guides/log4j2/migration/4.1-to-4.2.md - Learn about migrating from version 4.1.0 to 4.2.0
- https://docs.sentry.io/platforms/java/guides/log4j2/migration/1.x-to-4.x.md - Learn about migrating from version 1.x to 4.x

### Troubleshooting
- https://docs.sentry.io/platforms/java/guides/log4j2/troubleshooting/mixed-versions.md - Troubleshoot and resolve mixed Java SDK dependency versions.
- https://docs.sentry.io/platforms/java/guides/log4j2/troubleshooting/sentry-cli-execution-failure.md - Troubleshoot and resolve Sentry CLI execution failures when using the Sentry Maven plugin.

### Other
- https://docs.sentry.io/platforms/java/guides/log4j2/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/java/guides/log4j2/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
- https://docs.sentry.io/platforms/java/guides/log4j2/integrations/launchdarkly.md - Learn how to use Sentry with LaunchDarkly in your Java app.
- https://docs.sentry.io/platforms/java/guides/log4j2/integrations/openfeature.md - Learn how to use Sentry with OpenFeature.
- https://docs.sentry.io/platforms/java/guides/log4j2/integrations/quartz.md - Learn how to send check-ins for your Quartz jobs.
- https://docs.sentry.io/platforms/java/guides/log4j2/integrations/reactor.md - Learn how to capture errors, breadcrumbs and traces for your reactive applications.
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/configuration.md - Learn more about how to configure the SDK. These options are set when the SDK is first initial...
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/usage.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/google-app-engine.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/logging.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/log4j.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/log4j2.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/logback.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/spring.md
- https://docs.sentry.io/platforms/java/guides/log4j2/legacy/migration.md
