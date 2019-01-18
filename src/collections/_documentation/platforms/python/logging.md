---
title: Logging
sidebar_order: 2
---
*Import name: `sentry_sdk.integrations.logging.LoggingIntegration`*

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
logging.debug("I am a breadcrumb")
logging.error("I am an event", extra=dict(bar=43))
logging.error("An exception happened", exc_info=True)
```

* There will be an error event with the message `"I am an event"`.
* `"I am a breadcrumb"` will be attached as a breadcrumb to that event.
* `bar` will end up in the event's `extra` attributes.
* `"An exception happened"` will send the current exception from `sys.exc_info()` with the stack trace and everything to Sentry. If there's no exception, the current stack will be attached.

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

* `level` (default `INFO`): Sentry will record log records with a level higher than or equal to `level` as breadcrumbs. Inversely, Sentry completely ignores any log record with a level lower than this one. If a value of `None` occurs, Sentry won't send log records as breadcrumbs.

* `event_level` (default `ERROR`): Sentry will report log records with a level higher than or equal to `event_level` as events. If a value of `None` occurs, Sentry won't send log records as events.

{% capture __alert_content -%}
Sentry will honor the configured level of each logger. That means that you will not see any `INFO` events from a logger with the level set to `WARNING`, regardless of how you configure the integration.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

## Handler classes

Instead of using `LoggingIntegration`, you can use two regular logging `logging.Handler` subclasses that the integration exports.

**Usually, you do not need to use this yourself.** You *can* use this together with `default_integrations=False` if you want to opt into what Sentry captures. The disadvantage is that setting up logging correctly is hard and that an opt-in approach to capturing data will miss errors you would never have thought of looking for in the first place.

See the [API
documentation](https://getsentry.github.io/sentry-python/integrations/logging.m.html#header-classes)
for more information.
