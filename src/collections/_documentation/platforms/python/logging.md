---
title: Logging
sidebar_order: 2
---
*Import name: `sentry_sdk.integrations.logging.LoggingIntegration`*

Calling ``sentry_sdk.init()`` already integrates with the logging module. It is
equivalent to this explicit configuration:

```python
import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration

sentry_logging = LoggingIntegration(
    level=logging.INFO,  # Capture info and above as breadcrumbs
    event_level=None     # Send no events from log messages
)
sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[sentry_logging]
)
```

If you want to send events for a log record, set `event_level` to a log level.

## Config

* `level` (default `INFO`): Log records with a level higher than or equal to
  `level` will be recorded as breadcrumbs. Any log record with a level lower
  than this one is completely ignored.

* `event_level` (default `None`): Log records with a level higher than or equal
  to `event_level` will additionally be reported as event. A value of `None`
  means that no log records will be sent as events.
