---
title: Flask
sidebar_order: 2
---

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.flask.FlaskIntegration`*

The Flask integration adds support for the [Flask Web
Framework](http://flask.pocoo.org/).

1. Install `sentry-sdk` from PyPI with the `flask` extra:

    ```bash
    $ pip install --upgrade 'sentry-sdk[flask]=={% sdk_version sentry.python %}'
    ```

2.  To configure the SDK, initialize it with the integration before or after your app has been initialized:

    ```python
    import sentry_sdk
    from sentry_sdk.integrations.flask import FlaskIntegration

    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[FlaskIntegration()]
    )

    app = Flask(__name__)
    ```

<!-- ENDWIZARD -->

## Behavior

* Sentry will install the Flask integration for all of your apps. It hooks into Flask’s signals, not anything on the app object.

* All exceptions leading to an Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

* If you use ``flask-login`` and have set ``send_default_pii=True`` in your call to ``init``, user data (current user id, email address, username) is attached to the event.

* Logging with `app.logger` or *any* logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).

## Options

You can pass the following keyword arguments to `FlaskIntegration()`:

* `transaction_style`:

  ```python
  @app.route("/myurl/<foo>")
  def myendpoint():
      return "ok"
  ```

  In the above code, you would set the transaction to:

  * `/myurl/<foo>` if you set `transaction_style="url"`. This matches the behavior of the old Raven SDK.
  * `myendpoint` if you set `transaction_style="endpoint"`

  The default is `"endpoint"`.

## User Feedback

You can use the user feedback feature with this integration.  For more information see [User Feedback]({% link _documentation/enriching-error-data/user-feedback.md %}?platform=flask).
