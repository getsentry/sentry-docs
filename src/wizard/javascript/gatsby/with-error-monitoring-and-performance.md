---
name: Gatsby
doc_link: https://docs.sentry.io/platforms/javascript/guides/gatsby/
support_level: production
type: framework
---

## Install

Sentry captures data by using an SDK within your application’s runtime.

```bash
# Using yarn
yarn add @sentry/gatsby

# Using npm
npm install --save @sentry/gatsby
```

## Configure

Register the `@sentry/gatsby` plugin in your Gatsby configuration file (typically `gatsby-config.js`).

```javascript {filename:gatsby-config.js}
module.exports = {
  plugins: [
    {
      resolve: '@sentry/gatsby',
    },
  ],
};
```

Then, configure your `Sentry.init`:

```javascript {filename:sentry.config.js}
import * as Sentry from '@sentry/gatsby';

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

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/gatsby/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Gatsby Features](https://docs.sentry.io/platforms/javascript/guides/gatsby/features/): Learn about our first class integration with the Gatsby framework.
- [Session Replay](https://docs.sentry.io/platforms/javascript/guides/gatsby/session-replay/): Get to the root cause of an error or latency issue faster by seeing all the technical details related to that issue in one visual replay on your web application.
