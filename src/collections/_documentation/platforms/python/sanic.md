---
title: Sanic
sidebar_order: 3
---

{% version_added 0.3.6 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.sanic.SanicIntegration`*

The Sanic integration adds support for the [Sanic Web
Framework](https://github.com/huge-success/sanic).

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade 'sentry-sdk=={% sdk_version sentry.python %}'
    ```

2.  To configure the SDK, initialize it with the integration before or after your app has been initialized:

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

<!-- ENDWIZARD -->

## Behavior

* The Sanic integration will be installed for all of your apps.

* All exceptions leading to a Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

* Logging with any logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
