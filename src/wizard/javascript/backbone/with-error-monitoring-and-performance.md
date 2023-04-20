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
  integrations: [new Sentry.BrowserTracing()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
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
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/backbone/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
