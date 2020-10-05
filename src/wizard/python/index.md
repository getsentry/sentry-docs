---
name: Python
doc_link: https://docs.sentry.io/platforms/python/
support_level: production
type: language
---

Install our Python SDK using [`pip`](https://pip.pypa.io/en/stable/):

```bash
pip install --upgrade sentry-sdk
```

Import and initialize the Sentry SDK early in your application's setup:

```python
import sentry_sdk
sentry_sdk.init(
    "___PUBLIC_DSN___",
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
