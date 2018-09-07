---
title: JavaScript
sidebar_order: 20
---

All our JavaScript related SDKs provide the same API still there are some differences between them
which this section of the docs explains.

## Integrations

All of our SDKs provide _Integrations_ which can be seen of some kind of plugins. All JavaScript SDKs provide default _Integrations_ please check  details of a specific SDK to see which _Integrations_ they provides.

One thing is the same across all our JavaScript SDKs and that's how you add or remove _Integrations_, e.g.: for `@sentry/browser`.

### Adding a Integration

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