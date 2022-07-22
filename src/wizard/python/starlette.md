---
name: Starlette
doc_link: https://docs.sentry.io/platforms/python/guides/starlette/
support_level: production
type: framework
---

The Starlette integration adds support for the [Starlette Framework](https://www.starlette.io/).

1. Install `sentry-sdk` from PyPI with the `starlette` extra:

```bash
pip install --upgrade 'sentry-sdk[starlette]'
```

2. To configure the SDK, initialize it with the integration before your app has been initialized:

```python
from starlette.applications import Starlette

import sentry_sdk
from sentry_sdk.integrations.starlette import StarletteIntegration


sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[
        StarletteIntegration(),
    ],

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
