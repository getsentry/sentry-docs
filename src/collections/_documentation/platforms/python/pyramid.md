---
title: Pyramid
sidebar_order: 5
---

{% version_added 0.5.0 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.pyramid.PyramidIntegration`*

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

<!-- ENDWIZARD -->

## Behavior

* The Pyramid integration will be installed for all of your apps. It hooks into Pyramid itself, not any of your apps specifically.

* All exceptions leading to a Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

* Logging with *any* logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).

## Options

The following keyword arguments can be passed to `PyramidIntegration()`:

* `transaction_style`:

  ```python
  config.add_route("myroute", "/myurl/{id}")
  config.add_view(myfunction, route_name="myroute")
  ```

  In the above code, the transaction would be set to:

  * `/myurl/{id}` if you set `transaction_style="route_pattern"`
  * `myroute` if you set `transaction_style="route_name"`

  The default is `"route_name"`.
