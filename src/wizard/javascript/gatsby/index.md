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

Add the Sentry SDK as a dependency using yarn or npm:

```bash
# Using yarn
yarn add @sentry/gatsby

# Using npm
npm install --save @sentry/gatsby
```

## Connecting the SDK to Sentry

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

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
```
