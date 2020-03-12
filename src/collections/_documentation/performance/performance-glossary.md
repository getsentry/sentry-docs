---
title: Performance Glossary
sidebar_order: 5
---

## Clock Skew

If you are collecting transactions from multiple machines, you will likely encounter **clock skew**. When collecting and comparing transaction events that are gathered from different devices, you may observe timestamps that do not align or events in a trace that don't share a time history. Sentry does not attempt to correct the timestamps in your events. The timestamps displayed in Sentry for transactions and each span retain the original values reported by your application/hosting environment.

While you can reduce clock skew by utilizing Network Time Protocol (NTP) or your cloud provider's clock synchronization services, you may still notice small drifts in your data, as synchronizing clocks on small intervals is challenging.

## Performance Metrics

Some aggregate functions can be applied to transaction events to help you better understand the performance characteristics of your applications.

### Duration Percentiles

You can aggregate transaction durations using the following aggregate functions:
- average
- 75%, 95%, and 99% duration percentiles

One use-case for using these statistics is to help you identify transactions that are slower than your organization's target SLAs.

Transaction events are sampled. As a result, the percentiles presented within Sentry represent only the data received. Because of sampling, data ranges, filters, or low volume of transactions, we will often have a case where data is directionally correct, but not accurate. For example, the average of one number is that number, but that’s not usually what you may expect to see.

This inability to be usefully accurate will happen more often in some columns than others. We can calculate an average with less data than a 95th percentile, but it’ll also vary by row. An index page will always get more traffic than `/settings/country/belgium/tax`.

### Requests Per Minute (RPM)

Requests Per Minute is a way to measure throughput. It is the average of all requests bucketed by the minute for the current time window and query string.

## Span

The **span** is the primary building block of a distributed trace, representing an individual unit of work done in a distributed system. It may represent the processing of an HTTP request by a server, the querying of a database, or an HTTP call to an external service.

When you initialize and load a Sentry SDK that supports tracing, it will automatically instrument parts of your running application, such as function calls and network operations. Instrumenting a database call could entail these three steps or subroutines:

1. Calling a function to compose a database query
2. Sending a query to a database
3. Receiving and transforming results

Each of these subroutines takes some time to perform (no matter how fast they could run). Sentry records these subroutines as a unit of work in the form of **spans**. Sentry can also attach useful information to spans, such as tags, additional contextual data, and a status to indicate if the subroutine failed or not.

Spans can have descendant spans (or child spans). In our earlier example, the three subroutines can be spans within a larger encompassing span (the database call).

Any instrumented span is part of a trace (identified by its trace id, `trace_id`), and each span has its own marker called the `span_id`, a fixed length of alphanumeric characters.

An example of a span that describes a call to an external service:

```javascript
// updateJiraTask
{
  "trace_id": "a8233eb845154a2cae4712b28375d08d",
  "parent_span_id": "ba99c37bfb30f860",
  "span_id": "92ce7ea47d5b8a45",
  "start_timestamp": 1583868931.940406,
  "same_process_as_parent": true,
  "description": "updateJiraTask",
  "tags": { "status": "ok" },
  "timestamp": 1583868932.060615,
  "op": "jira",
  "data": {}
}

// sql.update - a child span of updateJiraTask
{
  "trace_id": "a8233eb845154a2cae4712b28375d08d",
  "parent_span_id": "92ce7ea47d5b8a45",
  "span_id": "a88e33dab5b745b9",
  "start_timestamp": 1583868931.953386,
  "same_process_as_parent": true,
  "description": "sql.update - SELECT * FROM jira_table",
  "tags": { "status": "ok" },
  "timestamp": 1583868932.03692,
  "op": "db",
  "data": {}
}
```

### Hierarchy

Each span can be connected to other spans using a parent-child hierarchy. 

For example, a span called `updateJiraTask` would have child spans like `Check permissions`, `Update Task`, `sql.update`, `send.webhooks`.

Each sub-task span would have `parent_span_id` equal to the id of the `updateJiraTask` span.

### Orphan Spans

Orphan spans are spans that lack visible parent spans within Sentry's database. This could imply a bug in the Sentry application. If you're confident about this, please contact support: [support@sentry.io](mailto:support@sentry.io)

Another reason could include that instrumented spans may not make it back to Sentry for processing. As an example, let us consider a web application consisting of:

- Frontend (Single-Page Application)
- Backend
- Background Queue
- Notification Job

Instrumented spans in each component are sent back to Sentry for processing. However, a server in the backend component could suffer from network connectivity loss, and the spans may not have made it back to Sentry. This would indicate a "hole" within this specific trace. The collected spans within the Background Queue would be descendants of a span (for example, a queue service call) within the Backend component, and thus the top-level span of the collective Background Queue spans is referred to as an orphan span.

### Properties

Each span has a unique identifier kept in the `span_id` attribute.

Start time and end time are stored in the `start_timestamp` and `timestamp` attributes, respectively. The format is an RFC 3339 / ISO 8601-compatible string or a numeric value with the number of seconds since the UNIX Epoch.

The name of the operation is stored in the `op` property. Example `op` values are `http`, `sql.query`, `redis.command`.

Additional data about the operation can be stored in the `data` and `tags` attributes.

## Trace

A trace is a collection of transactions that have the same `trace_id` attribute. Traces consist of all transactions generated by the distributed system during the processing of the input data. Traces are not explicitly started or finished. The start and end of a trace are defined by the transactions and spans participating in the trace.

Traces that start with the same set of API endpoint calls can potentially differ in terms of what code paths were executed. For example, an initial trace may result in a cache miss at the Cache Service, and a subsequent trace may include more information instrumented at the Cache Service. Although these two traces are similar, they are not identical.

### Propagation

Processing of the input data in the distributed environment means that an arbitrary number of the systems/microservices can be involved.

To connect all the spans that were created during the processing of the input data, we need to be able to propagate the basic identifier. By forwarding `trace_id` and `parent_span_id` as data travels through various applications in a microservice ecosystem, we can reconstruct data flows later.

Trace metadata is propagated through HTTP headers that are included in the HTTP request to the external system.

## Transaction

Transaction is an event attribute that provides initial context to the error report. This makes it possible for the error to be linked to a specific part of the system. An example of the transaction name can be “/users/” which is the name for the endpoint that received the request that failed during the processing.

With tracing, the transaction is a parent span to all spans created during the processing of the request in the single server.

Once the request is processed, the transaction is sent together with all child spans to Sentry.
