---
title: Serverless
sidebar_order: 7
---

## AWS Lambda

To set up Sentry error logging for a Lambda function, build a wrapper.

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
      throw error;
    }
  };
}

module.exports.hello = sentryHandler(async event => {
  throw new Error("asd");
});
```

## Vercel Next.js API Routes

To set up Sentry error logging for a Next.js API route, build a wrapper (similar to the [AWS Lambda Sentry wrapper](#aws-lambda)).

```javascript
import Sentry from "@sentry/node"

Sentry.init({
  dsn: "YOUR DSN"
});

function sentryHandler(routeHandler) {
  return async (req, res) => {
    try {
      return await routeHandler(req, res);
    } catch (error) {
      Sentry.captureException(error);
      await Sentry.flush(2000);
      throw error;
    }
  };
}

export default sentryHandler(async (req, res) => {
  throw new Error("asd");
});
```
