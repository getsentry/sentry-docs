---
title: Bottle
sidebar_order: 5
---

{% version_added 0.7.9 %}


<!-- WIZARD -->
The Bottle integration adds support for the [Bottle Web Framework](https://bottlepy.org/).
Currently it works well with the stable version of Bottle (0.12).
However the integration with the development version (0.13) doesn't work properly.

1. Install `sentry-sdk` from PyPI with the `bottle` extra:

    ```bash
    $ pip install --upgrade 'sentry-sdk[bottle]=={% sdk_version sentry.python %}'
    ```

2.  To configure the SDK, initialize it with the integration before your app has been initialized:

    ```python
    import sentry_sdk

    from bottle import Bottle, run
    from sentry_sdk.integrations.bottle import BottleIntegration

    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[BottleIntegration()]
    )

    app = Bottle()
    ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

## Behavior

* The Sentry Python SDK will install the Bottle integration for all of your apps. The integration hooks into base Bottle class.

* All exceptions leading to an Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

## Options

You can pass the following keyword arguments to `BottleIntegration()`:

* `transaction_style`:

  ```python
  @app.route("/myurl/<foo>")
  def myendpoint():
      return "ok"
  ```

  In the above code, you would set the transaction to:

  * `/myurl/<foo>` if you set `transaction_style="url"`.
  * `myendpoint` if you set `transaction_style="endpoint"`

  The default is `"endpoint"`.
