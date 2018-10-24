---
title: RQ (Redis Queue)
sidebar_order: 2
---

{% version_added 0.5.1 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.rq.RqIntegration`*

The celery integration adds support for the [RQ Job Queue System](https://python-rq.org/).

Just add ``RqIntegration()`` to your ``integrations`` list.  The integration does not
accept any arguments and will automatically report errors from all celery tasks:

```python
import sentry_sdk
from sentry_sdk.integrations.celery import RqIntegration

sentry_sdk.init(integrations=[RqIntegration()])
```

Additionally the transaction on the event will be set to the task name and
the grouping will be improved for global errors such as timeouts.
<!-- ENDWIZARD -->
