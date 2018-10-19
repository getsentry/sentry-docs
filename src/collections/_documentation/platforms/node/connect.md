---
title: Connect
sidebar_order: 1012
---

<!-- WIZARD -->

Our Connect integration only requires _@sentry/node_ to be installed then you can use it like this:

```javascript
const connect = require('connect');
const Sentry = require('@sentry/node');

// Must configure Sentry before doing anything else with it
Sentry.init({ dsn: '___PUBLIC_DSN___' });

function mainHandler(req, res) {
  throw new Error('Broke!');
}

function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + '\n');
}

connect(
  // The request handler be the first item
  Sentry.Handlers.requestHandler(),

  connect.bodyParser(),
  connect.cookieParser(),
  mainHandler,

  // The error handler must be before any other error middleware
  Sentry.Handlers.errorHandler(),

  // Optional fallthrough error handler
  onError
).listen(3000);
```

<!-- ENDWIZARD -->
