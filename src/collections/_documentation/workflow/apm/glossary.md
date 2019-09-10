---
title: APM Glossary
sidebar_order: 2
---

## Span
The **span** is the primary building block of a distributed trace, representing an individual unit of work done in a distributed system.

It can be the processing of an HTTP request by a server, the querying of a database or an HTTP call to an external service.

An example of a span that describes a call to the external service:

```json

    {
      "trace_id": "a0fa8803753e40fd8124b21eeb2986b5",
      "parent_span_id": "9c2a6db8c79068a2",
      "span_id": "8c931f4740435fb8",
      "start_timestamp": 1563890702.134,
      "same_process_as_parent": true,
      "description": "http://httpbin.org/base64/aGVsbG8gd29ybGQK GET",
      "tags": { "http.status_code": 200, "error": false },
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

### Properties
Each span has a unique identifier kept in the `span_id` attribute.

Start time and end time that are stored in the `start_timestamp` and `timestamp`. (End time is captured in the attribute timestamp and not the end_timestamp for now because of compatibility reasons.)

Name of the operation is stored in the “op” parameter. Examples are `http`, `sql.query`, `redis.command`. 

Additional data about the operation can be stored in the  `data` and `tags` attributes.

### Hierarchy
Each span can be connected to other spans using a parent-child hierarchy. (There is also “Follows from” relationship that will be explained later on)

For example a span called `updateJiraTask` would have child spans like `Check permissions`, `Update Task`, `sql.update`, `send.webhooks`.

Each such a sub task would have in the attribute `parent_span_id` id of the “updateTask” span.

## Transaction
There already was a concept of the transaction in the Sentry SDKs before we started with APM.

Transaction is an event attribute that should provide initial context to the error report so that the error can be easily linked to a specific part of the system. An example of the transaction name can be "/users/<username>/" which is the name for the endpoint that received the request that failed during the processing.

With the APM the transaction is a parent span to all the spans that are created during the processing of the request in the single server.

Once the request is processed the transaction is sent together with all child spans to Sentry.

### Event Types
For the initial version we want to reuse as much existing code as it is possible.

SDKs already collect a lot of information about the processing of the request and in case of error SDK attaches the info to the error report to provide rich context of what happened before the error appeared. (Information like tags and breadcrumbs).

If the error doesn’t appear during the processing of the request we discard the context data once the processing of the request is finished.

We want to leverage this context collection to build spans and once a request is finished we want to send the data to the sentry.

We will reuse and extend the existing Sentry event format, introducing a new type of the event for transactions.

With the next phases of the APM project we expect that these changes will evolve and we will be able to distribute the spans separately to a different endpoint at Sentry.

Example of the transaction event type:

```json
    {
      "start_timestamp": "2019-06-14T14:01:40Z",     
      "transaction": "tracing.decode_base64",      <----- NAME OF THE TRANSACTION
      "type": "transaction",                       <----- TYPE OF THE EVENT
      "event_id": "2975518984734ef49d2f75db4e928ddc",
      "contexts": {
    	"trace": {                   
    		"parent_span_id": "946edde6ee421874",      <----- SPAN RELATED
    		"trace_id": "a0fa8803753e40fd8124b21eeb2986b5", <----- SPAN RELATED
    		"span_id": "9c2a6db8c79068a2"   <----- SPAN RELATED
    	}
      },
      "timestamp": "2019-06-14T14:01:41Z",    <----- SPAN RELATED - end time
      "server_name": "apfeltasche.local",
      "extra": {
    	"sys.argv": ["/Users/untitaker/projects/sentry-python/.venv/bin/flask","worker"]
      },
      "modules": {
    	"more-itertools": "5.0.0",
    	"six": "1.12.0",
    	"funcsigs": "1.0.2"
      },
      "platform": "python",
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
      "breadcrumbs": [
    	  {
    		"category": "httplib",
    	  	"data": {
    		  	"url": "http://httpbin.org/base64/aGVsbG8gd29ybGQK",
    		  	"status_code": 200,
    	  		"reason": "OK",
    	  		"method": "GET"
    		  },
    		  "type": "http",
    		  "timestamp": "2019-06-14T12:01:41Z"
    	  }
      ],
      "sdk": {
    	"version": "0.9.0",
    	"name": "sentry.python",
    	"packages": [{ "version": "0.9.0", "name": "pypi:sentry-sdk" }],
    	"integrations": ["argv"]
      }
    }
```

## Trace
A trace is a collection of spans that have the same `trace_id` attribute. Traces consist of all the spans that were generated by the distributed system during the processing of the input data. Traces are not explicitly started or finished. The start and end of a trace is defined by the transactions and spans participating in the trace.

### Propagation
Processing of the input data in the distributed environment means that arbitrary number of the systems/microservices can be involved.

To connect all the spans that were created during the processing of the input data we need to be able to propagate the basic identifier. By forwarding `trace_id` and `parent_span_id` as data travels through various applications in a microservice ecosystem we can reconstruct data flows later.

Trace metadata is propagated through http headers that are included in the http request to external system.

## Performance Metric Defintions
As part of APM and transaction data we're exposing a few new aggregate metrics to help customers better understand how the performance of their applications.

### RPM
Requests Per Minute is a way to measure throughput. It is the average of all requests bucketed by minute for the current time window and query string.

### Duration Percentiles
The Average, 75% and 95% duration help guide customers in identifying transactions that are slower than the user's target SLAs.

Our APM data is sampled so the percentiles we present only represent the data we have. Because of sampling, data ranges, and filters or a low traffic transaction, we will often have a case where data is directionally correct, but not accurate.  e.g. The average of one number is that number, but that's not usually what people expect to see.

This inability to be usefully accurate will happen more often in some columns than others (we can calculate an average with less data than a 95th percentile), but it'll also vary by row (an index page will always get more traffic than /settings/country/belgium/tax).

To signal this lack of accuracy to the user we'll show a **warning** to users when:

- If there are fewer than 5 data-points show "n/a" in the average column
- If there are fewer than 20 data-points show "n/a" in the 75th percentile
- If there are fewer than 100 data-points show "n/a" in the 95th percentile

The UI will highlight any warnings visually and let the user know that they should increase their sampling rate or make a less precise query.

In addition to warnings some fields are literally meaningless at certain cardinalities, e.g. if you have 1 data-point, the 95th percentile means nothing.

- If the RPM <1 show "<1"
- If there are less than 4 data-points show "n/a" in the 75th percentile
- If there are less than 20 data-points show "n/a" in the 95th percentile

### Percentage Query
This column shows the % of the entire query that this row represents so you filter your results with the query and then see how much of the result set a particular transaction represents.
