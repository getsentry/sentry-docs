---
title: Azure Functions
sidebar_order: 9
---

Install our Nodejs SDK in Azure:
 ````js
 npm install @sentry/node
 ````

Set up Sentry error logging for your azure function:
````jsx
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "<Your dsn>",
});

module.exports = async function (context, req) {
    try {
        callUndefinedFunction(); // Call undefined function.
    } catch (error) {
        Sentry.captureException(error); // Capture the exception in Sentry dashboard.
        await Sentry.flush(2000);
    }

    context.res = {
        status: 200, /* Defaults to 200 */
        body: "Hello from Azure cloud function"
    };
}
````

You can obtain the DSN using your Sentry account from your organization's *Settings -> Projects -> Client Keys (DSN)* in the Sentry web UI.

Note: You need to call both `CaptureException` and `Flush` to report errors into Sentry.

Checkout Sentry’s [azure sample apps](https://github.com/getsentry/examples/tree/master/azure-functions/node) for detailed examples. For detailed configuration options, use [JavaScript docs](/platforms/javascript/).
