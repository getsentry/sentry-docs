---
title: Sanic
sidebar_order: 3
---

{% version_added 0.3.6 %}

<!-- WIZARD -->
The Sanic integration adds support for the [Sanic Web
Framework](https://github.com/huge-success/sanic). A Python version of 3.6 or
greater is required.

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade 'sentry-sdk=={% sdk_version sentry.python %}'
    ```

2.  If you're on Python 3.6, you also need the `aiocontextvars` package:

    ```bash
    $ pip install --upgrade aiocontextvars
    ```

3.  To configure the SDK, initialize it with the integration before or after your app has been initialized:

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
<!-- ENDWIZARD -->

## Behavior

* The Sentry Python SDK will install the Sanic integration for all of your apps.

* All exceptions leading to an Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

* Logging with any logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
