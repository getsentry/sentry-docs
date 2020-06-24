---
title: Tornado
sidebar_order: 6
---

{% version_added: 0.6.3 %}

<!-- WIZARD -->
The Tornado integration adds support for the [Tornado Web
Framework](https://www.tornadoweb.org/). A Tornado version of 5 or greater and
Python 3.6 or greater is required.

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade sentry-sdk=={% sdk_version sentry.python %}
    ```

2.  If you're on Python 3.6, you also need the `aiocontextvars` package:

    ```bash
    $ pip install --upgrade aiocontextvars
    ```

3.  Initialize the SDK before starting the server:

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

* Logging with any logger will create breadcrumbs when
  the [Logging](/platforms/python/logging/)
  integration is enabled (done by default).
