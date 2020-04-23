---
title: Node.js
---

{% include learn-sdk.md platform="node" %}

All our JavaScript-related SDKs provide the same API. Still, there are some differences between them which this section of the docs explains.

{% capture __alert_content -%}
AWS's Node runtime doesn't include a global error handler in the same way Node does, so the Node.js SDK has no way of catching unhandled exceptions. The only way to send events to Sentry is to manually use `Sentry.captureException()` or `Sentry.captureMessage()`.
{%- endcapture -%}
{%- include components/alert.html
    title="AWS Lambda"
    content=__alert_content
%}

## Integrations

All of our SDKs provide _Integrations_, similar to a plugin. All JavaScript SDKs provide default _Integrations_; please check details of a specific SDK to see which _Integrations_ it offers.

One thing that is the same across all our JavaScript SDKs --- how you add or remove _Integrations_. (Example: for `@sentry/node`)

### Adding an Integration

```javascript
import * as Sentry from '@sentry/node';
// or using CommonJS
// const Sentry = require('@sentry/node');

// All integrations that come with an SDK can be found on the Sentry.Integrations object
// Custom integrations must conform Integration interface: https://github.com/getsentry/sentry-javascript/blob/master/packages/types/src/index.ts

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyAwesomeIntegration()]
});
```

### Removing an Integration

In this example, we will remove the by default enabled integration for adding breadcrumbs to the event:

```javascript
import * as Sentry from '@sentry/node';
// or using CommonJS
// const Sentry = require('@sentry/node');

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: function(integrations) {
    // integrations will be all default integrations
    return integrations.filter(function(integration) { 
      return integration.name !== 'Console';
    });
  }
});
```

### Alternative way of setting an Integration

```javascript
import * as Sentry from '@sentry/node';
// or using CommonJS
// const Sentry = require('@sentry/node');

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: function(integrations) {
    // integrations will be all default integrations
    return integrations.concat(new MyCustomIntegrations());
  }
});
```

### Adding Integration from @sentry/integrations

All pluggable / optional integrations do live inside `@sentry/integrations`.

```js
import * as Sentry from '@sentry/node';
import { Dedupe as DedupeIntegration } from '@sentry/integrations';
// or using CommonJS
// const Sentry = require('@sentry/node');
// const { Dedupe: DedupeIntegration } = require('@sentry/integrations');

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new DedupeIntegration(),
  ],
});
```

## Hints

Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. For events, those are things like `event_id`, `originalException`, `syntheticException` (used internally to generate a cleaner stack trace), and any other arbitrary `data` that a user attaches. For breadcrumbs, it's all implementation dependent. For XHR requests, hint contains the xhr object itself. For user interactions, it contains the DOM element and event name, etc.

They're available in two places: `beforeSend`/`beforeBreadcrumb` and `eventProcessors`. Those are the two ways we'll allow users to modify what we put together.

### Hints for Events

`originalException`

: The original exception that created the event. This is useful for changing how events are grouped, or to extract additional information.

`syntheticException`

: When a string or a non-error object is raised, Sentry creates a synthetic exception so you can get a basic stack trace. This exception is stored here for further data extraction.

### Hints for Breadcrumbs

`level` / `input`

: For breadcrumbs created from console log interceptions, this holds the original console log level and the original input data to the log function.

`request` / `response` / `event`

: For breadcrumbs created from HTTP requests, this holds the request and response object
(from the node HTTP API) as well as the node event (`response` or `error`).

## EventProcessors

With `eventProcessors` you can hook into the process of enriching the event with additional data. You can add your own `eventProcessor` on the current scope. The difference between `beforeSend` and `eventProcessors` is that `eventProcessors` run on the scope level whereas `beforeSend` runs globally, no matter which scope you're in.
Also, `eventProcessors` optionally receive the hint (see: [Hints](#hints)).

```javascript
// This will be set globally for every succeeding event send
Sentry.configureScope(function(scope) {
  scope.addEventProcessor(function(event, hint) {
    // Add anything to the event here
    // returning null will drop the event
    return event;
  });
});

// Using withScope, will only call the event processor for all "sends"
// that happen within withScope
Sentry.withScope(function(scope) {
  scope.addEventProcessor(function(event, hint) {
    // Add anything to the event here
    // returning null will drop the event
    return event;
  });
  Sentry.captureMessage('Test');
});
```
