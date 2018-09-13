---
title: JavaScript
sidebar_order: 10
---

All our JavaScript related SDKs provide the same API still there are some differences between them
which this section of the docs explains.

## Integrations

All of our SDKs provide _Integrations_ which can be seen of some kind of plugins. All JavaScript SDKs provide default _Integrations_ please check  details of a specific SDK to see which _Integrations_ they provides.

One thing is the same across all our JavaScript SDKs and that's how you add or remove _Integrations_, e.g.: for `@sentry/browser`.

### Adding an Integration

```javascript
import * as Sentry from '@sentry/browser';

// All integration that come with an SDK can be found in 
// Sentry.Integrations
// Custom integration must conform this interface:
// https://github.com/getsentry/sentry-javascript/blob/1ebeb9edec4b6c7b07a61e0caac426a66eedaf2a/packages/types/src/index.ts#L205

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: (integrations) => {
    integrations.push(new MyCustomIntegration())
    return integrations
  }
  // integrations: [new MyCustomIntegration()]
})
```

### Removing a default Integration

In this example we will remove the by default enabled integration for adding breadcrumbs to the event:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: (integrations) => {
    return integrations.filter(integration => integration.name !== 'Breadcrumbs');
  }
})
```

### Alternative way of setting an Integration

You can also set an array of wanted _Integrations_:
```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new MyCustomIntegration()],
  // integrations: [...Sentry.defaultIntegrations, new MyCustomIntegration()], 
})
```

### Hints

Event and Breadcrumb `hints` are objects containing various information used to put together an event or a breadcrumb. For events, those are things like `event_id`, `originalException`, `syntheticException` (used internally to generate cleaner stacktrace), and any other arbitrary `data` that user attaches. For breadcrumbs it's all implementation dependent. For XHR requests, hint contains xhr object itself, for user interactions it contains DOM element and event name etc.

They are available in two places. `beforeSend`/`beforeBreadcrumb` and `eventProcessors`. Those are two ways we'll allow users to modify what we put together.

Examples based on your `cause` property (I use `message` for ease of reading, but there's nothing stopping you from modifying event stacktrace frames).

`beforeSend`/`beforeBreadcrumb`:

```javascript
import * as Sentry from '@sentry/browser';

init({
  dsn: '___PUBLIC_DSN___',
  beforeSend(event, hint) {
    const processedEvent = { ...event };
    const cause = hint.originalException.cause;

    if (cause) {
      processedEvent.message = cause.message;
    }

    return processedEvent;
  },
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === 'ui.click') {
      const target = hint.event.target;
      if (target.ariaLabel) breadcrumb.message = target.ariaLabel;
    }
    return breadcrumb;
  },
});
```

`eventProcessor`:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.getCurrentHub().configureScope(scope => {
  scope.addEventProcessor(async (event, hint) => {
    const processedEvent = { ...event };
    const cause = hint.originalException.cause;

    if (cause) {
      processedEvent.message = cause.message;
    }

    return processedEvent;
  });
});
```