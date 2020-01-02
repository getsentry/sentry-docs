---
title: Integrations
robots: noindex
---

## Connect

<!-- WIZARD -->
```javascript
var connect = require('connect');
var Raven = require('raven');

// Must configure Raven before doing anything else with it
Raven.config('___PUBLIC_DSN___').install();

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
    Raven.requestHandler(),

    connect.bodyParser(),
    connect.cookieParser(),
    mainHandler,

    // The error handler must be before any other error middleware
    Raven.errorHandler(),

    // Optional fallthrough error handler
    onError,
).listen(3000);
```
<!-- ENDWIZARD -->

## Express

<!-- WIZARD -->
```javascript
var app = require('express')();
var Raven = require('raven');

// Must configure Raven before doing anything else with it
Raven.config('__DSN__').install();

// The request handler must be the first middleware on the app
app.use(Raven.requestHandler());

app.get('/', function mainHandler(req, res) {
    throw new Error('Broke!');
});

// The error handler must be before any other error middleware
app.use(Raven.errorHandler());

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

## Koa

<!-- WIZARD -->
```javascript
var koa = require('koa');
var Raven = require('raven');

var app = koa();
Raven.config('___PUBLIC_DSN___').install();

app.on('error', function (err) {
    Raven.captureException(err, function (err, eventId) {
        console.log('Reported error ' + eventId);
    });
});

app.listen(3000);
```
<!-- ENDWIZARD -->

## Loopback

If you’re using Loopback 2.x LTS, make sure you’ve migrated to [strong-error-handler](https://loopback.io/doc/en/lb2/Using-strong-error-handler.html), otherwise no errors will get to `raven-node`.

Configure `raven-node` as early as possible:

```javascript
// server/server.js

const Raven = require('raven');
Raven.config('__DSN__').install();
```

Add `Raven.errorHandler` as a Loopback middleware:

```json
// server/middleware.json

"final:after": {
  "raven#errorHandler": {},
  "strong-error-handler": {
    "debug": false,
    "log": false
  }
}
```

## Sails

```javascript
// config/http.js

var Raven = require('raven');
Raven.config('__DSN__').install();

module.exports.http = {
  middleware: {
    // Raven's handlers has to be added as a keys to http.middleware config object
    requestHandler: Raven.requestHandler(),
    errorHandler: Raven.errorHandler(),

    // And they have to be added in a correct order to middlewares list
    order: [
      // The request handler must be the very first one
      'requestHandler',
      // ...more middlewares
      'router',
      // The error handler must be after router, but before any other error middleware
      'errorHandler',
      /// ...remaining middlewares
    ]
  }
}
```
