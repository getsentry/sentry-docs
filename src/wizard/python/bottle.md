---
name: Bottle
doc_link: https://docs.sentry.io/platforms/python/guides/bottle/
support_level: production
type: framework
---

The Bottle integration adds support for the [Bottle Web Framework](https://bottlepy.org/).
Currently it works well with the stable version of Bottle (0.12).
However the integration with the development version (0.13) doesn't work properly.

1. Install `sentry-sdk` from PyPI with the `bottle` extra:

   ```bash
   $ pip install --upgrade 'sentry-sdk[bottle]'
   ```

2. To configure the SDK, initialize it with the integration before your app has been initialized:

   ```python
   import sentry_sdk

   from bottle import Bottle, run
   from sentry_sdk.integrations.bottle import BottleIntegration

   sentry_sdk.init(
      dsn="___PUBLIC_DSN___",
      integrations=[
         BottleIntegration(),
      ],
      # Set traces_sample_rate to 1.0 to capture 100%
      # of transactions for performance monitoring.
      # We recommend adjusting this value in production,
      traces_sample_rate=1.0,
   )

   app = Bottle()
   ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
