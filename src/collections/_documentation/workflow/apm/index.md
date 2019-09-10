---
title: Application Performance Management
sidebar_order: 0
---

Sentry's APM features provide users with a view of the general health of their system. The APM tools will give insight on an application's low performance, even when there aren't errors.

{% include components/alert.html
title="Note"
content="Currently, if you have version 0.11.2 of Sentry's Python SDK, the APM features are available to you. "
level="info"
%}

## Glossary
If you're unfamiliar with the concepts and terms associated with APM, feel free to take a look at our [APM Glossary]({%- link _documentation/workflow/apm/glossary.md -%}). 

## Traces

### Sending Traces
To send any traces, set the `traces_sample_rate`
to a nonzero value. The following configuration will capture 10% of
all your transactions:

```python
    import sentry_sdk
    
    sentry_sdk.init("YOUR DSN", traces_sample_rate=0.1)
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

#### Adding Spans

##### Adding Tags