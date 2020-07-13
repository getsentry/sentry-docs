---
title: Azure Functions
sidebar_order: 9
---

Install our Node.js SDK in Azure:
```bash
npm install @sentry/node
```

Set up Sentry error logging for your azure function:
```js
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "___PUBLIC_DSN___"
});

module.exports = async function (context, req) {
    try {
        await callUndefinedFunction(); // Call undefined function.
    } catch (error) {
        Sentry.captureException(error); // Capture the exception in Sentry dashboard.
        await Sentry.flush(2000);
    }

    context.res = {
        status: 200, /* Defaults to 200 */
        body: "Hello from Azure cloud function"
    };
}
```

You can obtain the DSN using your Sentry account from your organization's *Settings -> Projects -> Client Keys (DSN)* in the Sentry web UI.

Note: You need to call both `captureException` and `flush` in order for captured events to be successfully delivered to Sentry.

Checkout Sentry’s [azure sample apps](https://github.com/getsentry/examples/tree/master/azure-functions/node) for detailed examples. For detailed configuration options, use [JavaScript docs](/platforms/javascript/).
