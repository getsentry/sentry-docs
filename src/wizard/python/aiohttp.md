---
name: AIOHTTP
doc_link: https://docs.sentry.io/platforms/python/guides/aiohttp/
support_level: production
type: framework
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

The AIOHTTP integration adds support for the [AIOHTTP-Server Web
Framework](https://docs.aiohttp.org/en/stable/web.html). A Python version of
3.6 or greater is required.

1. Install `sentry-sdk` from PyPI:

   ```bash
   $ pip install --upgrade sentry-sdk
   ```

2. If you're on Python 3.6, you also need the `aiocontextvars` package:

   ```bash
   $ pip install --upgrade aiocontextvars
   ```

3. Initialize the SDK before starting the server:

   ```python
   import sentry_sdk
   from sentry_sdk.integrations.aiohttp import AioHttpIntegration

   sentry_sdk.init(
      dsn="___PUBLIC_DSN___",
      integrations=[
         AioHttpIntegration(),
      ],

      # Set traces_sample_rate to 1.0 to capture 100%
      # of transactions for performance monitoring.
      # We recommend adjusting this value in production,
      traces_sample_rate=1.0,
   )

   from aiohttp import web

   async def hello(request):
       return web.Response(text="Hello, world")

   app = web.Application()
   app.add_routes([web.get('/', hello)])

   web.run_app(app)
   ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
