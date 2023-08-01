---
name: RQ (Redis Queue)
doc_link: https://docs.sentry.io/platforms/python/guides/rq/
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
