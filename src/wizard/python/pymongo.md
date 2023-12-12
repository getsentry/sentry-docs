---
name: PyMongo
doc_link: https://docs.sentry.io/platforms/python/guides/pymongo/
support_level: production
type: library
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

The PyMongo integration adds support for [PyMongo](https://www.mongodb.com/docs/drivers/pymongo/), the official MongoDB
driver. It adds breadcrumbs and performace traces for all queries.

1. Install `sentry-sdk` from PyPI with the `pymongo` extra:

```bash
pip install --upgrade 'sentry-sdk[pymongo]'
```

2. To configure the SDK, initialize it before creating any of PyMongo's MongoClient instances:

```python
import sentry_sdk
from sentry_sdk.integrations.pymongo import PyMongoIntegration


sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[
        PyMongoIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
)
```

The above configuration captures both breadcrumbs and performance data. To reduce the volume of performance data
captured, change `traces_sample_rate` to a value between 0 and 1.
