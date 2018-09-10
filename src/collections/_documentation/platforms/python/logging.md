---
title: Logging
sidebar_order: 2
---
*Import name: `sentry_sdk.integrations.logging.LoggingIntegration`*

Calling ``sentry_sdk.init()`` already captures any logging message with a level
higher than or equal to ``INFO``. You can change this behavior by explicitly
passing the logging integration like any other:

```python
import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration

sentry_logging = LoggingIntegration(
    level=logging.DEBUG,
    event_level=logging.ERROR
)
sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[sentry_logging]
)
```

The above configuration captures *all* messages, now including ``DEBUG``, as
breadcrumbs. Messages with level ``ERROR`` and above will show up as their own
events as well.

## Config

* ``level`` (default ``INFO``): Log records with a level higher than or equal
  to ``level`` will be recorded as breadcrumbs. Any log record with a level
  lower than this one is completely ignored.

* ``event_level`` (default ``None``): Log records with a level higher than or
  equal to ``event_level`` will additionally be reported as event. A value of
  ``None`` means that no log records will be sent as events.
