---
name: Browser JavaScript
doc_link: https://docs.sentry.io/platforms/javascript/
support_level: production
type: language
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

Install our JavaScript browser SDK using either `yarn` or `npm`:

```bash
# Using yarn
yarn add @sentry/browser
# Using npm
npm install --save @sentry/browser
```

We also support alternate [installation methods](/platforms/javascript/install/).

`init` the Sentry Browser SDK as soon as possible during your page load:

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [new Sentry.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
});
```

We recommend adjusting the value of `tracesSampleRate` in production. Learn more about configuring sampling in our [full documentation](https://docs.sentry.io/platforms/javascript/configuration/sampling/).

Then create an intentional error, so you can test that everything is working:

```javascript
myUndefinedFunction();
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
