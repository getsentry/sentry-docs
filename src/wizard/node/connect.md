---
name: Connect
doc_link: https://docs.sentry.io/platforms/node/guides/connect/
support_level: production
type: framework
---

Add `@sentry/node` as a dependency:

```bash
# Using yarn
yarn add @sentry/node

# Using npm
npm install --save @sentry/node
```

```javascript
import connect from "connect";
import * as Sentry from "@sentry/node";

// or using CommonJS
// const connect = require('connect');
// const Sentry = require('@sentry/node');

// Must configure Sentry before doing anything else with it
Sentry.init({ dsn: "___PUBLIC_DSN___" });

function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
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
flushTimeout?: number; // default: 2000
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
