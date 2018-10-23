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
    $ pip install --upgrade sentry-sdk=={% sdk_version sentry.python %}
    ```

2. To configure the SDK, initialize it with the integration before or after your app has been created:

    ```python
    import sentry_sdk

    from sentry_sdk.integrations.flask import FlaskIntegration

    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[FlaskIntegration()]
    )

    from pyramid.config import Configurator

    with Configurator() as config:
        ...
    ```

<!-- ENDWIZARD -->

## Behavior

* The Pyramid integration will be installed for all of your apps. It hooks into Pyramid itself, not any of your apps specifically.

* A bit of data is attached to each event:

    * Personally identifiable information (such as user ids, usernames,
      cookies, authorization headers, ip addresses) is excluded unless
      ``send_default_pii`` is set to ``true``.

    * Request data is attached to all events.

* All exceptions are reported.

* Logging with *any* logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
