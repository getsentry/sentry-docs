---
name: Browser JavaScript
doc_link: https://docs.sentry.io/platforms/javascript/
support_level: production
type: language
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

Initialize Sentry as early as possible in your application's lifecycle.

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [new Sentry.BrowserTracing()],

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
});
```

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected.

```javascript
myUndefinedFunction();
```

---

## Next Steps

- [Source Maps](https://docs.sentry.io/platforms/javascript/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Session Replay](https://docs.sentry.io/platforms/javascript/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
