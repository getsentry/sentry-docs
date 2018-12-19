---
title: Tornado
sidebar_order: 4
---

{% version_added: 0.6.3 %}

<!-- WIZARD -->
*Import name: `sentry_sdk.integrations.tornado.TornadoIntegration`*

The Tornado integration adds support for the [Tornado Web
Framework](https://www.tornadoweb.org/). A Tornado version of 5 or greater and
Python 3.7 or greater is required.

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade sentry-sdk=={% sdk_version sentry.python %}
    ```

2.  Initialize the SDK before starting the server:

    ```python
    import sentry_sdk
    from sentry_sdk.integrations.tornado import TornadoIntegration
    
    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[TornadoIntegration()]
    )

    # Your app code here, without changes

    class MyHandler(...):
        ...
    ```

<!-- ENDWIZARD -->

## Behavior

* The Tornado integration will be installed for all of your apps and handlers.

* All exceptions leading to a Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

  *Note: The tornado integration currently does not capture formdata.* See [the
  relevant GitHub issue](https://github.com/getsentry/sentry-python/issues/221)

* Logging with any logger will create breadcrumbs when
  the [Logging]({% link _documentation/platforms/python/logging.md %})
  integration is enabled (done by default).
