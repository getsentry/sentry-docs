---
title: Serverless
sidebar_order: 5
---

## AWS Lambda

To set up Sentry error logging for a Lambda function, build a wrapper.

```javascript
    "use strict";

    const Sentry = require("@sentry/node");

    Sentry.init({
    dsn: "YOUR DSN",
    });

    function sentryHandler(lambdaHandler) {
    return async event => {
        try {
        return await lambdaHandler(event);
        } catch (error) {
        Sentry.captureException(error);
        await Sentry.flush(2000);
        return {
            body: JSON.stringify({
            err: error.message,
            msg: "An error has occured. Our developers have been informed."
            }),
            statusCode: 500
        };
        }
    };
    }

    module.exports.hello = sentryHandler(async event => {
    throw new Error("asd");
    });
```
