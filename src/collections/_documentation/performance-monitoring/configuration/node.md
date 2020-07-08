---
hide_from_sidebar: true
---

**Node**

To get started with performance monitoring with Node.js, first install these packages:

```bash
# Using yarn
$ yarn add @sentry/node @sentry/apm

# Using npm
$ npm install @sentry/node @sentry/apm
```

**Sending Traces**

To send traces, set the `tracesSampleRate` to a nonzero value. The following configuration will capture 100% of all your transactions:

```javascript
const Sentry = require('@sentry/node');
// or use es6 import statements
// import * as Sentry from '@sentry/node';

// This is required since it patches functions on the hub
const Apm = require("@sentry/apm"); 
// or use es6 import statements
// import * as Apm from '@sentry/apm';

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1.0 // Be sure to adjust this to your needs
});

// Your test code to verify it works

const transaction = Sentry.startTransaction({
  op: 'test',
  name: 'My First Test Transaction',
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();    
  }
}, 99);

// ---------------------------------
```

Performance data is transmitted using a new event type called "transactions", which you can learn about in [Distributed Tracing](/performance-monitoring/distributed-tracing/#traces-transactions-and-spans). **To capture transactions, you must install the performance package and configure your SDK to set the `tracesSampleRate` option to a nonzero value.** The example configuration above will transmit 100% of captured transactions. Make sure to adjust this value according to your needs.

**Automatic Instrumentation**

It’s possible to add tracing to all popular frameworks; however, we only provide pre-written handlers for Express.

```javascript
const Sentry = require("@sentry/node");
const Apm = require("@sentry/apm");
const express = require("express");
const app = express();

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Apm.Integrations.Express({ app })
  ],
  tracesSampleRate: 0.25 // Be sure to adjust this to your needs
});

// RequestHandler creates a separate execution context using domains, so that every 
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app

app.use(Sentry.Handlers.errorHandler());
app.listen(3000);
```

Spans are instrumented for the following operations within a transaction:

- HTTP requests made with `request`
- `get` calls using native `http` and `https` modules
- Middleware (Express.js only)

**Manual Instrumentation**

<!-- WIZARD node-tracing -->

To manually instrument a specific region of your code, you can create a transaction to capture it.

The following example creates a transaction for a part of the code that contains an expensive operation (for example, `processItem`), and sends the result to Sentry:

```javascript
app.use(function processItems(req, res, next) {
  const item = getFromQueue();
  const transaction = Sentry.startTransaction({
      op: "task",  
      name: item.getTransaction()
  })

  // processItem may create more spans internally (see next examples)
  processItem(item, transaction).then(() => {
      transaction.finish();
      next();
  })
});
```
<!-- ENDWIZARD -->

#### Retrieving a Transaction

In cases where you want to attach Spans to an already ongoing Transaction you can use `Sentry.getCurrentHub().getScope().getTransaction()`. This function will return a `Transaction` in case there is a running Transaction otherwise it returns `undefined`. If you are using our Express integration by default we attach the Transaction to the Scope. So you could do something like this:

```javascript
app.get("/success", function successHandler(req, res) {
  const transaction = Sentry.getCurrentHub().getScope().getTransaction();
  if (transaction) {
    let span = transaction.startChild({
      op: "encode",
      description: "parseAvatarImages"
    });
    // Do something
    span.finish();
  }
  res.status(200).end();
});
```
