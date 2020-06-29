---
title: Serverless Decorator
sidebar_order: 9
---

{% version_added 0.7.3 %}

<!-- WIZARD -->
It is recommended to use an [integration for your particular serverless environment if available](/platforms/python/#serverless), as those are easier to use and capture more useful information.

If you use a serverless provider not directly supported by the SDK, you can use this generic integration.

Apply the `serverless_function` decorator to each function that might throw errors:

```python
import sentry_sdk
from sentry_sdk.integrations.serverless import serverless_function

sentry_sdk.init(dsn="___PUBLIC_DSN___")

@serverless_function
def my_function(...):
    ...
```
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Behavior

* Exceptions raising from those functions will be reported to Sentry (and reraised).

* Each call of a decorated function will block and wait for current events to be sent before returning.

  When there are no events to be sent, this will not add a delay. However, if there are errors, this will delay the return of your serverless function until the events are sent. This is necessary as serverless environments typically reserve the right to kill the runtime/VM when they consider it unused.

  The maximum amount of time to block overall is set by the [`shutdown_timeout` client option](/error-reporting/configuration/?platform=python#shutdown-timeout).

  You can disable this aspect by decorating with `@serverless_function(flush=False)` instead.
