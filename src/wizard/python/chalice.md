---
name: Chalice
doc_link: https://docs.sentry.io/platforms/python/guides/chalice/
support_level: production
type: framework
---

## Install

Install `sentry-sdk` from PyPI:

```bash
pip install --upgrade sentry-sdk[chalice]
```

## Configure

```python
import sentry_sdk
from chalice import Chalice

from sentry_sdk.integrations.chalice import ChaliceIntegration


sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[
        ChaliceIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
)

app = Chalice(app_name="appname")
```
