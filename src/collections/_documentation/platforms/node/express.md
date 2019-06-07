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

// The error handler must be before any other error middleware
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
