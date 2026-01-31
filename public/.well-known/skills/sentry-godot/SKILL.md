---
name: sentry-godot
description: Integrate Sentry Godot Engine SDK for error tracking and performance monitoring.
---

# Sentry Godot Engine

Documentation for integrating Sentry into Godot Engine applications.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/godot.md

### Features
- https://docs.sentry.io/platforms/godot/logs.md - Structured logs allow you to send, view and query logs sent from your applications within Sentry.
- https://docs.sentry.io/platforms/godot/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...

### Configuration
- https://docs.sentry.io/platforms/godot/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/godot/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/godot/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/godot/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/godot/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/godot/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/godot/configuration/android.md - Learn how to set up Android Godot export with Sentry integration
- https://docs.sentry.io/platforms/godot/configuration/stack-traces.md - Learn how to get traces with line numbers and file paths in Sentry with SDK for Godot Engine.

### Enriching Events
- https://docs.sentry.io/platforms/godot/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/godot/enriching-events/attachments.md - Learn more about how Sentry can store additional files in the same request as event attachments.
- https://docs.sentry.io/platforms/godot/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/godot/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/godot/enriching-events/view-hierarchy.md - Learn more about capturing scene tree data during errors and crashes. Sentry provides a visual...
- https://docs.sentry.io/platforms/godot/enriching-events/screenshots.md - Learn more about taking screenshots when an error occurs. Sentry pairs the screenshot with the...
- https://docs.sentry.io/platforms/godot/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...
- https://docs.sentry.io/platforms/godot/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...

### Data Management
- https://docs.sentry.io/platforms/godot/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/godot/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/godot/data-management/store-minidumps-as-attachments.md - Learn how to enable storing minidumps as attachments in issue details.
- https://docs.sentry.io/platforms/godot/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Migration
- https://docs.sentry.io/platforms/godot/migration.md - Learn more about migrating to the current version.

### Other
- https://docs.sentry.io/platforms/godot/usage.md - Use the SDK to manually capture errors and other events.
- https://docs.sentry.io/platforms/godot/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
