---
name: Pyramid
doc_link: https://docs.sentry.io/platforms/python/pyramid/
support_level: production
type: framework
---
The Pyramid integration adds support for the [Pyramid Web
Framework](https://trypyramid.com/).

1. Install `sentry-sdk` from PyPI:

    ```bash
    $ pip install --upgrade 'sentry-sdk==0.16.2'
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
