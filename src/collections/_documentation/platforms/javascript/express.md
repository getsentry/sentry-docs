---
title: Express
sidebar_order: 1010
---

<!-- WIZARD -->
Our Express integration only requires _@sentry/node_ to be installed then you can use it like this:

```javascript
const express = require('express');
const app = express();
const Sentry = require('@sentry/node') ;

Sentry.init({ dsn:'___PUBLIC_DSN___' });

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
<!-- ENDWIZARD -->