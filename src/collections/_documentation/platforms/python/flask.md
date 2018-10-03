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
    $ pip install --upgrade sentry-sdk[flask]=={% sdk_version sentry.python %}
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

* The Flask integration will be installed for all of your apps. It hooks into
  Flask's signals, not anything on the app object.

* A bit of data is attached to each event:

    * Personally identifiable information (such as user ids, usernames,
      cookies, authorization headers, ip addresses) is excluded unless
      ``send_default_pii`` is set to ``true``.

    * Request data is attached to all events.

    * If you have Flask-Login installed and configured, user data is attached to
      the event.

* All exceptions leading to a Internal Server Error are reported.

* Logging with `app.logger` or really *any* logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).

## User Feedback

The user feedback feature can be used with this integration.  For more information
see [User Feedback]({% link _documentation/learn/user-feedback.md %}?platform=flask).
