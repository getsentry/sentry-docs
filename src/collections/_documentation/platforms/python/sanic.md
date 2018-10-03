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
    $ pip install --upgrade sentry-sdk=={% sdk_version sentry.python %}
    ```

2.  To configure the SDK, initialize it with the integration before or after your app has been initialized:

    ```python
    import sentry_sdk
    from sentry_sdk.integrations.sanic import SanicIntegration

    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[SanicIntegration()]
    )

    app = Sanic(__name__)
    ```

<!-- ENDWIZARD -->

## Behavior

* The Sanic integration will be installed for all of your apps.

* A bit of data is attached to each event:

    * Personally identifiable information (such as user ids, usernames,
      cookies, authorization headers, ip addresses) is excluded unless
      ``send_default_pii`` is set to ``true``.

    * Request data is attached to all events.

* All exceptions leading to a Internal Server Error are reported.

* Logging with any logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
