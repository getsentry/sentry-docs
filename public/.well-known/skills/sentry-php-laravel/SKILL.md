---
name: sentry-php-laravel
description: Laravel is a PHP web application framework with expressive, elegant syntax. Learn how to set it up with Sentry.
---

# Sentry Laravel

Laravel is a PHP web application framework with expressive, elegant syntax. Learn how to set it up with Sentry.

## Documentation

Fetch these markdown files as needed:

### Getting Started
- https://docs.sentry.io/platforms/php/guides/laravel.md - Laravel is a PHP web application framework with expressive, elegant syntax. Learn how to set i...

### Features
- https://docs.sentry.io/platforms/php/guides/laravel/profiling.md - Learn more about how to configure our Profiling integration and start profiling your code.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing.md - Learn how to set up and enable tracing in your PHP app and discover valuable performance insig...
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/distributed-tracing.md - Learn how to connect backend and frontend transactions.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/instrumentation.md - Learn how to instrument tracing in your app.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/instrumentation/automatic-instrumentation.md - Learn what instrumentation automatically captures transactions.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/instrumentation/custom-instrumentation.md - Learn how to capture performance data on any action in your app.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/instrumentation/caches-module.md - Learn how to manually instrument your code to use Sentry's Caches module. 
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/instrumentation/requests-module.md - Learn how to manually instrument your code to use Sentry's Requests module.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/instrumentation/queues-module.md - Learn how to manually instrument your code to use Sentry's Queues module. 
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/trace-propagation.md - Learn how to connect events across applications/services.
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/trace-propagation/custom-instrumentation.md
- https://docs.sentry.io/platforms/php/guides/laravel/tracing/trace-propagation/dealing-with-cors-issues.md
- https://docs.sentry.io/platforms/php/guides/laravel/logs.md - Structured logs allow you to send, view and query logs sent from your Laravel applications wit...
- https://docs.sentry.io/platforms/php/guides/laravel/usage.md - Learn more about automatically reporting errors, exceptions, and rejections as well as how to ...
- https://docs.sentry.io/platforms/php/guides/laravel/crons.md - Sentry Crons allows you to monitor the uptime and performance of any scheduled, recurring job ...
- https://docs.sentry.io/platforms/php/guides/laravel/metrics.md - Metrics allow you to send, view and query counters, gauges and measurements sent from your app...
- https://docs.sentry.io/platforms/php/guides/laravel/user-feedback.md - Learn more about collecting user feedback when an event occurs. Sentry pairs the feedback with...
- https://docs.sentry.io/platforms/php/guides/laravel/user-feedback/configuration.md - Learn about the general User Feedback configuration fields.
- https://docs.sentry.io/platforms/php/guides/laravel/feature-flags.md - With Feature Flags, Sentry tracks feature flag evaluations in your application, keeps an audit...

### Configuration
- https://docs.sentry.io/platforms/php/guides/laravel/enriching-events.md - Enrich events with additional context to make debugging simpler.
- https://docs.sentry.io/platforms/php/guides/laravel/enriching-events/identify-user.md - Learn how to configure the SDK to capture the user and gain critical pieces of information tha...
- https://docs.sentry.io/platforms/php/guides/laravel/configuration.md - Additional configuration options for the SDK.
- https://docs.sentry.io/platforms/php/guides/laravel/configuration/laravel-options.md - Learn about Sentry's integration with Laravel and its options for breadcrumbs, and tracing.
- https://docs.sentry.io/platforms/php/guides/laravel/configuration/options.md - Learn more about how the SDK can be configured via options. These are being passed to the init...
- https://docs.sentry.io/platforms/php/guides/laravel/configuration/environments.md - Learn how to configure your SDK to tell Sentry about your environments.
- https://docs.sentry.io/platforms/php/guides/laravel/configuration/releases.md - Learn how to configure your SDK to tell Sentry about your releases.
- https://docs.sentry.io/platforms/php/guides/laravel/configuration/sampling.md - Learn how to configure the volume of error and transaction events sent to Sentry.
- https://docs.sentry.io/platforms/php/guides/laravel/configuration/filtering.md - Learn more about how to configure your SDK to filter events reported to Sentry.
- https://docs.sentry.io/platforms/php/guides/laravel/integrations.md - Learn about the automatic integrations Sentry provides and how to configure them.
- https://docs.sentry.io/platforms/php/guides/laravel/integrations/eloquent.md - Learn how to enable Sentry's Laravel SDK to capture Eloquent model violations.
- https://docs.sentry.io/platforms/php/guides/laravel/troubleshooting.md - Troubleshooting steps for PHP
- https://docs.sentry.io/platforms/php/guides/laravel/data-management.md - Manage your events by pre-filtering, scrubbing sensitive information, and forwarding them to o...
- https://docs.sentry.io/platforms/php/guides/laravel/data-management/data-collected.md - See what data is collected by the Sentry SDK.
- https://docs.sentry.io/platforms/php/guides/laravel/other-versions.md - Learn about using Sentry with Laravel Lumen or Laravel 4.x/5.x/6.x/7.x.
- https://docs.sentry.io/platforms/php/guides/laravel/other-versions/laravel8-10.md - Learn about using Sentry with Laravel 8.x, 9.x and 10.x.
- https://docs.sentry.io/platforms/php/guides/laravel/other-versions/laravel6-7.md - Learn about using Sentry with Laravel 6.x, and 7.x.
- https://docs.sentry.io/platforms/php/guides/laravel/other-versions/laravel5.md - Learn about using Sentry with Laravel 5.x.
- https://docs.sentry.io/platforms/php/guides/laravel/other-versions/laravel4.md - Learn about using Sentry with Laravel 4.x.
- https://docs.sentry.io/platforms/php/guides/laravel/other-versions/lumen.md - Learn about using Sentry with Laravel Lumen.
- https://docs.sentry.io/platforms/php/guides/laravel/security-policy-reporting.md - Learn how Sentry can help manage Content-Security-Policy violations and reports here.

### Enriching Events
- https://docs.sentry.io/platforms/php/guides/laravel/enriching-events/breadcrumbs.md - Learn more about what Sentry uses to create a trail of events (breadcrumbs) that happened prio...
- https://docs.sentry.io/platforms/php/guides/laravel/enriching-events/context.md - Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event.
- https://docs.sentry.io/platforms/php/guides/laravel/enriching-events/tags.md - Tags power UI features such as filters and tag-distribution maps. Tags also help you quickly a...

### Data Management
- https://docs.sentry.io/platforms/php/guides/laravel/data-management/sensitive-data.md - Learn about filtering or scrubbing sensitive data within the SDK, so that data is not sent wit...

### Other
- https://docs.sentry.io/platforms/php/guides/laravel/integrations/monolog.md - Learn how to enable Sentry's PHP SDK to capture Monolog events and logs.
- https://docs.sentry.io/platforms/php/guides/laravel/usage/set-level.md - The level - similar to logging levels - is generally added by default based on the integration...
- https://docs.sentry.io/platforms/php/guides/laravel/usage/sdk-fingerprinting.md - Learn about overriding default fingerprinting in your SDK.
