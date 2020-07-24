---
title: Azure Functions
sidebar_order: 9
---

Install our Node.js SDK using `npm`:

```bash
$ npm install @sentry/node
```

To set up Sentry error logging for an Azure Function:

```javascript
"use strict";

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___"
});

module.exports = async function (context, req) {
  try {
    await notExistFunction();
  } catch (e) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
  }

  context.res = {
    status: 200,
    body: "Hello from Azure Cloud Function!"
  };
}
```

You can obtain the DSN using your Sentry account from your organization's *Settings > Projects > Client Keys (DSN)* in the Sentry web UI.

Note: You need to call both `captureException` and `flush` for captured events to be successfully delivered to Sentry.

Checkout Sentry's [Azure sample apps](https://github.com/getsentry/examples/tree/master/azure-functions/node) for detailed examples. Refer to the [JavaScript docs](/platforms/javascript/) for more configuration options.
