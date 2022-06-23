---
name: Quart
doc_link: https://docs.sentry.io/platforms/python/guides/quart/
support_level: production
type: framework
---

The Quart integration adds support for the [Quart Web
Framework](https://gitlab.com/pgjones/quart). We support Quart versions 0.16.1 and higher.

A Python version of 3.7 or higher is also required.

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. To configure the SDK, initialize it with the integration before or after your app has been initialized:

   ```python
   import sentry_sdk
   from sentry_sdk.integrations.quart import QuartIntegration
   from quart import Quart

   sentry_sdk.init(
      dsn="___PUBLIC_DSN___",
      integrations=[
         QuartIntegration(),
      ],
      # Set traces_sample_rate to 1.0 to capture 100%
      # of transactions for performance monitoring.
      # We recommend adjusting this value in production,
      traces_sample_rate=1.0,
   )

   app = Quart(__name__)
   ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
