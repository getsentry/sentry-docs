---
title: Express
sidebar_order: 1010
---

<!-- WIZARD -->
If you are using `yarn` or `npm`, you can add our package as a dependency:

```bash
# Using yarn
$ yarn add @sentry/node@{% sdk_version sentry.javascript.node %}

# Using npm
$ npm install @sentry/node@{% sdk_version sentry.javascript.node %}
```

Sentry should be initialized as early in your app as possible.

```javascript
const express = require('express');
const app = express();
const Sentry = require('@sentry/node');

Sentry.init({ dsn: '___PUBLIC_DSN___' });

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// All controllers should live here
app.get('/', function rootHandler(req, res) {
  res.end('Hello world!');
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

You can verify the Sentry integration by creating a route that will throw an error:

```js
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
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
// node version
version?: boolean; // default: true
// timeout for fatal route errors to be delivered
flushTimeout?: number; // default: 2000
```

For example, if you want to skip the server name and add just user, you would use `requestHandler` like this:

```js
app.use(Sentry.Handlers.requestHandler({
  serverName: false,
  user: ['email']
}));
```

By default, `errorHandler` will capture only errors with a status code of `500` or higher. If you want to change it, provide it with the `shouldHandleError` callback, which accepts middleware errors as its argument and decides, whether an error should be sent or not, by returning an appropriate boolean value.

```js
app.use(Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    // Capture all 404 and 500 errors
    if (error.status === 404 || error.status === 500) {
      return true
    }
    return false
  }
}));
```

<!-- ENDWIZARD -->

If you use TypeScript, you need to cast our handlers to express specific types.
They are fully compatible, so the only things you need to change are:

```javascript
// from
const express = require('express');
// to
import * as express from 'express';


// from
app.use(Sentry.Handlers.requestHandler());
// to
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);


// from
app.use(Sentry.Handlers.errorHandler());
// to
app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
```

### Troubleshooting

When capturing errors locally, ensure that your project's data filter for filtering localhost events is toggled off:

{% asset express-data-filters.png %}

This ensures that errors produced by your browser (such as errors produced by HTTP methods) are properly captured.
