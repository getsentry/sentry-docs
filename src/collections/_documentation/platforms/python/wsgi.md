---
title: WSGI
sidebar_order: 5
---

{% version_added 0.6.0 %}

<!-- WIZARD -->

*Import name: `sentry_sdk.integrations.wsgi.SentryWsgiMiddleware`*

It is recommended to use an [integration for your particular WSGI framework if available]({% link _documentation/platforms/python/index.md %}#framework-integrations), as those are easier to use and capture more useful information.

If you use a WSGI framework not directly supported by the SDK, or wrote a raw WSGI app, you can use this generic WSGI middleware. It captures errors and attaches a basic amount of information for incoming requests.

```python
import sentry_sdk
from sentry_sdk.integrations.wsgi import SentryWsgiMiddleware

from myapp import wsgi_app

sentry_sdk.init(dsn="___PUBLIC_DSN___")

wsgi_app = SentryWsgiMiddleware(wsgi_app)
```

<!-- ENDWIZARD -->

## Behavior

* {% include platforms/python/request-data.md %}

* The WSGI middleware does not behave like a regular integration. It is not initialized through an extra parameter to `init` and is not attached to a client. When capturing or supplementing events, it just uses the currently active hub.
