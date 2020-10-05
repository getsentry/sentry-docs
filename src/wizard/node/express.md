---
name: Express
doc_link: https://docs.sentry.io/platforms/node/guides/express/
support_level: production
type: framework
---

Add `@sentry/node` as a dependency:

```bash
# Using yarn
yarn add @sentry/node @sentry/tracing

# Using npm
npm install --save @sentry/node @sentry/tracing
```

Sentry should be initialized as early in your app as possible.

```javascript
import express from "express";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

// or using CommonJS
// const express = require('express');
// const Sentry = require('@sentry/node');
// const Tracing = require("@sentry/tracing");

const app = express();

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// All controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3000);
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `tracesSampleRate` to a value between 0 and 1.

You can verify the Sentry integration is working by creating a route that will throw an error:

```js
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
```

`requestHandler` accepts some options that let you decide what data should be included in the event sent to Sentry.

Possible options are:

```js
// keys to be extracted from req
request?: boolean | string[]; // default: true = ['cookies', 'data', 'headers', 'method', 'query_string', 'url']
// server name
serverName?: boolean; // default: true
// generate transaction name
//   path == request.path (eg. "/foo")
//   methodPath == request.method + request.path (eg. "GET|/foo")
//   handler == function name (eg. "fooHandler")
transaction?: boolean | 'path' | 'methodPath' | 'handler'; // default: true = 'methodPath'
// keys to be extracted from req.user
user?: boolean | string[]; // default: true = ['id', 'username', 'email']
// client ip address
ip?: boolean; // default: false
// node version
version?: boolean; // default: true
// timeout for fatal route errors to be delivered
flushTimeout?: number; // default: undefined
```

For example, if you want to skip the server name and add just user, you would use `requestHandler` like this:

```js
app.use(
  Sentry.Handlers.requestHandler({
    serverName: false,
    user: ["email"],
  })
);
```

By default, `errorHandler` will capture only errors with a status code of `500` or higher. If you want to change it, provide it with the `shouldHandleError` callback, which accepts middleware errors as its argument and decides, whether an error should be sent or not, by returning an appropriate boolean value.

```js
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status === 404 || error.status === 500) {
        return true;
      }
      return false;
    },
  })
);
```
