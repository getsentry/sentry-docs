---
title: Pyramid
sidebar_order: 5
---

{% version_added 0.5.0 %}

<!-- WIZARD -->
The Pyramid integration adds support for the [Pyramid Web
Framework](https://trypyramid.com/).

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade 'sentry-sdk=={% sdk_version sentry.python %}'
    ```

2. To configure the SDK, initialize it with the integration before or after your app has been created:

    ```python
    import sentry_sdk

    from sentry_sdk.integrations.pyramid import PyramidIntegration

    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[PyramidIntegration()]
    )

    from pyramid.config import Configurator

    with Configurator() as config:
        ...
    ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Behavior

* The Sentry Python SDK will install the Pyramid integration for all of your apps. The integration hooks into Pyramid itself, not any of your apps specifically.

* The SDK will report all exceptions leading to an Internal Server Error. These two kinds of exceptions are:

  * exceptions that are not handled by any exception view
  * exceptions whose exception view returns a status code of 500 (Pyramid version 1.9+ only)

* {% include platforms/python/request-data.md %}

* Logging with *any* logger will create breadcrumbs when
  the [Logging](/platforms/python/logging/)
  integration is enabled (done by default).

## Options

You can pass the following keyword arguments to `PyramidIntegration()`:

* `transaction_style`:

  ```python
  config.add_route("myroute", "/myurl/{id}")
  config.add_view(myfunction, route_name="myroute")
  ```

  In the above code, you can set the transaction to:

  * `/myurl/{id}` if you set `transaction_style="route_pattern"`
  * `myroute` if you set `transaction_style="route_name"`

  The default is `"route_name"`.
