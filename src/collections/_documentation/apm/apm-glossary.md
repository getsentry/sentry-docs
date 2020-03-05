---
title: APM Glossary
sidebar_order: 5
---

## Clock Skew

If you are collecting transactions from more than a single machine, you will likely encounter **clock skew**. When collecting and comparing transaction events that are gathered from different devices, you may observe timestamps that do not align or events in a trace that don't share a time history. Sentry does not attempt to correct the timestamps in your events. The timestamps displayed in Sentry for transactions and each span retain the original values reported by your application/hosting environment.

While you can reduce clock skew by utilizing Network Time Protocol (NTP) or your cloud provider's clock synchronization services, you may still notice small drifts in your data, as synchronizing clocks on small intervals is challenging.

## Performance Metrics

As part of APM and transaction data, we’re exposing a few new aggregate metrics to help customers better understand the performance of their applications.

### Duration Percentiles

The average, 75%, 95%, and 99% duration, help guide customers in identifying transactions that are slower than the user’s target SLAs.

Our APM data is sampled, so the percentiles we present only represent the data we have. Because of sampling, data ranges, filters, or a low traffic transaction, we will often have a case where data is directionally correct, but not accurate. For example, the average of one number is that number, but that’s not usually what people expect to see.

This inability to be usefully accurate will happen more often in some columns than others. We can calculate an average with less data than a 95th percentile, but it’ll also vary by row. An index page will always get more traffic than `/settings/country/belgium/tax`.

### Percentage Query

This column shows the % of the entire query that this row represents, so you filter your results with the query and then see how much of the result set a particular transaction represents.

### Requests Per Minute (RPM)

Requests Per Minute is a way to measure throughput. It is the average of all requests bucketed by the minute for the current time window and query string.

## Span

The **span** is the primary building block of a distributed trace, representing an individual unit of work done in a distributed system. It can be the processing of an HTTP request by a server, the querying of a database, or an HTTP call to an external service.

An example of a span that describes a call to an external service:

```json
    {
      "trace_id": "a0fa8803753e40fd8124b21eeb2986b5",
      "parent_span_id": "9c2a6db8c79068a2",
      "span_id": "8c931f4740435fb8",
      "start_timestamp": 1563890702.134,
      "same_process_as_parent": true,
      "description": "http://httpbin.org/base64/aGVsbG8gd29ybGQK GET",
      "tags": { "http.status_code": 200, "status": "ok" },
      "timestamp": "1563890702.934",
      "op": "http",
      "data": {
        "url": "http://httpbin.org/base64/aGVsbG8gd29ybGQK",
        "status_code": 200,
        "reason": "OK",
        "method": "GET"
      }
    }
```

When you initialize and load a Sentry SDK that supports tracing, it will automatically instrument parts of your running application, such as function calls and network operations. Instrumenting a database call could entail these three steps or subroutines:

1. Calling a function to compose a database query
2. Sending a query to a database
3. Receiving and transforming results

Each of these subroutines take some time to perform (no matter how fast they could run). Sentry records these subroutines as a unit of work in the form of **spans**. Sentry can also attach useful information to spans, such as tags, additional contextual data, and a status to indicate if the subroutine failed or not.

Spans can have descendant spans (or child spans). In our earlier example, the three subroutines can be spans within a larger encompassing span (the database call).

Any instrumented span is part of a trace (identified by its trace id, `trace_id`), and each span has its own marker called the `span_id`; a fixed length of alphanumeric characters.

### Hierarchy

Each span can be connected to other spans using a parent-child hierarchy. 

For example, a span called `updateJiraTask` would have child spans like `Check permissions`, `Update Task`, `sql.update`, `send.webhooks`.

Each sub-task span would have an id in the attribute `parent_span_id` id of the `updateJiraTask` span.

### Orphan Spans

Orphan spans refer to spans that exist or are visible, but their parent spans are not visible or are not within Sentry's database. This could imply a bug in the Sentry application. If you're confident about this, please contact support: [support@sentry.io](mailto:support@sentry.io)

Another reason could include that instrumented spans may not make it back to Sentry for processing. As an example, let us refer back to our earlier example of the web application consisting of:

- Frontend (Single-Page Application)
- Backend
- Background Queue
- Notification Job

Instrumented spans in each component are sent back to Sentry for processing. However, a server in the backend component could suffer from network connectivity loss, and the spans may not have made it back to Sentry. This would indicate a "hole" within this specific trace. The collected spans within the Search Service would be descendants of a span (for example, a search service call) within the Backend component, and thus the top-level span of the collective Search Service spans is referred to as an orphan span.

### Properties

Each span has a unique identifier kept in the `span_id` attribute.

Start time and end time are stored in the `start_timestamp` and `timestamp` attributes, respectively. The format is an RFC 3339 / ISO 8601-compatible string or a numeric value with the number of seconds since the UNIX Epoch.

The name of the operation is stored in the “op” parameter. Examples are `http`, `sql.query`, `redis.command`.

Additional data about the operation can be stored in the `data` and `tags` attributes.

## Trace

A trace is a collection of spans that have the same `trace_id` attribute. Traces consist of all spans generated by the distributed system during the processing of the input data. Traces are not explicitly started or finished. The start and end of a trace are defined by the transactions and spans participating in the trace.

Traces that start with the same set of API endpoint calls can potentially differ in terms of what code paths were executed. For example, an initial trace may result in a cache miss at the Cache Service, and a subsequent trace may include more information instrumented at the Cache Service. Although these two traces are similar, they are not identical.

### Propagation

Processing of the input data in the distributed environment means that an arbitrary number of the systems/microservices can be involved.

To connect all the spans that were created during the processing of the input data, we need to be able to propagate the basic identifier. By forwarding `trace_id` and `parent_span_id` as data travels through various applications in a microservice ecosystem, we can reconstruct data flows later.

Trace metadata is propagated through http headers that are included in the http request to the external system.

## Transaction

There already was a concept of transaction in the Sentry SDKs before we started with APM.

Transaction is an event attribute that provides initial context to the error report. This makes it possible for the error to be linked to a specific part of the system. An example of the transaction name can be “/users/” which is the name for the endpoint that received the request that failed during the processing.

With APM, the transaction is a parent span to all spans created during the processing of the request in the single server.

Once the request is processed, the transaction is sent together with all child spans to Sentry.

### Event Types

The SDKs already collect a lot of information about the processing of the request. In the case of an error, the SDK attaches the info to the error report to provide rich context of what happened before the error appeared -- information like tags and breadcrumbs.

If the error doesn’t appear during the processing of the request, we discard the context data once processing is complete.

We want to leverage this context collection to build spans, and once a request is finished, we want to send the data to Sentry.

Example of the transaction event type:

```json
{     
  "transaction": "tracing.decode_base64",      
  "type": "transaction",                       
  "event_id": "2975518984734ef49d2f75db4e928ddc",
  "contexts": {
  "trace": {                   
    "parent_span_id": "946edde6ee421874",      
    "trace_id": "a0fa8803753e40fd8124b21eeb2986b5", 
    "span_id": "9c2a6db8c79068a2"   
  }
  },
  "start_timestamp": 1582555570.879015, 
  "timestamp": 1582555570.905113,    
  "spans": [
    {
      "op": "db",
      "description": "SELECT * from countries where id = ?",
      "start_timestamp": 1562681591,
      "timestamp": 1562681591,
      "parent_span_id": "9c2a6db8c79068a2",
      "trace_id": "a0fa8803753e40fd8124b21eeb2986b5",
      "data": {},
      "tags": {}
    }
  ],
}
```
