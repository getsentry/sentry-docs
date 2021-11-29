---
name: Quart
doc_link: https://docs.sentry.io/platforms/python/guides/quart/
support_level: production
type: framework
---

The Quart integration adds support for the [Quart Web
Framework](https://gitlab.com/pgjones/quart). We support Quart >= 0.16.1.

A Python version of 3.7 or greater is also required.

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
       integrations=[QuartIntegration()]
   )

   app = Quart(__name__)
   ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
