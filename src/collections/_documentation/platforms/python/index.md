---
title: Python
sidebar_order: 3
---

The new Python SDK (`sentry-sdk`) follows the new SDK guidelines.  To get started
have a look at the [quickstart]({% link _documentation/learn/quickstart.md %}) docs.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks and
libraries.  They can be seen as plugins that extend the functionality of the Sentry
SDK.  Integrations are configured by a call to `sentry_sdk.init`.  Any default
integration not in the list is automatically added unless `default_integrations` is
set to `False`.

Example configuration for Django:

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[DjangoIntegration()]
)
```

## Included integrations

The SDK ships various integrations, some of which are enabled by default but some
need to be opted in manually.

### Django
Automatically capture exceptions thrown by the Django framework
and extracts useful information from the current request.  [More
information]({% link _documentation/platforms/python/django.md %}).

Class name: `sentry_sdk.integrations.django.DjangoIntegration`

### Flask
Automatically capture exceptions thrown by Flask apps and extracts useful
information from the current request. [More information]({% link
_documentation/platforms/python/flask.md %}).

### Celery
Automatically capture errors thrown from Celery tasks and improve the grouping for
failing tasks. [More information]({% link _documentation/platforms/python/celery.md %}).

### Logging
Automatically capture breadcrumbs from log records and emit Sentry events for
error or fatal log records.  This is enabled by default with the default settings
but can be manually configured if wanted. [More
information]({% link _documentation/platforms/python/logging.md %}).

Import name: `sentry_sdk.integrations.logging.LoggingIntegration`

### Requests
When this integration is enabled HTTP requests emitted through the `requests` library
will be reported as breadcrumbs.  This integration is not enabled by default and
needs to be enabled.

```python
import sentry_sdk
from sentry_sdk.integrations.requests import RequestsIntegration
sentry_sdk.init(integrations=[RequestsIntegration()])
```

Import name: `sentry_sdk.integrations.requests.RequestsIntegration`

### System Integrations

There are some more internal "system" integrations which are enabled by default but can
be disabled if they cause issues.  [More information]({% link _documentation/platforms/python/system.md %}).
