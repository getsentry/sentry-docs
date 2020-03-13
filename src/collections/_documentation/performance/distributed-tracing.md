---
title: Distributed Tracing
sidebar_order: 0
---

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [https://sentry.io/for/performance/](https://sentry.io/for/performance/).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Enabling tracing data collection augments your existing error data to capture interactions between your software systems. This lets Sentry tell you valuable metrics about your software health like throughput and latency, as well as expose the impact of errors across multiple systems. Tracing makes Sentry a more complete monitoring solution to diagnose and measure your application health.

## Tracing & Distributed Tracing

Applications (for example, web applications) typically consist of interconnected applications/components (also called services). For instance, let us assume a modern web application could be composed of the following components separated by the network boundaries:

- Frontend (Single-Page Application)
- Backend
- Background Queue
- Notification Job

Each of these components may be written in different languages on different platforms. Today, all of these components can be instrumented with the Sentry SDKs to capture error data or crash reports whenever an event occurs in any one of these components.

With tracing, we can follow the journey of the API endpoint requests from their source (for example, from the frontend), and instrument code paths as these requests traverse each component of the application. This journey is called a [**trace**]({%- link _documentation/performance/performance-glossary.md -%}#trace). Traces that cross between components, as in our web application example, are typically called **distributed traces**.

[{% asset performance/tracing-diagram.png alt="Diagram illustrating how a trace is composed of multiple transactions." %}]({% asset performance/tracing-diagram.png @path %})

Each [trace]({%- link _documentation/performance/performance-glossary.md -%}#trace) has a marker called a `trace_id`. Trace IDs are pseudorandom fixed length of alphanumeric character sequences.

By collecting traces of your users as they use your applications, you can begin to reveal some insights such as:

- Investigate and debug what occurred for a specific error event, or issue
- What conditions are causing bottlenecks or latency issues in the application
- Which endpoints or operations consume the most time

### Trace Propagation Model

Referring back to our earlier example of the web application consisting of these high-level components:

- Frontend (Single-Page Application)
- Backend
- Background Queue
- Notification Job

A trace [propagates]({%- link _documentation/performance/performance-glossary.md -%}#propagation) first from the frontend, then the backend, and later to the background queue or notification job. Collected [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) from each component are sent back to Sentry asynchronously and independently. Instrumented spans received from one component aren't forwarded to the next component. If a span appears to be missing a parent span, it could be an [**orphan span**]({%- link _documentation/performance/performance-glossary.md -%}#orphan-spans).

## Transactions

[{% asset performance/anatomy-of-transaction.png alt="Diagram illustrating how a transaction is composed of many spans." %}]({% asset performance/anatomy-of-transaction.png @path %})

Traces in Sentry are segmented into pieces of [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) called [**transactions**]({%- link _documentation/performance/performance-glossary.md -%}#transaction). When instrumenting the application with tracing, collected spans are grouped within an encompassing top-level span called the **transaction span**. This notion of a transaction is specific to Sentry.

If you are collecting transactions from more than a single machine, you will likely encounter [**clock skew**]({%- link _documentation/performance/performance-glossary.md -%}#clock-skew).

## Sampling Transactions

**We strongly recommend sampling your transactions.**

When you enable sampling for transaction events in Sentry, you choose a percentage of collected transactions to send to Sentry. For example, if you had an endpoint that received 1000 requests per minute, a sampling rate of 0.25 would result in 250 transactions (25%) being sent to Sentry.

Sampling enables you to collect traces on a subset of your traffic and extrapolate to the total volume. Furthermore, **enabling sampling allows you to control the volume of data you send to Sentry and lets you better manage your costs**. If you don't have a good understanding of what sampling rate to choose, we recommend you start with a low value and gradually increase the sampling rate as you learn more about your traffic patterns and volume.

When you have multiple projects collecting transaction events, Sentry utilizes "head-based" sampling to ensure that once a sampling decision has been made at the beginning of the trace (typically the initial transaction), that decision is propagated to each application or project involved in the [trace]({%- link _documentation/performance/performance-glossary.md -%}#trace). If your applications have multiple entry points, you should aim to choose consistent sampling rates. Choosing different sampling rates can bias your results. Sentry does not support "tail-based" sampling at this time.

If you enable Performance collection for a large portion of your traffic, you may exceed your organization's [Quotas and Rate Limits]({%- link _documentation/accounts/quotas.md -%}).

## Setting Up Tracing

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [https://sentry.io/for/performance/](https://sentry.io/for/performance/).

Supported SDKs for Tracing:
- JavaScript Browser SDK ≥ 5.14.0
- JavaScript Node SDK ≥ 5.14.0
- Python version ≥ 0.11.2

{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

### Python

To send any traces, set the `traces_sample_rate` to a nonzero value. The following configuration will capture 10% of all your transactions:

```python
import sentry_sdk
    
sentry_sdk.init("___PUBLIC_DSN___", traces_sample_rate=0.1)
```

**Automatic Instrumentation**

Many integrations for popular frameworks automatically capture traces. If you already have any of the following frameworks set up for Sentry error reporting, you will start to see traces immediately:

- All WSGI-based frameworks (Django, Flask, Pyramid, Falcon, Bottle)
- Celery
- Redis Queue (RQ)

[Spans]({%- link _documentation/performance/performance-glossary.md -%}#span) are instrumented for the following operations within a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction):

- Database that uses SQLAlchemy or the Django ORM
- HTTP requests made with `requests` or the `stdlib`
- Spawned subprocesses

If you want to enable all relevant transactions automatically, you can use this alternative configuration (currently in alpha):

```python
import sentry_sdk

sentry_sdk.init("___PUBLIC_DSN___", _experiments={"auto_enabling_integrations": True})
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

To access our tracing features, you will need to install our Tracing integration:

```bash
$ npm install @sentry/browser
$ npm install @sentry/apm
```

**Sending Traces**

Tracing resides in the `@sentry/apm` package. You can add it to your `Sentry.init` call:

```javascript
import * as Sentry from '@sentry/browser';
import { Integrations as ApmIntegrations } from '@sentry/apm';

Sentry.init({
    dsn: '___PUBLIC_DSN___',
    integrations: [
        new ApmIntegrations.Tracing(),
    ],
});
```

You can pass many different options to tracing, but it comes with reasonable defaults out of the box.
[Spans]({%- link _documentation/performance/performance-glossary.md -%}#span) are instrumented for the following operations within a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction):

- A [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) for every page load
- All XHR/fetch requests as spans

**Using Tracing Integration for Manual Instrumentation**

The tracing integration will create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) on page load by default; all [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) that are created will be attached to it. Also, the integration will finish the transaction after the default timeout of 500ms of inactivity. The page is considered inactive if there are no pending XHR/fetch requests. If you want to extend the transaction's lifetime beyond 500ms, you can do so by adding more spans to the transaction. The following is an example of how you could profile a React component:

```javascript
// This line starts an activity (and creates a span).
// As long as you don't pop the activity, the transaction will not be finished and therefore not sent to Sentry.
// If you do not want to create a span out of an activity, just don't provide the second arg.
const activity = ApmIntegrations.Tracing.pushActivity(displayName, {
    data: {},
    op: 'react',
    description: `<${displayName}>`,
});

// Sometime later ...
// When we pop the activity, the Integration will finish the span and after the timeout finish the transaction and send it to Sentry
Integrations.ApmIntegrations.popActivity(activity);
```

**Manual Transactions**

To manually instrument certain regions of your code, you can create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) to capture them.

The following example creates a transaction for a scope that contains an expensive operation (for example, `process_item`), and sends the result to Sentry:

```javascript
const transaction = Sentry.getCurrentHub().startSpan({ 
    op: "task",  
    transaction: item.getTransaction() 
})

// processItem may create more spans internally (see next example)
processItem(item).then(() => {
    transaction.finish()
})
```

**Adding Additional Spans to the Transaction**

The next example contains the implementation of the hypothetical `processItem ` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open `transaction` and add all newly created [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) as child operations to the `transaction`. Keep in mind that each individual span also needs to be manually finished; otherwise, spans will not show up in the `transaction`.

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

To access our tracing features, you will need to install our Performance integration:

```bash
$ npm install @sentry/node
$ npm install @sentry/apm
```

**Sending Traces**

To send any traces, set the `tracesSampleRate` to a nonzero value. The following configuration will capture 10% of all your transactions:

```javascript
const Sentry = require("@sentry/node");
const Apm = require("@sentry/apm"); // This is required since it patches functions on the hub

Sentry.init({
    dsn: "___PUBLIC_DSN___",
    tracesSampleRate: 0.1
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

// RequestHandler creates a separate execution-context using domains, so that every transaction/span/breadcrumb has it's own Hub to be attached to
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a tracing for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// the rest of your app

app.use(Sentry.Handlers.errorHandler());
app.listen(3000);
```

[Spans]({%- link _documentation/performance/performance-glossary.md -%}#span) are instrumented for the following operations within a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction):

- HTTP requests made with `request` or `get` calls using native `http` and `https` modules
- Middlewares (Express.js only)

To enable them:

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

**Managing Transactions**

Let’s say you want to create a [transaction]({%- link _documentation/performance/performance-glossary.md -%}#transaction) for an expensive operation (for example,  `processItem`) and send the result to Sentry:

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

The next example is called in the `processItem` function from the code snippet above. Our SDK can determine if there is a current open `transaction` and add all newly created [spans]({%- link _documentation/performance/performance-glossary.md -%}#span) as child operations to the `transaction`. Keep in mind; each individual span also needs to be finished; otherwise, it will not show up in the `transaction`.

You can choose the value of `op` and `description`.

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
