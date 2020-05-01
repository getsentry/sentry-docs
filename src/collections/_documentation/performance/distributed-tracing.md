---
title: Distributed Tracing
sidebar_order: 2
---

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [performance-feedback@sentry.io](mailto:performance-feedback@sentry.io).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Enabling tracing augments your existing error data by capturing interactions among your software systems. With tracing, Sentry tracks metrics about your software performance, like throughput and latency, as well as displays the impact of errors across multiple systems. In addition, tracing makes Sentry a more complete monitoring solution, helping you both diagnose problems and measure your application's overall health more easily. Tracing in Sentry provides insights such as:

- What occurred for a specific error event or issue
- The conditions that cause bottlenecks or latency issues in your application
- The endpoints or operations that consume the most time

## What is Tracing?

Applications typically consist of interconnected components, which are also called services. As an example, let's look at a modern web application, composed of the following components, separated by network boundaries:

- Front End (Single-Page Application)
- Backend (REST API)
- Task Queue
- Database Server
- Cron Job Scheduler

Each of these components may be written in a different language on a different platform. Each can be instrumented individually using the Sentry SDK to capture error data or crash reports, but that instrumentation doesn't provide the full picture as each piece is considered separately. Tracing allows you to tie all of the data together. 

In our example of a modern web application, tracing means being able to follow a request from the front end to the backend and back, pulling in data from any background tasks or notification jobs a request creates. Not only does this allow you to correlate Sentry error reports, to see how an error in one service may have propagated to another, but this also allows you to gain stronger insights into which services may be having a negative impact on your application's overall performance.

Before learning how to enable tracing in your application, it helps to understand a few key terms and how they relate to one another.

### Traces, Transactions, and Spans

A **trace** represents the record of the entire operation you want to measure or track - like page load, an instance of a user completing some action in your application, or a cron job in your backend. When a trace includes work in multiple services, such as those listed above, it's called a **distributed trace**, because the trace is distributed across those services. To recap, a trace is a record of an operation; a distributed trace is a record of an operation that's distributed across services.

Each trace consists of one or more tree-like structures called **transactions**, the nodes of which are called **spans**. In most cases, each transaction represents a single instance of a service being called, and each span within that transaction represents that service performing a single unit of work, whether calling a function within that service or making a call to a different service.

Because a transaction has a tree structure, top-level spans can themselves be broken down into smaller spans, mirroring the way that one function may call a number of other, smaller functions; this is expressed using the parent-child metaphor, so that every span may be the **parent span** to multiple other spans. Further, since all trees must have a single root, one span always represents the transaction itself, of which all other spans are descendants.

To make all of this more concrete, let's consider our example web app again.

### Example: Investigating Slow Page Load

Suppose your web application is slow to load, and you'd like to know why. A lot has to happen for your app to first get to a usable state: multiple requests to your backend, likely some work - including calls to your database or to outside APis - completed before responses are returned, and processing by the browser to render all of the returned data into something meaningful to the user. So which part of that process is slowing things down?

`[kmclb: In what follows I'm not worrying yet about list formatting/indenting, what's a header, what's italics masquerading as a header, etc. Open to opinions here, and also just note-to-self-ing that it needs to be thought about eventually. FPA: maybe a table? First column, the service and second column, the processing that needs to happen?]`

Let's say, in this simplified example, that when a user loads the app in their browser, the following happens in each service:

  _Browser_

  - 1 request each for HTML, CSS, and JavaScript
  - 1 rendering task, which sets off 2 requests for JSON data

  _Backend_

  - 3 requests to serve static files (the HTML, CSS, and JS)
  - 2 requests for JSON data
    - 1 requires a call to the database 
    - 1 requires a call to an external API and work to process the results before returning them to the front end

  _Database Server_

  - 1 request which requires two queries
    - 1 query to check authentication 
    - 1 query to get data
  
_Note:_ The external API is not listed because it's external to your system, and you can't see inside of it.

In this example, the entire page-loading process, including all of the above, is represented by a single **trace**. That trace would consist of the following **transactions**:

  - 1 browser transaction (for page load)
  - 5 backend transactions (one for each request)
  - 1 database server transaction (for the single DB request)
  
Each transaction would be broken down into **spans** as follows:

  _Browser Page-load Transaction_: 7 spans
  - 1 root span representing the entire page load
  - 1 span each (3 total) for the HTML, CSS, and JS requests
  - 1 span for the rendering task, which itself contains
    - 2 child spans, one for each JSON request
    
Let's pause here to make an important point: Some, though not all, of the browser transaction spans listed have a direct correspondence to backend transactions listed earlier. Specifically, each request _span_ in the browser transaction corresponds to a separate request _transaction_ in the backend. In this situation, when a span in one service gives rise to a transaction in a subsequent service, we call the original span a parent span to _both_ the transaction and its root span.

In our example, every transaction other than the initial browser page-load transaction is the child of a span in another service, which means that every root span other than the browser transaction root has a parent span (albeit in a different service). In a fully-instrumented system (one in which every service has tracing enabled) this pattern will always hold true: _the only parentless span will be the root of the initial transaction, and of the remaining parented spans, every one will live in the same service as its parent, except for the root spans, whose parents will live in a previous service_. This is worth noting because it is the one way in which transactions are not perfect trees - their roots can (and mostly do) have parents.

Now, for the sake of completeness, back to our spans:

  _Backend HTML/CSS/JS Request Transactions_: 2 spans each `[kmclb: if transactions can have no children, this might be only 1 span, the root]`
  - 1 root span representing the entire request (child of a browser span)
  - 1 span for serving the static file

  _Backend Request with DB Call Transaction_: 2 spans
  - 1 root span representing the entire request (child of a browser span)
  - 1 span for querying the database (parent of the database server transaction)

  _Backend Request with API Call Transaction_: 3 spans
  - 1 root span representing the entire request (child of a browser span)
  - 1 span for the API request (unlike with the DB call, _not_ a parent span, since the API is external to your system)
  - 1 span for processing the API data

  _Database Server Request Transaction_: 3 spans
  - 1 root span representing the entire request (child of the backend span above)
  - 1 span for the authentication query
  - 1 span for the query retrieving data
    
To wrap up the example, after instrumenting all of your services, you might discover that - for some reason - it's the auth query in your database server that is making things slow, accounting for more than half of the time it takes for your entire page load process to complete. Tracing can't tell you _why_ that's happening, but at least now you know where to look!

`[kmclb: this def needs an illustration (or multiple illustrations) - can we maybe just adjust the current one for this example, or should we use one with more specifics? Current diagram: FPA: am asking Sami in Creative, who made the original drawing]`
[{% asset performance/tracing-diagram.png alt="Diagram illustrating how a trace is composed of multiple transactions." %}]({% asset performance/tracing-diagram.png @path %})
  
### Further Examples

This section addresses a few more examples of tracing, broken down into transactions and spans:

_Note:_ Starred spans represent spans that are the parent of a later transaction (and its root span).

**Measuring Time for E-Commerce**

If your application involves e-commerce, you likely want to measure the time between a user clicking "Submit Order" and the order confirmation appearing, including tracking the submitting of the charge to the payment processor and the sending of an order confirmation email. That entire process is one trace, and typically you'd have transactions for:

  - The browser's full process (example spans: XHR request to backend\*, rendering confirmation screen)
  - Your backend's processing of that request (example spans: function call to compute total, DB call to store order*, API call to payment processor, queuing of email confirmation\*)
  - Your database's work updating the customer's order history (example spans: individual SQL queries)
  - The queued task of sending the email (example spans: function call to populate email template, API call to email-sending service)
  
**Checking Backend Transactions**

If your backend periodically polls for data from an external service, processes it, caches it, and then forwards it to an internal service, each instance of this happening is a trace, and you'd typically have transactions for:

- The cron job that completes the entire process (example spans: API call to external service, processing function, call to caching service\*, API call to internal service\*)
- The work done in your caching service (example spans: checking cache for existing data, storing new data in cache)
- Your internal service's processing of the request (example spans: anything that service might do to handle the request)
  
### Tracing Data Model

`[kmclb: do we want to format this in a quote-y kind of way? FPA: like a Note or Alert. I think it would be kind of cool.]`
"Show me your flowchart and conceal your tables, and I shall continue to be mystified. Show me your tables, and I won't usually need your flowchart; it'll be obvious." -- [Fred Brooks](https://en.wikipedia.org/wiki/Fred_Brooks), The Mythical Man Month (1975)

While the theory is interesting, traces, transactions, and spans are ultimately defined by what's in them, and the relationship among them is defined by how links between them are recorded.`[FPA: this sentence is confusing to me. Do we mean. "Traces, transactions, and spans are defined by what's in them. The relationships among the three are defined by the manner in which the links between them are recorded." or something like that?]`

**Traces**

Traces are not an entity in and of themselves. Rather, a trace is defined as the collection of all transactions that share a `trace_id` value. 

**Transactions**

Transactions share most of their properties (start and end time, tags, and so forth) with their root spans, so the same options are available (see below) `[FPA: suggest we say "so the same options described <link> are available]` and setting them in either place is equivalent. Transactions also have two additional properties not included in spans:

`[kmclb: anything missing from this list?]`

- `transaction_name`: used in the UI to identify the transaction
- `root_span`: pointer to the root of the transactions span tree

`[kmclb: how the heck do you get less-than or greater-than symbols to show up in code snippets? FPA: I usually just enclose in backticks, but it can be tricky - you can force also with html <code></code> tags]`
Common examples of `transaction_name` values include endpoint paths (like `/store/checkout/` or `api/v2/users/\<user_id\>/`) for backend request transactions, task names (like `data.cleanup.delete_inactive_users`) for cron job transactions, and URLs (like `https://docs.sentry.io/performance/distributed-tracing/`) for page-load transactions.

**Spans**

The majority of the data in a transaction resides in the individual spans the transaction contains. Span data includes:

`[kmclb: the list below isn't currently ground truth (quite), but the ground is potentially shifting. Will update once API is settled.]`

  - `parent_span_id`: ties the span to its parent span
  - `op`: short code identifying the type of operation the span is measuring
  - `start_timestamp`: when the span was opened
  - `end_timestamp`: when the span was closed
  - `description`: longer description of the span's operation, often specific to that instance (optional)
  - `status`: short code indicating operation's status (optional)
  - `tags`: key-value pairs holding additional data about the span (optional)
  - `data`: arbitrarily-structured additional data about the span (optional)

An example use of the `op` and `description` properties together is `op: sql.query` and `description: SELECT * FROM users WHERE last_active < DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)`. The `status` property is often used to indicate the success or failure of the span's operation, or for a response code in the case of HTTP requests. Finally, `tags` and `data` allow you attach further contextual information to the span, such as `function: middleware.auth.is_authenticated` for a function call or `request: {url: ..., headers: ... , body: ...}` for an HTTP request.
  
### Good to Know (needs a better name) `[FPA: Tracing Relationships]`

A few more important points about traces, transactions, and spans, and the way they relate to one another:

**Trace Duration**: Because a trace is a collection of transactions, traces don't have their own start and end times. Instead, a trace begins when its earliest transaction starts, and ends when its latest transaction ends. As a result, you can't explicitly start or end a trace, you can only start and end the transactions in that trace.

**Async Transactions**: Because of the possibility of asynchronous processes, child transactions may outlive the transactions containing their parent spans, sometimes by many orders of magnitude. For example, if a backend API call sets off a long-running processing task, then immediately returns a response, the backend transaction will finish (and its data will be sent to Sentry) long before the async task transaction does. Asynchronicity also means that the order in which transactions are sent to (and received by) Sentry is not dependent on the order in which they were created. (Because of the variability of transmission times, order of receipt for transactions in the same trace is also only somewhat correlated with order of completion.)

**Orphan Transactions**: In theory, in a fully instrumented system, each trace should contain only one transaction and one span (the transaction's root) without a parent, namely the transaction in the originating service. However, in practice, you may not have tracing enabled in every one of your services, or an instrumented service may fail to report a transaction due to network disruption or other unforeseen circumstances. When this happens, you may have gaps in your trace hierarchy. Specifically, you may see transactions partway through the trace whose parent spans haven't been recorded as part of any known transactions. Such non-originating, parentless transactions are called **orphan transactions**.

`[kmclb: depending on how we end up formatting this, may need to make this one paragraph]`
**Clock Skew**: If you are collecting transactions from multiple machines, you will likely encounter **clock skew**, where timestamps in one transaction don't align with timestamps in another. For example, if your backend makes a database call, the backend transaction logically should start before the database transaction does. But if the system time on the two machines (hosting your backend and database, respectively) aren't synced to common standard, it's possible that won't be the case. It's also possible for the ordering to be correct, but for the two recorded timeframes to not line up in a way that accurately reflects what actually happened.

Because there is no way for Sentry to judge either the relative or absolute accuracy of your timestamps, it does not attempt to correct or modify them in any way. And while you can reduce clock skew by using Network Time Protocol (NTP) or your cloud provider's clock synchronization services, you may still notice small drifts in your data, as synchronizing clocks on small intervals is challenging.

**Nesting Spans**: Though our examples above had four levels in their hierarchy (trace, transaction, span, child span) there's no set limit to how deep the nesting of spans can go. There are, however, practical limits: transaction payloads sent to Sentry have a maximum allowed size (currently `[kmclb: find out what this is]`), as there's a balance to be struck between your data's granularity and its usability. 

**Zero-duration Spans**: It's possible for a span to have equal start and end times, and therefore be recorded as taking no time. This can occur either because the span is being used as a marker (such as is done in [the browser's Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark)) or because the amount of time the operation took is less than the measurement resolution (which will vary by service).

**What We Send**: Individual spans aren't sent to Sentry. Rather, those spans are attached to their containing transaction, and the transaction is sent as one unit. This means that no span data will be recorded by Sentry's servers until the transaction to which they belong is closed and dispatched. 

`[kmclb: STOP READING AT THIS POINT. Or, keep reding if you want, but I haven't worked on anything below here in a concerted way yet, so for the purposes of this initial feedback session, I'm really just looking for comments on ^^^^^^^^^] FPA: got it :)`

## Data Sampling

**When collecting traces, we strongly recommend sampling your data.**

When you enable sampling for transaction events in Sentry, you choose a percentage of collected transactions to send to Sentry. For example, if you had an endpoint that received 1000 requests per minute, a sampling rate of 0.25 would result in 250 transactions (25%) being sent to Sentry.

Sampling enables you to collect traces on a subset of your traffic and extrapolate to the total volume. Furthermore, **enabling sampling allows you to control the volume of data you send to Sentry and lets you better manage your costs**. If you don't have a good understanding of what sampling rate to choose, we recommend you start with a low value and gradually increase the sampling rate as you learn more about your traffic patterns and volume.

When you have multiple projects collecting transaction events, Sentry utilizes "head-based" sampling to ensure that once a sampling decision has been made at the beginning of the trace (typically the initial transaction), that decision is propagated to each service or project involved in the trace. If your services have multiple entry points, you should aim to choose a consistent sampling rate for each, as choosing different sampling rates can bias your results. Sentry does not support "tail-based" sampling at this time.

If you enable Performance collection for a large portion of your traffic, you may exceed your organization's [Quotas and Rate Limits]({%- link _documentation/accounts/quotas/index.md -%}).

## Viewing Trace Data

You can see a list of transaction events by clicking on the "Transactions" pre-built query in [Discover]({%- link _documentation/performance/discover/index.md -%}), or by using a search condition `event.type:transaction` in the [Discover Query Builder]({%- link _documentation/performance/discover/query-builder.md -%}) view.

`[kmclb: I think we should have a section here on searching, which would mention that transactions (but not spans) are searchable, and what data one can use to search. Should also probably link to the main search docs.]`

### Performance Metrics

`[kmclb: we don't actually tell you *how* to do this...]`
Some aggregate functions can be applied to transaction events to help you better understand the performance characteristics of your applications.

**Duration Percentiles**


You can aggregate transaction durations using the following functions:
- average
- 75%, 95%, and 99% duration percentiles

One use case for tracking these statistics is to help you identify transactions that are slower than your organization's target SLAs.

A word of caution when looking at averages and percentiles: In most cases, you'll want to set up tracing so that only a fraction of possible traces are actually sent to Sentry, to avoid overwhelming your system. `[kmclb: include a link to sampling section]` Further, you may want to filter your transaction data by date or other factors, or you may be tracing a relatively uncommon operation. For all of these reasons, you may end up with average and percentile data that is directionally correct, but not accurate. (To use the most extreme case as an example, if only a single transaction matches your filters, you can still compute an "average" duration, even though that's clearly not what is usually meant by "average.")

`[kmclb: "We can calculate an average with less data than a 95th percentile" - is there some threshold below which we won't do the calculation?]`

The problem of small sample size (and the resulting inability to be usefully accurate) will happen more often in some columns than others. `[kmclb: which ones?]` We can calculate an average with less data than it takes to calculate the 95th percentile, but it’ll also vary by row. (For example, `/settings/` will always get more traffic than `/settings/country/belgium/tax`.) 

**Requests Per Minute (RPM)**

Requests Per Minute is a way to measure throughput. It is the average of all request durations, bucketed by the minute `[kmclb: start time or end time?]` for the current time window and query string.


### Transaction Detail View

When you open a transaction event in Discover (by clicking on the ), you'll see the **span view** at the top of the page. Other information the SDK captured as part of the transaction event, such as the transaction's tags and automatically collected breadcrumbs, is displayed underneath and to the right of the span view.

[{% asset performance/discover-span.png alt="Discover span showing the map of the transactions (aka minimap) and the black dashed handlebars for adjusting the window selection." %}]({% asset performance/discover-span.png @path %})

#### Using the Span View

The span view is a split view where the left-hand side shows the transaction's span tree, and the right-hand side represents each span as a colored rectangle. Within the tree view, Sentry identifies spans by their `op` and `description` values. If a span doesn't have a description, Sentry uses the span's id as a fallback. The first span listed is always the transaction's root span, from which all other spans in the transaction descend.

At the top of the span view is a minimap, which shows which specific portion of the transaction you're viewing.

**Zooming In on a Transaction**

As shown in the Discover span screenshot above, you can click and drag your mouse cursor across the minimap (top of the span view). You can also adjust the window selection by dragging the handlebars (black dashed lines). 

**Missing Instrumentation**

Sentry may indicate that gaps between spans are "Missing Instrumentation." This message could mean that the SDK was unable to capture or instrument any spans within this gap automatically. It may require you to instrument the gap [manually](#setting-up-tracing).

**Viewing Span Details**

Click on a row to expand the details of the span. From here, you can see all attached properties, such as **tags** and **data**.

[{% asset performance/span-detail-view.png alt="Span detail view shows the span id, trace id, parent span id, and other data such as tags." %}]({% asset performance/span-detail-view.png @path %})

**Search by Trace ID**

You can search using `trace id` by expanding any of the span details and clicking on "Search by Trace".

You need **project permissions for each project** to see all the transactions within a trace. Each transaction in a trace is likely a part of a different project. If you don't have project permissions, some transactions may not display as part of a trace.

**Traversing to Child Transactions**

Child transactions are shown based on your project permissions -- which are necessary to viewing transaction events. To check project permissions, navigate to **Settings >> [your organization] >> [your project] >> General**.

Some spans within a transaction may be the parent of another transaction. When you expand the span details for such spans, you'll see the "View Child" button, which, when clicked, will lead to the child transaction's details view.

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

To send traces, set the `traces_sample_rate` to a nonzero value. The following configuration will capture 25% of your transactions:

```python
import sentry_sdk

sentry_sdk.init(
    "___PUBLIC_DSN___", 
    traces_sample_rate = 0.25
)
```

**Automatic Instrumentation**

Many integrations for popular frameworks automatically capture traces. If you already have any of the following frameworks set up for Sentry error reporting, you will start to see traces immediately:

- All WSGI-based web frameworks (Django, Flask, Pyramid, Falcon, Bottle)
- Celery
- AIOHTTP web apps
- Redis Queue (RQ)

Spans are instrumented for the following operations within a transaction:

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

To manually instrument certain regions of your code, you can create a transaction to capture them.

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

The next example contains the implementation of the hypothetical `process_item` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add all newly created spans as child operations to that transaction. Keep in mind that each individual span also needs to be manually finished; otherwise, spans will not show up in the transaction.

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
  tracesSampleRate: 0.25,
});
```

To send traces, you will need to set the `tracesSampleRate` to a nonzero value. The configuration above will capture 25% of your transactions.

You can pass many different options to the Tracing integration (as an object of the form `{optionName: value}`), but it comes with reasonable defaults out of the box. It will automatically capture a trace for every page load. Within that transaction, spans are instrumented for the following operations:

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

`[kmclb: does this only apply to web servers, or all services which accept incoming requests?]`
*NOTE:* You need to make sure your web server CORS is configured to allow the `sentry-trace` header. The configuration might look like `"Access-Control-Allow-Headers: sentry-trace"`, but this depends a lot on your set up. If you do not whitelist the `sentry-trace` header, the request might be blocked.

**Using Tracing Integration for Manual Instrumentation**

The tracing integration will create a transaction on page load by default; all spans that are created will be attached to it. Also, the integration will finish the transaction after the default timeout of 500ms of inactivity. The page is considered inactive if there are no pending XHR/fetch requests. If you want to extend the transaction's lifetime, you can do so by adding more spans to it. The following is an example of how you could profile a React component:

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

This example will send a transaction `shopCheckout` to Sentry, containing all outgoing requests that happen in `validateShoppingCartOnServer` as spans. The transaction will also contain a `task` span that measures how long `processAndValidateShoppingCart` took. Finally, the call to `ApmIntegrations.Tracing.finishIdleTransaction()` will finish the transaction and send it to Sentry. Calling this is optional; if it is not called, the integration will automatically send the transaction itself after the defined `idleTimeout` (default 500ms).

**What is an activity?**

The concept of an activity only exists in the `Tracing` integration in JavaScript Browser. It's a helper that tells the integration how long it should keep the `IdleTransaction` alive. An activity can be pushed and popped. Once all activities of an `IdleTransaction` have been popped, the `IdleTransaction` will be sent to Sentry.

**Manual Transactions**

To manually instrument a certain region of your code, you can create a transaction to capture it.
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

The next example contains the implementation of the hypothetical `processItem ` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add to it all newly created spans as child operations. Keep in mind that each individual span needs to be manually finished; otherwise, that span will not show up in the transaction.

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

It’s possible to add tracing to all popular frameworks; however, we provide pre-written handlers only for Express.js.

```javascript
const Sentry = require("@sentry/node");
const Apm = require("@sentry/apm");
const express = require("express");
const app = express();

Sentry.init({
  dsn: "___PUBLIC_DSN___",
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

To enable this:

```javascript
const Sentry = require("@sentry/node");
const Apm = require("@sentry/apm");
const express = require("express");
const app = express();

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  tracesSampleRate: 0.25,
  integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Apm.Integrations.Express({ app })
  ],
});
```

**Manual Transactions**

To manually instrument a certain region of your code, you can create a transaction to capture it.

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

The next example contains the implementation of the hypothetical `processItem ` function called from the code snippet in the previous section. Our SDK can determine if there is currently an open transaction and add to it all newly created spans as child operations. Keep in mind that each individual span needs to be manually finished; otherwise, that span will not show up in the transaction.

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
