---
name: sentry-native-minidumps
description: Learn about how Sentry processes Minidump crash reports.
---

# Sentry Minidumps

Learn about how Sentry processes Minidump crash reports.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/native/guides/minidumps.md - Learn about how Sentry processes Minidump crash reports.

### Features
- https://docs.sentry.io/platforms/native/guides/minidumps/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/native/guides/minidumps/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/native/guides/minidumps/tracing/trace-propagation/dealing-with-cors-issues.md

### Configuration
- https://docs.sentry.io/platforms/native/guides/minidumps/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.
- https://docs.sentry.io/platforms/native/guides/minidumps/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/native/guides/minidumps/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/native/guides/minidumps/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/native/guides/minidumps/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/native/guides/minidumps/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/native/guides/minidumps/configuration/draining.md - Learn more about the default behavior of our SDK if the application shuts down unexpectedly.

### Enriching Events
- https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/attributes.md - Learn how to construct custom attributes to enrich logs.
- https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/native/guides/minidumps/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...

### Data Management
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/store-minidumps-as-attachments.md - Learn how to enable storing minidumps as attachments in issue details.
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/debug-files.md - Learn about how debug information files allow Sentry to extract stack traces and provide more ...
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/debug-files/file-formats.md - Learn about platform-specific file formats and the debug information they contain.
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/debug-files/identifiers.md - Learn about build tooling requirements that allow Sentry to uniquely identify debug informatio...
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/debug-files/upload.md - Learn about uploading debug information files to Sentry.
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/debug-files/symbol-servers.md - Learn about symbol servers and how to configure them with your Sentry projects.
- https://docs.sentry.io/platforms/native/guides/minidumps/data-management/debug-files/source-context.md - Learn about setting up source bundles to show source code in stack traces on the Issue Details...

### Other
- https://docs.sentry.io/platforms/native/guides/minidumps/debug-information.md - Learn about allowing Sentry to fully process native crashes and provide you with symbolicated ...
- https://docs.sentry.io/platforms/native/guides/minidumps/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/native/guides/minidumps/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
