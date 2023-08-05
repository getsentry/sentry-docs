---
name: Google Cloud Functions (Node)
doc_link: https://docs.sentry.io/platforms/node/guides/gcp-functions/
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

Add `@sentry/serverless` as a dependency to `package.json`:

```javascript
dependencies: {
  //...
  "@sentry/serverless": "^7"
}
```

To set up Sentry for a Google Cloud Function:

### Http Functions

```javascript
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "___PUBLIC_DSN___",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

exports.helloHttp = Sentry.GCPFunction.wrapHttpFunction((req, res) => {
  throw new Error("oh, hello there!");
});
```

### Background Functions

```javascript
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "___PUBLIC_DSN___",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

exports.helloEvents = Sentry.GCPFunction.wrapEventFunction(
  (data, context, callback) => {
    throw new Error("oh, hello there!");
  }
);
```

### CloudEvent Functions

```javascript
const Sentry = require("@sentry/serverless");

Sentry.GCPFunction.init({
  dsn: "___PUBLIC_DSN___",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

exports.helloEvents = Sentry.GCPFunction.wrapCloudEventFunction(
  (context, callback) => {
    throw new Error("oh, hello there!");
  }
);
```
