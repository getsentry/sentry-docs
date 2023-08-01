---
name: Gatsby
doc_link: https://docs.sentry.io/platforms/javascript/guides/gatsby/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

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
      resolve: "@sentry/gatsby",
    },
  ],
};
```

Then, configure your `Sentry.init`:

```javascript {filename:sentry.config.js}
import * as Sentry from "@sentry/gatsby";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
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

- [Source Maps](https://docs.sentry.io/platforms/javascript/guides/gatsby/sourcemaps/): Learn how to enable readable stack traces in your Sentry errors.
- [Performance Monitoring](https://docs.sentry.io/platforms/javascript/guides/gatsby/performance/): Track down transactions to connect the dots between 10-second page loads and poor-performing API calls or slow database queries.
