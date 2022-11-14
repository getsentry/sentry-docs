---
name: PyMongo
doc_link: https://docs.sentry.io/platforms/python/guides/pymongo/
support_level: production
type: library
---

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
