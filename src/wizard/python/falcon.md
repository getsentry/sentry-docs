---
name: Falcon
doc_link: https://docs.sentry.io/platforms/python/falcon/
support_level: production
type: framework
---
The Falcon integration adds support for the [Falcon Web Framework](https://falconframework.org/).
The integration has been confirmed to work with Falcon 1.4 and 2.0.

1. Install `sentry-sdk` from PyPI with the `falcon` extra:

    ```bash
    $ pip install --upgrade 'sentry-sdk[falcon]==0.16.2'
    ```

2.  To configure the SDK, initialize it with the integration before your app has been initialized:

    ```python
    import falcon
    import sentry_sdk
    from sentry_sdk.integrations.falcon import FalconIntegration

    sentry_sdk.init(
        dsn="___PUBLIC_DSN___",
        integrations=[FalconIntegration()]
    )

    api = falcon.API()
    ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
