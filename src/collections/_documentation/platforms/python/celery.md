---
title: Celery
sidebar_order: 2
---

Just add ``CeleryIntegration()`` to your ``integrations`` array. For example, in Django:

```python
import sentry_sdk
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[DjangoIntegration(), CeleryIntegration()]
)
```

With that, the transaction on the event will be set to the task name, and
exceptions will be reported to Sentry.
