---
name: FastAPI
doc_link: https://docs.sentry.io/platforms/python/guides/fastapi/
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

The FastAPI integration adds support for the [FastAPI Framework](https://fastapi.tiangolo.com/).

1. Install `sentry-sdk` from PyPI with the `fastapi` extra:

```bash
pip install --upgrade 'sentry-sdk[fastapi]'
```

2. To configure the Sentry SDK, initialize it before your app has been initialized:

```python
from fastapi import FastAPI

import sentry_sdk


sentry_sdk.init(
    dsn="___PUBLIC_DSN___",

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
)

app = FastAPI()
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `traces_sample_rate` to a value between 0 and 1.

3. You can easily verify your Sentry installation by creating a route that triggers an error:

```python
from fastapi import FastAPI


app = FastAPI()

@app.get("/sentry-debug")
async def trigger_error():
    division_by_zero = 1 / 0

```

Visiting this route will trigger an error that will be captured by Sentry.
