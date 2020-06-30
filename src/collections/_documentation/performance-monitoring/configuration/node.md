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

To send traces, set the `tracesSampleRate` to a nonzero value. The following configuration will capture 25% of all your transactions:

```javascript
const Sentry = require("@sentry/node");

// This is required since it patches functions on the hub
const Apm = require("@sentry/apm"); 

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 0.25
});
```

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
  tracesSampleRate: 0.25
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
