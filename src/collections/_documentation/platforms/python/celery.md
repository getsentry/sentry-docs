---
title: Celery
sidebar_order: 2
---
<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.celery.CeleryIntegration`*

The celery integration adds support for the [Celery Task Queue System](http://www.celeryproject.org/).

Just add ``CeleryIntegration()`` to your ``integrations`` list.  The integration does not
accept any arguments and will automatically report errors from all Celery tasks:

```python
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(integrations=[CeleryIntegration()])
```

Additionally, Sentry will set the transaction on the event to the task name, and it will improve the grouping for global Celery errors such as timeouts.
<!-- ENDWIZARD -->