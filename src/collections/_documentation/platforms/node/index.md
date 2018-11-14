---
title: Node.js
sidebar_order: 2
---

{% include learn-sdk.md platform="node" %}

All our JavaScript related SDKs provide the same API still there are some differences between them which this section of the docs explains.

## Integrations

All of our SDKs provide _Integrations_ which can be seen of some kind of plugins. All JavaScript SDKs provide default _Integrations_ please check details of a specific SDK to see which _Integrations_ they provides.

One thing is the same across all our JavaScript SDKs and that's how you add or remove _Integrations_, e.g.: for `@sentry/node`.

### Adding an Integration

```javascript
import * as Sentry from '@sentry/node';

// All integration that come with an SDK can be found on Sentry.Integrations object
// Custom integration must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/index.ts

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```

### Removing an Integration

In this example we will remove the by default enabled integration for adding breadcrumbs to the event:

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: integrations => {
    // integrations will be all default integrations
    return integrations.filter(integration => integration.name !== 'Console');
  }
});
```

### Alternative way of setting an Integration

```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: integrations => {
    // integrations will be all default integrations
    return [...integrations, new MyCustomIntegration()];
  }
});
```

## Hints

Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. For events, those are things like `event_id`, `originalException`, `syntheticException` (used internally to generate cleaner stacktrace), and any other arbitrary `data` that user attaches. For breadcrumbs it's all implementation dependent. For XHR requests, hint contains xhr object itself, for user interactions it contains DOM element and event name etc.

They are available in two places. `beforeSend`/`beforeBreadcrumb` and `eventProcessors`. Those are two ways we'll allow users to modify what we put together.

These common hints currently exist for events:

`originalException`

: The original exception that caused the event to be created. This is useful for changing how events
are grouped or to extract additional information.

`syntheticException`

: When a string or a non error object is raised, Sentry creates a synthetic exception so you can get a
basic stacktrace. This exception is stored here for further data extraction.

And these exist for breadcrumbs:

`level` / `input`

: For breadcrumbs created from console log interceptions this holds the original console log level and the
original input data to the log function.

`request` / `response` / `event`

: For breadcrumbs created from HTTP requests this holds the request and response object
(from the node HTTP API) as well as the node event (`response` or `error`).

## EventProcessors

With `eventProcessors` you are able to hook into the process of enriching the event with additional data.
You can add you own `eventProcessor` on the current scope. The difference to `beforeSend` is that
`eventProcessors` run on the scope level where `beforeSend` runs globally not matter in which scope you are.
`eventProcessors` also optionally receive the hint see: [Hints](#hints).

```javascript
// This will be set globally for every succeeding event send
Sentry.configureScope(scope => {
  scope.addEventProcessor(async (event, hint) => {
    // Add anything to the event here
    // returning null will drop the event
    return event;
  });
});

// Using withScope, will only call the event processor for all "sends"
// that happen within withScope
Sentry.withScope(scope => {
  scope.addEventProcessor(async (event, hint) => {
    // Add anything to the event here
    // returning null will drop the event
    return event;
  });
  Sentry.captureMessage('Test');
});
```
