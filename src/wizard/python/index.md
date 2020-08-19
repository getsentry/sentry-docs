---
name: Python
doc_link: https://docs.sentry.io/error-reporting/quickstart/?platform=python
support_level: production
type: language
---

Install our Python SDK using [`pip`](https://pip.pypa.io/en/stable/):

```bash
$ pip install --upgrade sentry-sdk==0.16.2
```

Import and initialize the Sentry SDK early in your application's setup:

```python
import sentry_sdk
sentry_sdk.init("___PUBLIC_DSN___")
```

One way to verify your setup is by intentionally sending an event that breaks your application.

Raise an unhandled Python exception by inserting a divide by zero expression
into your application:

```py
division_by_zero = 1 / 0
```
