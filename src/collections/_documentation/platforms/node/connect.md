---
title: Connect
sidebar_order: 1012
---

<!-- WIZARD -->
If you are using `yarn` or `npm`, you can add our package as a dependency:

```bash
# Using yarn
$ yarn add @sentry/node@{% sdk_version sentry.javascript.node %}

# Using npm
$ npm install @sentry/node@{% sdk_version sentry.javascript.node %}
```

```javascript
const connect = require('connect');
const Sentry = require('@sentry/node');

// Must configure Sentry before doing anything else with it
Sentry.init({ dsn: '___PUBLIC_DSN___' });

function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
}

function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
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
