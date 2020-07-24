---
title: AWS Lambda
sidebar_order: 7
---

Create a deployment package on your local machine and install the required dependencies in the deployment package. For more information, see [Building an AWS Lambda deployment package for Node.js](https://aws.amazon.com/premiumsupport/knowledge-center/lambda-deployment-package-nodejs/).

Install our Node.js SDK using `npm`:

```bash
$ npm install @sentry/node
```

To set up Sentry error logging for a Lambda Function, build a wrapper:

```javascript
"use strict";

const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "___PUBLIC_DSN___"
});

function sentryHandler(lambdaHandler) {
  return async event => {
    try {
      return await lambdaHandler(event);
    } catch (e) {
      Sentry.captureException(e);
      await Sentry.flush(2000);
      return e;
    }
  };
}

module.exports.hello = sentryHandler(async event => {
  notExistFunction();
  return event;
});
```

You can obtain the DSN using your Sentry account from your organization's *Settings > Projects > Client Keys (DSN)* in the Sentry web UI.

Note: You need to call both `captureException` and `flush` for captured events to be successfully delivered to Sentry.

Create the deployment package in `.zip` format, then upload it to AWS Lambda as a Lambda Function. Checkout Sentry's [aws sample apps](https://github.com/getsentry/examples/tree/master/aws-lambda/node) for detailed examples. Refer to the [JavaScript docs](/platforms/javascript/) for more configuration options.
