---
title: Celery
sidebar_order: 2
---
<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.celery.CeleryIntegration`*

The celery integration adds support for the [Celery Task Queue System](http://www.celeryproject.org/).

Just add ``CeleryIntegration()`` to your ``integrations`` list.  The integration does not
accept any arguments and will automatically report errors from all celery tasks:

```python
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(integrations=[CeleryIntegration()])
```

Additionally the transaction on the event will be set to the task name and
the grouping will be improved for global celery errors such as timeouts.
<!-- ENDWIZARD -->