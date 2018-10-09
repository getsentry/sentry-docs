---
title: Express
sidebar_order: 1010
---

<!-- WIZARD -->

Our Express integration only requires _@sentry/node_ to be installed then you can use it like this:

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
  res.end(res.sentry + '\n');
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

## Working with Scopes and Hubs

Because of pipeline-like nature of Express.js and it's middlewares, the user has to pass the scope through all the pipes and carry it over with the request. It's required in order to isolate requests from each other.

If you want to set per-requests user data and send it over to Sentry, you need to use `getHubFromCarrier` on the `request` object, instead of directly calling methods like `configureScope` or `captureException`. Here are some examples:

```javascript
app.get('/foo', (req, res, next) => {
  Sentry.getHubFromCarrier(req).configureScope(scope => {
    scope.setTag('foo', 'my-value');
  });

  throw new Error('foo');
});

app.get('/foo', (req, res, next) => {
  Sentry.getHubFromCarrier(req).configureScope(scope => {
    scope.setTag('foo', 'my-value');
  });

  if (someCheck()) {
    Sentry.getHubFromCarrier(req).captureMessage('Invalid eventId');
    next();
  } else {
    res.end();
  }
});
```

All `configureScope` calls that were done directly on initialized `Sentry` object, will be carried to each request, so it's a good way to set some data globally.

