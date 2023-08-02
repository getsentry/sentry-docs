---
name: Starlette
doc_link: https://docs.sentry.io/platforms/python/guides/starlette/
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

The Starlette integration adds support for the [Starlette Framework](https://www.starlette.io/).

1. Install `sentry-sdk` from PyPI with the `starlette` extra:

```bash
pip install --upgrade 'sentry-sdk[starlette]'
```

2. To configure the SDK, initialize it before your app has been initialized. The Sentry SDK automatically enables support for Starlette if you have the `starlette` Python package installed in your project. There are no configuration options you need to add when initializing the Sentry SDK as everything works out of the box:

```python
from starlette.applications import Starlette

import sentry_sdk


sentry_sdk.init(
    dsn="___PUBLIC_DSN___",

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
)

app = Starlette(routes=[...])
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `traces_sample_rate` to a value between 0 and 1.

3. You can easily verify your Sentry installation by creating a route that triggers an error:

```python
from starlette.applications import Starlette
from starlette.routing import Route


async def trigger_error(request):
    division_by_zero = 1 / 0

app = Starlette(routes=[
    Route("/sentry-debug", trigger_error),
])
```

Visiting this route will trigger an error that will be captured by Sentry.
