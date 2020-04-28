---
title: Celery
sidebar_order: 3
---
<!-- WIZARD -->
The celery integration adds support for the [Celery Task Queue System](http://www.celeryproject.org/).

Just add ``CeleryIntegration()`` to your ``integrations`` list:

```python
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn='___PUBLIC_DSN___',
    integrations=[CeleryIntegration()]
)
```

Additionally, the Sentry Python SDK will set the transaction on the event to the task name, and it will improve the grouping for global Celery errors such as timeouts.

The integration will automatically report errors from all celery jobs.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

Generally, make sure that the **call to `init` is loaded on worker startup**, and not only in the module where your tasks are defined. Otherwise, the initialization happens too late and events might end up not being reported.
