---
name: Python
doc_link: https://docs.sentry.io/platforms/python/
support_level: production
type: language
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

Install our Python SDK using [`pip`](https://pip.pypa.io/en/stable/):

```bash
pip install --upgrade sentry-sdk
```

Import and initialize the Sentry SDK early in your application's setup:

```python
import sentry_sdk
sentry_sdk.init(
    dsn="___PUBLIC_DSN___",

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production.
    traces_sample_rate=1.0
)
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `traces_sample_rate` to a value between 0 and 1.

One way to verify your setup is by intentionally causing an error that breaks your application.

Raise an unhandled Python exception by inserting a divide by zero expression
into your application:

```py
division_by_zero = 1 / 0
```
