---
title: AWS Lambda
sidebar_order: 7
---

Create a deployment package on your local machine and install the required dependencies in the deployment package. For more information, see [Building an AWS Lambda deployment package for Node.js](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/).

Install our Node.js SDK using `npm`:

```basic
npm install sentry_sdk
```

To set up Sentry error logging for a Lambda function, build a wrapper:

```javascript
"use strict";

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "YOUR DSN"
});

function sentryHandler(lambdaHandler) {
  return async event => {
    try {
      return await lambdaHandler(event);
    } catch (error) {
      Sentry.captureException(error);
      await Sentry.flush(2000);
      return error;
    }
  };
}

module.exports.hello = sentryHandler(async event => {
  throw new Error("asd");
});
```
You can obtain the DSN using your Sentry account from your organization's *Settings -> Projects -> Client Keys (DSN)* in the Sentry web UI.

Note: You need to call both `CaptureException` and `Flush` to report errors into Sentry.

Create the deployment package in .zip format, then upload it to AWS Lambda as a Lambda function. Checkout Sentry’s [aws sample apps](https://github.com/getsentry/examples/tree/master/aws-lambda/node) for detailed examples. Use [JavaScript docs](/platforms/javascript/) for more configuration options.

