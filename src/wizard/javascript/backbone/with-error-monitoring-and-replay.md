---
name: Backbone
doc_link: https://docs.sentry.io/platforms/javascript/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/browser
# Using npm
npm install --save @sentry/browser
```

## Configure

You should `init` the Sentry SDK as soon as possible during your application:

```javascript
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [new Sentry.Replay()],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/backbone/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Backbone Features](https://docs.sentry.io/platforms/javascript/guides/backbone/features/): Learn about our first class integration with the Backbone framework.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/backbone/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
