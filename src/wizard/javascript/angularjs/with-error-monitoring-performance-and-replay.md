---
name: AngularJS
doc_link: https://docs.sentry.io/platforms/javascript/guides/angular/angular1/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/browser @sentry/integrations

# Using npm
npm install --save @sentry/browser @sentry/integrations
```

## Configure

Initialize Sentry as early as possible in your application's lifecycle.

```javascript
import angular from 'angular';
import * as Sentry from '@sentry/browser';
import {Angular as AngularIntegration} from '@sentry/integrations';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new AngularIntegration(),
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', 'https://yourserver.io/api'],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Finally require ngSentry as a dependency in your application module.
angular.module('yourApplicationModule', ['ngSentry']);
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/angular/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [AngularJS Features](https://docs.sentry.io/platforms/javascript/guides/angular/angular1/): Learn about our first class integration with the AngularJS framework.
