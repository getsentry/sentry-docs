---
title: APM
sidebar_order: 0
---

Sentry's APM (Application Performance Management) features provide users with a view of the general health of their system. The APM tools will give insight on an application's low performance, even when there aren't errors.

{% include components/alert.html
title="Note"
content="Our inital rollout of APM includes our Python SDK. If you have version >= 0.11.2 the APM features are available to you. "
level="info"
%}

## Glossary
If you're unfamiliar with the concepts and terms associated with APM, feel free to take a look at our [Glossary]({%- link _documentation/workflow/apm/glossary.md -%}). 

## Getting started

### Sending Traces
To send any traces, set the `traces_sample_rate`
to a nonzero value. The following configuration will capture 10% of
all your transactions:

```python
import sentry_sdk
    
sentry_sdk.init("___PUBLIC_DSN___", traces_sample_rate=0.1)
```

### Automating Traces
Many integrations for popular frameworks automatically capture traces. If you already have any of the following frameworks set up for error reporting, you will start to see traces immediately:

- All WSGI-based frameworks (Django, Flask, Pyramid, Falcon, Bottle)
- Celery
- Redis Queue (RQ)

We are creating spans for the following operations within a transaction:

- Database that uses SQLAlchemy or the Django ORM
- HTTP requests are made with `requests` or the stdlib
- Spawned subprocesses

### Manual Tracing

#### Managing Transactions

Let's say you want to create your a transaction for a expensive operation `process_item`
and send the result to Sentry:

```python
import sentry_sdk

while True:
     item = get_from_queue()

     with sentry_sdk.start_span(op="task", transaction=item.get_transaction()):
         # process_item may create more spans internally (see next examples)
         process_item(item)
```

#### Adding additional Spans to the transaction

Consider the next example is somewhere called in the `process_item` function from before.
Our SDK is able to determine if there is a current open `transaction` and add all newly
created spans as child operations to the transaction. Keep in mind, each individual `span`
needs also to be finished otherwise it will not show up in the `transaction`.

```python
import sentry_sdk

with sentry_sdk.start_span(op="http", description="GET /") as span:
    response = my_custom_http_library.request("GET", "/")
    span.set_tag("http.status_code", response.status_code)
    span.set_data("http.foobarsessionid", get_foobar_sessionid())
```

The value of `op` and `description` can be freely chosen.

##### Adding Tags