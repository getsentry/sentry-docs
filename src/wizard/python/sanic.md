---
name: Sanic
doc_link: https://docs.sentry.io/platforms/python/guides/sanic/
support_level: production
type: framework
---

The Sanic integration adds support for the [Sanic Web
Framework](https://github.com/huge-success/sanic). We support the following versions:

- `0.8`
- `18.12`
- `19.12`
- `20.12`
- Any version of the form `x.12` (LTS versions).

**We do support all versions of Sanic.** However, Sanic versions between LTS releases should be considered Early Adopter. We may not support all the features in these non-LTS versions, since non-LTS versions change quickly and [have introduced breaking changes in the past](https://github.com/huge-success/sanic/issues/1532), without prior notice.

A Python version of 3.6 or greater is also required.

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. If you're on Python 3.6, you also need the `aiocontextvars` package:

   ```bash
   $ pip install --upgrade aiocontextvars
   ```

3. To configure the SDK, initialize it with the integration before or after your app has been initialized:

   ```python
   import sentry_sdk
   from sentry_sdk.integrations.sanic import SanicIntegration
   from sanic import Sanic

   sentry_sdk.init(
       dsn="___PUBLIC_DSN___",
       integrations=[SanicIntegration()]
   )

   app = Sanic(__name__)
   ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
