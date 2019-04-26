---
title: AIOHTTP
sidebar_order: 4
---

{% version_added: 0.6.1 %}

<!-- WIZARD -->
The AIOHTTP integration adds support for the [AIOHTTP-Server Web
Framework](https://docs.aiohttp.org/en/stable/web.html). A Python version of
3.6 or greater is required.

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade 'sentry-sdk=={% sdk_version sentry.python %}'
    ```

2.  If you're on Python 3.6, you also need the `aiocontextvars` package:

    ```bash
    $ pip install --upgrade aiocontextvars
    ```

3.  Initialize the SDK before starting the server:

    ```python
    import sentry_sdk
    from sentry_sdk.integrations.aiohttp import AioHttpIntegration
    
    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[AioHttpIntegration()]
    )

    from aiohttp import web

    async def hello(request):
        return web.Response(text="Hello, world")

        app = web.Application()
    app.add_routes([web.get('/', hello)])

    web.run_app(app)
    ```

<!-- ENDWIZARD -->

## Behavior

* The Sentry Python SDK will install the AIOHTTP integration for all of your apps.

* All exceptions leading to an Internal Server Error are reported.

* *The AIOHTTP integration currently does not attach the request body.* See
  [the relevant GitHub
  issue](https://github.com/getsentry/sentry-python/issues/220).

* Logging with any logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
