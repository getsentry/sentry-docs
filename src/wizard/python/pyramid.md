---
name: Pyramid
doc_link: https://docs.sentry.io/platforms/python/pyramid/
support_level: production
type: framework
---

The Pyramid integration adds support for the [Pyramid Web Framework](https://trypyramid.com/). It requires Pyramid 1.6 or later.
Framework](https://trypyramid.com/).

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. To configure the SDK, initialize it with the integration before or after your app has been created:

```python
from pyramid.config import Configurator
from wsgiref.simple_server import make_server

import sentry_sdk
from sentry_sdk.integrations.pyramid import PyramidIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[PyramidIntegration()],
    traces_sample_rate=1.0,
)

def sentry_debug(request):
    division_by_zero = 1 / 0

with Configurator() as config:
    config.add_route('sentry-debug', '/')
    config.add_view(sentry_debug, route_name='sentry-debug')
    app = config.make_wsgi_app()
    server = make_server('0.0.0.0', 6543, app)
    server.serve_forever()
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `traces_sample_rate` to a value between 0 and 1.
