---
title: AIOHTTP
sidebar_order: 4
---

{% version_added: 0.6.1 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.aiohttp.AioHttpIntegration`*

The AIOHTTP integration adds support for the [AIOHTTP-Server Web Framework](https://docs.aiohttp.org/en/stable/web.html).

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade sentry-sdk=={% sdk_version sentry.python %}
    ```

2.  Initialize the SDK before starting the server:

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

* The AIOHTTP integration will be installed for all of your apps.

* All exceptions leading to a Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

* Logging with any logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
