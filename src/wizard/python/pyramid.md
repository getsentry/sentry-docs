---
name: Pyramid
doc_link: https://docs.sentry.io/platforms/python/pyramid/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

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
    integrations=[
        PyramidIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
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
