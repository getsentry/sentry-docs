---
title: Distributed Tracing
sidebar_order: 1
---

[Alert Box: What plan APM is available on? ]

Enabling tracing data collection can augment your existing errors to answer any question or unknowns about your systems. Tracing also allows you to track critical metrics and service-level objectives (SLO) like throughput, latency, or apdex to build a complete monitoring solution to diagnose and measure your application health.

## Tracing & Distributed Tracing

Applications (for example, web applications) typically consist of interconnected applications/components (also called services). For instance, let us assume a modern web application could be composed of the following components separated by the network boundaries:

- Frontend (Single-Page Application)
- Backend
- Search Service
- Cache Service

Each of these components may be written in different languages on different platforms. Today, all of these components can be instrumented with the Sentry SDKs to capture error data or crash reports whenever an event occurs in any one of these components.

With tracing, we can follow the journey of the API endpoint requests from their source (for example, from the frontend), and instrument code paths as these requests traverse each component of the application. This journey is called a **trace**. Traces that cross between components, as in our web application example, are typically called **distributed traces**.

![DON%20T%20Add%20content%20to%20this%20FINAL%20Draft%20Tracing%20for%20/Tracing-diagram.png](DON%20T%20Add%20content%20to%20this%20FINAL%20Draft%20Tracing%20for%20/Tracing-diagram.png)

Traces that start with the same set of API endpoint calls can potentially differ in terms of what code paths were executed. For example, an initial trace may result in a cache miss at the Cache Service, and a subsequent trace may include more information instrumented at the Cache Service. Although these two traces are similar, they are not identical.

Each trace has a marker called a `trace_id` . Trace IDs are pseudorandom fixed length of alphanumeric character sequences.

By collecting traces of your users as they use your applications, you can begin to reveal some insights such as:

- Investigate and debug what occurred for a specific error event, or issue
- What conditions are causing bottlenecks or latency issues in the application
- Which endpoints or operations consume the most time.

### Trace propagation model

Referring back to our earlier example of the web application consisting of these high-level components:

- Frontend (Single-Page Application)
- Backend
- Search Service
- Cache Service

A trace propagates first from the frontend, then the backend, and later to the search or caching service. Collected spans from each component are sent back to Sentry asynchronously and independently. Instrumented spans received from one component are not forwarded to the next component.

## Span

When you initialize and load a Sentry SDK that supports tracing, it will automatically instrument parts of your running application, such as function calls and network operations. Instrumenting a database call could entail these three steps or subroutines:

1. Calling a function to compose a database query
2. Sending a query to a database
3. Receiving and transforming results

Each of these subroutines take some time to perform (no matter how fast they could run). Sentry records these subroutines as a unit of work in the form of **spans.** Sentry can also attach useful information to spans, such as tags, additional contextual data, and a status to indicate if the subroutine failed or not.

Spans can have descendant spans (or child spans). In our earlier example, the three subroutines can be spans within a larger encompassing span (the database call).

Any instrumented span is part of a trace (identified by its trace id, `trace_id`), and each span has its own marker called the `span_id`; a fixed length of alphanumeric characters.

### Orphan Spans

Orphan spans refer to spans that exist or are visible, but their parent spans are not visible or are not within Sentry's database. This could imply a bug in the Sentry application. If you're confident about this, please contact support: [support@sentry.io](mailto:support@sentry.io)

Another reason could include that instrumented spans may not make it back to Sentry for processing. As an example, let us refer back to our earlier example of the web application consisting of:

- Frontend (Single-Page Application)
- Backend
- Search Service
- Cache Service

Instrumented spans in each component are sent back to Sentry for processing. However, a server in the backend component could suffer from network connectivity loss, and the spans may not have made it back to Sentry. This would indicate a "hole" within this specific trace. The collected spans within the Search Service would be descendants of a span (for example, a search service call) within the Backend component, and thus the top-level span of the collective Search Service spans is referred to as an orphan span.

## Transactions

![DON%20T%20Add%20content%20to%20this%20FINAL%20Draft%20Tracing%20for%20/Anatomy-of-transaction.png](DON%20T%20Add%20content%20to%20this%20FINAL%20Draft%20Tracing%20for%20/Anatomy-of-transaction.png)

Traces in Sentry are segmented into pieces of **spans** called **transactions**. When instrumenting the application with tracing, collected spans are grouped within an encompassing top-level span called the **transaction span**. This notion of a transaction is specific to Sentry.

## Clock Skew

If you are collecting transactions from more than a single machine, you will likely encounter **clock skew**. When collecting and comparing transaction events that are gathered from different devices, you may observe timestamps that do not align or events in a trace that don't share a time history. Sentry does not attempt to correct the timestamps in your events. The timestamps displayed in Sentry for transactions and each span retain the original values reported by your application/hosting environment.

While you can reduce clock skew by utilizing Network Time Protocol (NTP) or your cloud provider's clock synchronization services, you may still notice small drifts in your data, as synchronizing clocks on small intervals is challenging.

## Sampling Transactions

When you enable sampling for APM events in Sentry, you choose a percentage of collected transactions to send to sentry. For example, if you had an endpoint that received 1000 requests per minute, a sampling rate of 0.25 would result in 250 transactions (25%) being sent to Sentry.

Sampling enables you to collect traces on a subset of your traffic and extrapolate to the total volume. Furthermore, enabling sampling allows you to control the volume of data you send to Sentry and lets you better manage your costs. If you don't have a good understanding of what sampling rate to choose, we recommend you start low and gradually increase the sampling rate as you learn more about your traffic patterns and volume.

When you have multiple projects collecting APM data, Sentry utilizes 'head-based' sampling to ensure that once a sampling decision has been made, that decision is propagated to each application or project involved in the transaction. If your applications have multiple entry points, you should aim to choose consistent sampling rates. Choosing different sampling rates can bias your results. Sentry does not support 'tail-based' sampling at this time.

If you enable APM collection for a large portion of your traffic, you may exceed your organization's [Quotas and Rate Limits](https://docs.sentry.io/accounts/quotas/).

## Setting Up Tracing

[ALERT BOX: Supported SDKs:

- JavaScript Browser
- Node.js
- Python version ≥ 0.11.2 ]

Getting started with Sentry's APM features is a three step process. If you've already created a Sentry account and installed an SDK, skip to step 2a:

1. [Sign up for an account](https://sentry.io/signup/)
2. [Install your SDK](https://docs.sentry.io/error-reporting/quickstart/?platform=browser#pick-a-client-integration)

    2a. Add APM integration

        code snippet for customers to get started with APM

    2b. Configure instrumentation, etc.

3. [Configure](https://docs.sentry.io/error-reporting/quickstart/?platform=browser#configure-the-sdk) SDK

### Python

To send any traces, set the `traces_sample_rate`to a nonzero value. The following configuration will capture 10% of all your transactions:

    import sentry_sdk
        
    sentry_sdk.init("___PUBLIC_DSN___", traces_sample_rate=0.1)

**Automating Traces**

Many integrations for popular frameworks automatically capture traces. If you already have any of the following frameworks set up for error reporting, you will start to see traces immediately:

- All WSGI-based frameworks (Django, Flask, Pyramid, Falcon, Bottle)
- Celery
- Redis Queue (RQ)

Spans are available for the following operations within a transaction:

- Database that uses SQLAlchemy or the Django ORM
- HTTP requests made with `requests` or the stdlib
- Spawned subprocesses

**Manual Tracing**

**Managing Transactions**

Let’s say you want to create a transaction for an expensive operation (for example, `process_item`) and send the result to Sentry:

    import sentry_sdk
    
    while True:
         item = get_from_queue()
    
         with sentry_sdk.start_span(op="task", transaction=item.get_transaction()):
             # process_item may create more spans internally (see next examples)
             process_item(item)

**Adding additional Spans to the Transaction**

The next example is called in the `process_item` function from the code snippet above. Our SDK can determine if there is a current open `transaction` and add all newly created spans as child operations to the `transaction`. Keep in mind; each individual span also needs to be finished; otherwise, it will not show up in the `transaction`.

You can choose the value of `op` and `description`.

    import sentry_sdk
    
    with sentry_sdk.start_span(op="http", description="GET /") as span:
        response = my_custom_http_library.request("GET", "/")
        span.set_tag("http.status_code", response.status_code)
        span.set_data("http.foobarsessionid", get_foobar_sessionid())

### JavaScript

To use our APM features, you need to use a beta release.

    $ npm install @sentry/browser@5.10.0-rc.0
    $ npm install @sentry/apm@5.10.0-rc.0

**Sending Traces**

Tracing resides in the `@sentry/apm` package. You can add it to your `Sentry.init` call:

    import * as Sentry from '@sentry/browser';
    import { Integrations as ApmIntegrations } from '@sentry/apm';
    
    Sentry.init({
      dsn: '___PUBLIC_DSN___',
      integrations: [
        new ApmIntegrations.Tracing(),
      ],
    });

You can pass a lot of different options to tracing, but it comes with reasonable defaults out of the box. You will receive:

- a transaction for every page load
- all XHR/fetch requests as spans

**Using Tracing integration for manual Tracing**

Tracing will create a transaction on page load by default; all spans that are started will be attached to it. Also, tracing will finish the transaction after the default timeout of 500ms of inactivity. Inactivity is if there are no pending XHR/fetch requests. If you want to extend it by adding spans to the transaction, here is an example of how you could profile a React component:

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

**Manual Tracing**

**Managing Transactions**

Let’s say you want to create a transaction for an expensive operation (for example, `processItem`) and send the result to Sentry:

    const transaction = Sentry.getCurrentHub().startSpan({ op: "task",  transaction: item.getTransaction() })
      # processItem may create more spans internally (see next examples)
      processItem(item).then(() => {
        transaction.finish()
      })

**Adding additional Spans to the transaction**

The next example is called in the `processItem` function from the code snippet above. Our SDK can determine if there is a current open `transaction` and add all newly created spans as child operations to the `transaction`. Keep in mind; each individual span also needs to be finished; otherwise, it will not show up in the `transaction`.

    function processItem(item, transaction) {
      const span = transaction.child({ op: "http", description: "GET /" })
    
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

### Node.js

To use our APM features, you need to use a beta release.

    $ npm install @sentry/node@5.10.0-rc.0
    $ npm install @sentry/apm@5.10.0-rc.0

**Sending Traces**

To send any traces, set the `tracesSampleRate`to a nonzero value. The following configuration will capture 10% of all your transactions:

    const Sentry = require("@sentry/node");
    const Apm = require("@sentry/apm"); // This is required since it patches functions on the hub
    
    Sentry.init({
      dsn: "___PUBLIC_DSN___",
      tracesSampleRate: 0.1
    });

**Automating Traces**

It’s possible to add tracing to all popular frameworks; however, we provide pre-written handlers only for Express.js.

    const Sentry = require("@sentry/node");
    const express = require("express");
    const app = express();
    
    // RequestHandler creates a separate execution-context using domains, so that every transaction/span/breadcrumb has it's own Hub to be attached to
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a tracing for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
    
    // the rest of your app
    
    app.use(Sentry.Handlers.errorHandler());
    app.listen(3000);

The following operations have span capabilities within a transaction:

- HTTP requests made with `request` or `get` calls using native `http` and `https` modules
- Middlewares (Express.js only)

To enable them:

    $ npm install @sentry/integrations@5.8.0-beta.0

    const Sentry = require("@sentry/node");
    const Integrations = require("@sentry/integrations");
    const express = require("express");
    const app = express();
    
    Sentry.init({
      dsn: "___PUBLIC_DSN___",
      tracesSampleRate: 0.1,
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Integrations.Express({ app })
      ],
    });

**Manual Tracing**

**Managing Transactions**

Let’s say you want to create a transaction for an expensive operation (for example,  `processItem`) and send the result to Sentry:

    app.use(function processItems(req, res, next) {
      const item = getFromQueue();
      const transaction = Sentry.getCurrentHub().startSpan({ op: "task",  transaction: item.getTransaction() })
      
      # processItem may create more spans internally (see next examples)
      processItem(item, transaction).then(() => {
        transaction.finish();
        next();
      })
    });

**Adding additional Spans to the transaction**

The next example is called in the `processItem` function from the code snippet above. Our SDK can determine if there is a current open `transaction` and add all newly created spans as child operations to the `transaction`. Keep in mind; each individual span also needs to be finished; otherwise, it will not show up in the `transaction`.

You can choose the value of `op` and `description`.

    function processItem(item, transaction) {
      const span = transaction.child({ op: "http", description: "GET /" })
    
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