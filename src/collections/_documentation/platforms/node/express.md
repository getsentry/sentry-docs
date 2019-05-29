---
title: Express
sidebar_order: 1010
---

<!-- WIZARD -->

Our Express integration only requires the installation of `@sentry/node`, and then you can use it like this:

```javascript
const express = require('express');
const app = express();
const Sentry = require('@sentry/node');

Sentry.init({ dsn: '___PUBLIC_DSN___' });

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

app.get('/', function mainHandler(req, res) {
  throw new Error('Broke!');
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

<!-- ENDWIZARD -->
