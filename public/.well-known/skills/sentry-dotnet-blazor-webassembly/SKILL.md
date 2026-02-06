---
name: sentry-dotnet-blazor-webassembly
description: Learn about Sentry's .NET integration with Blazor WebAssembly.
---

# Sentry Blazor WebAssembly

Learn about Sentry's .NET integration with Blazor WebAssembly.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly.md - Learn about Sentry's .NET integration with Blazor WebAssembly.

### Features
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing.md - Learn how to enable tracing in your app and discover valuable performance insights of your app...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/automatic-instrumentation.md - Learn what transactions are captured after tracing is enabled.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/custom-instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/custom-instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/opentelemetry.md - Using OpenTelemetry with Sentry Performance.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/performance-metrics.md - Learn how to attach performance metrics to your transactions.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/instrumentation/ai-agents-module.md - Learn how to instrument your code to use Sentry's AI Agents module with Microsoft.Extensions.AI.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/tracing/troubleshooting.md - Learn how to troubleshoot your tracing setup.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/crons/hangfire.md - Learn more about how to monitor your Hangfire jobs.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.

### Configuration
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/msbuild.md - Configure MSBuild properties in your .NET project to automatically use the Sentry CLI.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/diagnostic-logger.md - Learn more about enabling SDK logging to help troubleshooting.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/heap-dumps.md - This experimental feature allows you to automatically capture heap dumps for your application.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/http-client-errors.md - This feature, once enabled, automatically captures HTTP client errors, like bad response codes...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/graphql-client-errors.md - This feature captures graphql-client errors and reports them to Sentry
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/configuration/disable-integrations.md - Learn more about the methods that disable integrations.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/migration.md - Migrating between versions of Sentry SDK for .NET.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/troubleshooting.md - Learn more about how to troubleshoot common issues with the .NET SDK. 
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/unit-testing.md - Learn about unit testing with `ISentryClient` and `IHub`.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/legacy-sdk.md - Read the legacy documentation for the .NET SDK. 

### Enriching Events
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/event-processors.md - Learn how event processors can enrich events globally or in the current scope.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/scopes.md - SDKs will typically automatically manage the scopes for you in the framework integrations. Lea...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/transaction-name.md - Learn how to set or override the transaction name to capture the user and gain critical pieces...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Other
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/dotnet/guides/blazor-webassembly/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
