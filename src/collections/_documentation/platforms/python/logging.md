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

# All of this is already happening by default!
sentry_logging = LoggingIntegration(
    level=logging.INFO,        # Capture info and above as breadcrumbs
    event_level=logging.ERROR  # Send errors as events
)
sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[sentry_logging]
)
```

## Usage

```
import logging
logging.debug("I am a breadcrumb")
logging.error("I am an event", bar=43)
```

* There will be an error event with the message `"I am an event"`.
* `"I am a breadcrumb"` will be attached as breadcrumb to that event.
* `bar` will end up in the event's `extra` attributes.

{% version_added 0.5.0: Ability to add data to `extra` %}

## Config

* `level` (default `INFO`): Log records with a level higher than or equal to
  `level` will be recorded as breadcrumbs. Any log record with a level lower
  than this one is completely ignored. A value of `None` means that no log
  records will be sent as breadcrumbs.

* `event_level` (default `ERROR`): Log records with a level higher than or equal
  to `event_level` will additionally be reported as event. A value of `None`
  means that no log records will be sent as events.
