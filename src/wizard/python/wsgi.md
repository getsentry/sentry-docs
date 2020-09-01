---
name: WSGI
doc_link: https://docs.sentry.io/platforms/python/guides/wsgi/
support_level: production
type: framework
---

It is recommended to use an [integration for your particular WSGI framework if available](/platforms/python/#web-frameworks), as those are easier to use and capture more useful information.

If you use a WSGI framework not directly supported by the SDK, or wrote a raw WSGI app, you can use this generic WSGI middleware. It captures errors and attaches a basic amount of information for incoming requests.

```python
import sentry_sdk
from sentry_sdk.integrations.wsgi import SentryWsgiMiddleware

from myapp import wsgi_app

sentry_sdk.init(dsn="___PUBLIC_DSN___")

wsgi_app = SentryWsgiMiddleware(wsgi_app)
```
