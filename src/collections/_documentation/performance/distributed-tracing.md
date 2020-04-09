---
title: Distributed Tracing
sidebar_order: 2
---

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [https://sentry.io/for/performance/](https://sentry.io/for/performance/).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Enabling tracing data collection augments your existing error data to capture interactions among your software systems. This lets Sentry tell you valuable metrics about your software health like throughput and latency, as well as expose the impact of errors across multiple systems. Tracing makes Sentry a more complete monitoring solution to diagnose and measure your application health.

## Tracing & Distributed Tracing

Applications (for example, web applications) typically consist of interconnected components (also called services). For instance, let us assume a modern web application could be composed of the following components separated by the network boundaries:

- Frontend (Single-Page Application)
- Backend
- Background Queue
- Notification Job

Each of these components may be written in a different language on a different platform. Today, all of these components can be instrumented individually with Sentry SDKs to capture error data or crash reports whenever an event occurs in any one of them.

With tracing, we can follow the journey of the API endpoint requests from their source (for example, from the frontend), and instrument code paths as these requests traverse each component of the application. This journey is called a [**trace**]({%- link _documentation/performance/performance-glossary.md -%}#trace). Traces that cross between components, as in our web application example, are typically called **distributed traces**.

[{% asset performance/tracing-diagram.png alt="Diagram illustrating how a trace is composed of multiple transactions." %}]({% asset performance/tracing-diagram.png @path %})

Each [trace]({%- link _documentation/performance/performance-glossary.md -%}#trace) has a marker called a `trace_id`. Trace IDs are pseudorandom fixed-length alphanumeric character sequences.

By collecting traces of your users as they use your applications, you can begin to reveal some insights such as:

- What occurred for a specific error event, or issue
- What conditions are causing bottlenecks or latency issues in the application
- Which endpoints or operations consume the most time

### Trace Propagation Model

Let's refer back to our earlier example of the web application consisting of these high-level components:

- Frontend (Single-Page Application)
- Backend
- Background Queue
- Notification Job

A trace [propagates]({%- link _documentation/performance/performance-glossary.md -%}#propagation) first from the frontend, then to the backend, and later to the background queue or notification job. Collected [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) from each component are sent back to Sentry asynchronously and independently. Instrumented spans received from one component aren't forwarded to the next component. If a span appears to be missing a parent span, it could be an [**orphan span**]({%- link _documentation/performance/performance-glossary.md -%}#orphan-spans).

## Transactions

[{% asset performance/anatomy-of-transaction.png alt="Diagram illustrating how a transaction is composed of many spans." %}]({% asset performance/anatomy-of-transaction.png @path %})

Traces in Sentry are segmented into [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) called [**transactions**]({%- link _documentation/performance/performance-glossary.md -%}#transaction). When instrumenting the application with tracing, collected spans are grouped within an encompassing top-level span called the **transaction span**. This notion of a transaction is specific to Sentry.

If you are collecting transactions from more than a single machine, you will likely encounter [**clock skew**]({%- link _documentation/performance/performance-glossary.md -%}#clock-skew).

## Sampling Transactions

**We strongly recommend sampling your transactions.**

When you enable sampling for transaction events in Sentry, you choose a percentage of collected transactions to send to Sentry. For example, if you had an endpoint that received 1000 requests per minute, a sampling rate of 0.25 would result in 250 transactions (25%) being sent to Sentry.

Sampling enables you to collect traces on a subset of your traffic and extrapolate to the total volume. Furthermore, **enabling sampling allows you to control the volume of data you send to Sentry and lets you better manage your costs**. If you don't have a good understanding of what sampling rate to choose, we recommend you start with a low value and gradually increase the sampling rate as you learn more about your traffic patterns and volume.

When you have multiple projects collecting transaction events, Sentry utilizes "head-based" sampling to ensure that once a sampling decision has been made at the beginning of the trace (typically the initial transaction), that decision is propagated to each service or project involved in the [trace]({%- link _documentation/performance/performance-glossary.md -%}#trace). If your services have multiple entry points, you should aim to choose a consistent sampling rate for each. Choosing different sampling rates can bias your results. Sentry does not support "tail-based" sampling at this time.

If you enable Performance collection for a large portion of your traffic, you may exceed your organization's [Quotas and Rate Limits]({%- link _documentation/accounts/quotas/index.md -%}).

## Viewing Transactions

View transaction events by clicking on the "Transactions" pre-built query in [Discover]({%- link _documentation/performance/discover/index.md -%}), or by using a search condition `event.type:transaction` in a [Discover Query Builder]({%- link _documentation/performance/discover/query-builder.md -%}) view.

When you open a transaction event in Discover, you'll see the **span view** at the top of the page. Other information the SDK captured as part of the Transaction event, such as breadcrumbs, will also be displayed.

[{% asset performance/discover-span.png alt="Discover span showing the map of the transactions (aka minimap) and the black dashed handlebars for adjusting the window selection." %}]({% asset performance/discover-span.png @path %})

### Using the Span View

Note that [traces]({%- link _documentation/performance/performance-glossary.md -%}#trace) are segmented into [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) called [transactions]({%- link _documentation/performance/performance-glossary.md -%}#transaction). The span view enables you to examine the waterfall graph (or hierarchy) of the instrumented transaction.

The span view is a split view where the left-hand side is the tree view displaying the parent-child relationship of the spans, and the right-hand side displays spans represented as colored rectangles. Within the tree view (left-hand side), Sentry identifies spans by their **operation name** and their **description**. If you don't provide the description, Sentry uses the span id as the fallback.

At the top of the span view is a minimap, which is a "map" of the transaction. It helps orient you to the specific portion of the transaction that you're viewing.

The first top-level span is the transaction span, which encompasses all other spans within the transaction.

**Zooming In on a Transaction**

As displayed in the Discover span screenshot above, you can click and drag your mouse cursor across the minimap (top of the span view). You can also adjust the window selection by dragging the handlebars (black dashed lines). 

**Missing Instrumentation**

Sentry may indicate that gaps between spans are "Missing Instrumentation." This message could mean that the SDK was unable to capture or instrument any spans within this gap automatically. It may require you to instrument the gap [manually](#setting-up-tracing).

**Viewing Span Details**

Click on a row to expand the details of the span. From here, you can see all attached properties, such as **tags** and **data**.

[{% asset performance/span-detail-view.png alt="Span detail view shows the span id, trace id, parent span id, and other data such as tags." %}]({% asset performance/span-detail-view.png @path %})

**Search by Trace ID**

You can search using `trace id` by expanding any of the span details and click on "Search by Trace".

You need **project permissions for each project** to see all the transactions within a trace. Each transaction in a trace is likely a part of a different project. If you don't have project permissions, some transactions may not display as part of a trace.

**Traversing to Child Transactions**

Child transactions are shown based on your project permissions -- which are necessary to viewing transaction events. To check project permissions, navigate to **Settings >> [your organization] >> [your project] >> General**.

Some spans within a transaction may be the parent of another transaction. If you expand the span details, you may see the "View Child" button, which, when clicked, will lead to another transaction's details view.

## Setting Up Tracing

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [https://sentry.io/for/performance/](https://sentry.io/for/performance/).

Supported SDKs for Tracing:
- JavaScript Browser SDK ≥ 5.14.0
- JavaScript Node SDK ≥ 5.14.0
- Python SDK version ≥ 0.11.2

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

### Python

To send traces, set the `traces_sample_rate` to a nonzero value. The following configuration will capture 10% of your transactions:

```python
import sentry_sdk

sentry_sdk.init(
    "___PUBLIC_DSN___", 
    traces_sample_rate=0.1
)
```

**Automatic Instrumentation**

Many integrations for popular frameworks automatically capture traces. If you already have any of the following frameworks set up for Sentry error reporting, you will start to see traces immediately:

- All WSGI-based web frameworks (Django, Flask, Pyramid, Falcon, Bottle)
- Celery
- AIOHTTP web apps
- Redis Queue (RQ)

[Spans]({%- link _documentation/performance/performance-glossary.md -%}#span) are instrumented for the following operations within a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction):

- Database queries that use SQLAlchemy or the Django ORM
- HTTP requests made with `requests` or the `stdlib`
- Spawned subprocesses
- Redis operations

If you want to enable all relevant transactions automatically, you can use this alternative configuration (currently in alpha):

```python
import sentry_sdk

sentry_sdk.init(
    "___PUBLIC_DSN___",
    _experiments={"auto_enabling_integrations": True}
)
```

**Manual Instrumentation**

To manually instrument certain regions of your code, you can create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) to capture them.

The following example creates a transaction for a scope that contains an expensive operation (for example, `process_item`), and sends the result to Sentry:

```python
import sentry_sdk

while True:
  item = get_from_queue()

  with sentry_sdk.start_span(op="task", transaction=item.get_transaction()):
      # process_item may create more spans internally (see next examples)
      process_item(item)
```

**Adding More Spans to the Transaction**

The next example contains the implementation of the hypothetical `process_item` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open `transaction` and add all newly created [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) as child operations to the `transaction`. Keep in mind that each individual span also needs to be manually finished; otherwise, spans will not show up in the `transaction`.

You can choose the value of `op` and `description`.

```python
import sentry_sdk

def process_item(item):

  # omitted code...
  with sentry_sdk.start_span(op="http", description="GET /") as span:
      response = my_custom_http_library.request("GET", "/")
      span.set_tag("http.status_code", response.status_code)
      span.set_data("http.foobarsessionid", get_foobar_sessionid())
```

### JavaScript

To access our tracing features, you will need to install our Tracing package `@sentry/apm`:

```bash
$ npm install @sentry/browser
$ npm install @sentry/apm
```

**Sending Traces/Transactions/Spans**

The `Tracing` integration resides in the `@sentry/apm` package. You can add it to your `Sentry.init` call:

```javascript
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

Sentry.init({
  dsn: '___PUBLIC_DSN___',
  integrations: [
    new ApmIntegrations.Tracing(),
  ],
  tracesSampleRate: 0.1,
});
```

To send traces, you will need to set the `tracesSampleRate` to a nonzero value. The configuration above will capture 10% of your transactions.

You can pass many different options to the Tracing integration (as an object of the form `{optionName: value}`), but it comes with reasonable defaults out of the box. It will automatically capture a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) for every page load. Within that transaction, [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) are instrumented for the following operations:

- XHR/fetch requests
- If available: Browser Resources (Scripts, CSS, Images ...)
- If available: Browser Performance API Marks

*tracingOrigins Option*

The default value of `tracingOrigins` is `['localhost', /^\//]`. The JavaScript SDK will attach the `sentry-trace` header to all outgoing XHR/fetch requests whose destination contains a string in the list or matches a regex in the list. If your frontend is making requests to a different domain, you will need to add it there in order to propagate the `sentry-trace` header to the backend services, which is required to link transactions together as part of a single trace.

*Example:*

- A frontend application is served from `example.com`
- A backend service is served from `api.example.com`
- The frontend application makes API calls to the backend
- Therefore, the option needs to be configured like this: `new ApmIntegrations.Tracing({tracingOrigins: ['api.example.com']})`
- Now outgoing XHR/fetch requests to `api.example.com` will get the `sentry-trace` header attached

*NOTE:* You need to make sure your web server CORS is configured to allow the `sentry-trace` header. The configuration might look like `"Access-Control-Allow-Headers: sentry-trace"`, but this depends a lot on your set up. If you do not whitelist the `sentry-trace` header, the request might be blocked.

**Using Tracing Integration for Manual Instrumentation**

The tracing integration will create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) on page load by default; all [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) that are created will be attached to it. Also, the integration will finish the transaction after the default timeout of 500ms of inactivity. The page is considered inactive if there are no pending XHR/fetch requests. If you want to extend the transaction's lifetime beyond 500ms, you can do so by adding more spans to the transaction. The following is an example of how you could profile a React component:

```javascript
// This line starts an activity (and creates a span).
// As long as you don't pop the activity, the transaction will not be finished and
// therefore not sent to Sentry.
// If you do not want to create a span out of an activity, just don't provide the
// second arg.
const activity = ApmIntegrations.Tracing.pushActivity(displayName, {
  data: {},
  op: 'react',
  description: `${displayName}`,
});

// Sometime later ...
// When we pop the activity, the integration will finish the span and after the timeout 
// finish the transaction and send it to Sentry.
// Keep in mind, as long as you do not pop the activity, the transaction will be kept 
// alive and not sent to Sentry.
ApmIntegrations.Tracing.popActivity(activity);
```

Keep in mind that if there is no active transaction, you will need to create one before pushing an activity, otherwise nothing will happen.

Here is a different example. If you want to create a transaction for a user interaction on you page, you need to do the following:


```javascript
// Let's say this function is invoked when a user clicks on the checkout button of 
// your shop
shopCheckout() {
  // This will create a new Transaction for you
  ApmIntegrations.Tracing.startIdleTransaction('shopCheckout');

  // Assume this function makes an xhr/fetch call
  const result = validateShoppingCartOnServer(); 
  
  const activity = ApmIntegrations.Tracing.pushActivity('task', {
    data: {
      result
    },
    op: 'task',
    description: `processing shopping cart result`,
  });
  processAndValidateShoppingCart(result);
  ApmIntegrations.Tracing.popActivity(activity);

  ApmIntegrations.Tracing.finishIdleTransaction(); // This is optional
}
```

This example will send a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) `shopCheckout` to Sentry, containing all outgoing requests that happen in `validateShoppingCartOnServer` as spans. The transaction will also contain a `task` span that measures how long `processAndValidateShoppingCart` took. Finally, the call to `ApmIntegrations.Tracing.finshIdleTransaction()` will finish the [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) and send it to Sentry. Calling this is optional; if it is not called, the integration will automatically send the [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) itself after the defined `idleTimeout` (default 500ms).

**What is an activity?**

The concept of an activity only exists in the `Tracing` integration in JavaScript Browser. It's a helper that tells the integration how long it should keep the `IdleTransaction` alive. An activity can be pushed and popped. Once all activities of an `IdleTransaction` have been popped, the `IdleTransaction` will be sent to Sentry.

**Manual Transactions**

To manually instrument a certain region of your code, you can create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) to capture it.
This is valid for both JavaScript Browser and Node and works independent of the `Tracing` integration.

The following example creates a transaction for a part of the code that contains an expensive operation (for example, `processItem`), and sends the result to Sentry:

```javascript
const transaction = Sentry.getCurrentHub().startSpan({
  description: 'My optional description', // A name describing the operation
  op: "task",  
  transaction: item.getTransaction() 
})

// processItem may create more spans internally (see next example)
processItem(item).then(() => {
  transaction.finish()
})
```

**Adding Additional Spans to the Transaction**

The next example contains the implementation of the hypothetical `processItem ` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add to it all newly created [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) as child operations. Keep in mind that each individual span needs to be manually finished; otherwise, that span will not show up in the transaction.

```javascript
function processItem(item, transaction) {
  const span = transaction.child({
    op: "http",
    description: "GET /"
  })

  return new Promise((resolve, reject) => {
    http.get(`/items/${item.id}`, (response) => {
      response.on('data', () => {});
      response.on('end', () => {
        span.setTag("http.status_code", response.statusCode);
        span.setData("http.foobarsessionid", getFoobarSessionid(response));
        span.finish();
        resolve(response);
      });
    });
  });
}
```

### Node.js

To access our tracing features, you will need to install our Tracing integration:

```bash
$ npm install @sentry/node
$ npm install @sentry/apm
```

**Sending Traces**

To send traces, set the `tracesSampleRate` to a nonzero value. The following configuration will capture 10% of all your transactions:

```javascript
const Sentry = require("@sentry/node");

// This is required since it patches functions on the hub
const Apm = require("@sentry/apm"); 

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1
});
```

**Automatic Instrumentation**

It’s possible to add tracing to all popular frameworks; however, we provide pre-written handlers only for Express.js.

```javascript
const Sentry = require("@sentry/node");
const Apm = require("@sentry/apm");
const express = require("express");
const app = express();

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1
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

[Spans]({%- link _documentation/performance/performance-glossary.md -%}#span) are instrumented for the following operations within a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction):

- HTTP requests made with `request`
- `get` calls using native `http` and `https` modules
- Middlewares (Express.js only)

To enable this:

```javascript
const Sentry = require("@sentry/node");
const Apm = require("@sentry/apm");
const express = require("express");
const app = express();

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 1,
  integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Apm.Integrations.Express({ app })
  ],
});
```

**Manual Transactions**

To manually instrument a certain region of your code, you can create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) to capture it.

The following example creates a transaction for a part of the code that contains an expensive operation (for example, `processItem`), and sends the result to Sentry:

```javascript
app.use(function processItems(req, res, next) {
  const item = getFromQueue();
  const transaction = Sentry.getCurrentHub().startSpan({
      op: "task",  
      transaction: item.getTransaction()
  })

  // processItem may create more spans internally (see next examples)
  processItem(item, transaction).then(() => {
      transaction.finish();
      next();
  })
});
```

**Adding Additional Spans to the Transaction**

The next example contains the implementation of the hypothetical `processItem ` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add to it all newly created [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) as child operations. Keep in mind that each individual span needs to be manually finished; otherwise, that span will not show up in the transaction.

```javascript
function processItem(item, transaction) {
  const span = transaction.child({
    op: "http",
    description: "GET /"
  })

  return new Promise((resolve, reject) => {
    http.get(`/items/${item.id}`, (response) => {
      response.on('data', () => {});
      response.on('end', () => {
        span.setTag("http.status_code", response.statusCode);
        span.setData("http.foobarsessionid", getFoobarSessionid(response));
        span.finish();
        resolve(response);
      });
    });
  });
}
```
