---
name: RQ (Redis Queue)
doc_link: https://docs.sentry.io/platforms/python/guides/rq/
support_level: production
type: library
---

The RQ integration adds support for the [RQ Job Queue System](https://python-rq.org/).

Create a file called `mysettings.py` with the following content:

```python
import sentry_sdk
from sentry_sdk.integrations.rq import RqIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[
        RqIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
)
```

Start your worker with:

```shell
rq worker \
    -c mysettings \  # module name of mysettings.py
    --sentry-dsn=""  # only necessary for RQ < 1.0
```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
