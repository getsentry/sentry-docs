---
title: GCP Functions
sidebar_order: 8
---

Install our Sentry SDK as a dependency In the `package.json`:
```jsx
"@sentry/node": "^5.16.1"
```

To set up Sentry error logging for a gcp cloud function, build a wrapper:
```jsx
"use strict"

const Sentry = require("@sentry/node");

sentry.init({
    dsn="https://<key>@<organization>.ingest.sentry.io/<project>"
		});

try {
 notExistFunction();
} catch (e) {
  Sentry.captureException(e);
  Sentry.flush(2000);
}

exports.cloud_handler = (event, context) => {
  return {
    status_code: "200",
    body: "Hello from GCP Cloud Function!",
  };
};
```
You can obtain the DSN using your Sentry account from your organization's *Settings -> Projects -> Client Keys (DSN)* in the Sentry web UI.

Note: You need to call both `CaptureException` and `Flush` to report errors into Sentry.

Checkout Sentry’s [gcp sample apps](https://github.com/getsentry/examples/tree/master/gcp-cloud-functions/node) for detailed examples. For detailed configuration options, use [JavaScript docs](/platforms/javascript/).

