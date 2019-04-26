---
title: Logging
sidebar_order: 2
---
Calling ``sentry_sdk.init()`` already integrates with the logging module. It is
equivalent to this explicit configuration:

```python
import logging
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

```python
import logging
logging.debug("I am ignored")
logging.info("I am a breadcrumb")
logging.error("I am an event", extra=dict(bar=43))
logging.error("An exception happened", exc_info=True)
```

* There will be an error event with the message `"I am an event"`.
* `"I am a breadcrumb"` will be attached as a breadcrumb to that event.
* `bar` will end up in the event's `extra` attributes.
* `"An exception happened"` will send the current exception from `sys.exc_info()` with the stack trace and everything to the Sentry Python SDK. If there's no exception, the current stack will be attached.
* The debug message `"I am ignored"` will not surface anywhere. To capture it, you need to lower `level` to `DEBUG`.


{% version_added 0.5.0: Ability to add data to `extra` %}

{% version_added 0.6.0: `exc_info=True` now always attaches a stack trace %}

## Ignoring a logger

Sometimes a logger is extremely noisy and spams you with pointless errors. You can completely ignore that logger by calling `ignore_logger`:

```python
from sentry_sdk.integrations.logging import ignore_logger


ignore_logger("a.spammy.logger")

logger = logging.getLogger("a.spammy.logger")
logger.error("hi")  # no error sent to sentry
```

You can also use `before-send` and `before-breadcrumb` to ignore
only certain messages. See [_Filtering Events_]({%- link
_documentation/error-reporting/configuration/filtering.md -%}) for more information.

## Options

You can pass the following keyword arguments to `LoggingIntegration()`:

* `level` (default `INFO`): The Sentry Python SDK will record log records with a level higher than or equal to `level` as breadcrumbs. Inversely, the SDK completely ignores any log record with a level lower than this one. If a value of `None` occurs, the SDK won't send log records as breadcrumbs.

* `event_level` (default `ERROR`): The Sentry Python SDK will report log records with a level higher than or equal to `event_level` as events. If a value of `None` occurs, the SDK won't send log records as events.

{% capture __alert_content -%}
The Sentry Python SDK will honor the configured level of each logger. That means that you will not see any `INFO` events from a logger with the level set to `WARNING`, regardless of how you configure the integration.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

## Handler classes

Instead of using `LoggingIntegration`, you can use two regular logging `logging.Handler` subclasses that the integration exports.

**Usually, you don't need this.** You *can* use this together with `default_integrations=False` if you want to opt into what the Sentry Python SDK captures. However, correctly setting up logging is difficult. Also, an opt-in approach to capturing data will miss errors you may not think of on your own. 

See the [API
documentation](https://getsentry.github.io/sentry-python/integrations/logging.m.html#header-classes)
for more information.
