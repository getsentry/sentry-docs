---
title: ASGI
sidebar_order: 5
---

{% version_added 0.10.2 %}

<!-- WIZARD -->

The ASGI middleware can be used to instrument any [ASGI](https://asgi.readthedocs.io/en/latest/)-compatible web framework to attach request data for your events.

This can be used to instrument, for example [Starlette](https://www.starlette.io/middleware/) or [Django Channels 2.0](https://channels.readthedocs.io/en/latest/).

```python
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

from myapp import asgi_app

sentry_sdk.init(dsn="___PUBLIC_DSN___")

asgi_app = SentryAsgiMiddleware(asgi_app)
```

The middleware supports both ASGI 2 and ASGI 3 transparently.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Behavior

* {% include platforms/python/request-data.md %}

* The ASGI middleware does not behave like a regular integration. It is not initialized through an extra parameter to `init` and is not attached to a client. When capturing or supplementing events, it just uses the currently active hub.
