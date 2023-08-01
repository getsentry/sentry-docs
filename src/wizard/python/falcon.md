---
name: Falcon
doc_link: https://docs.sentry.io/platforms/python/guides/falcon/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

The Falcon integration adds support for the [Falcon Web Framework](https://falconframework.org/).
The integration has been confirmed to work with Falcon 1.4 and 2.0.

1. Install `sentry-sdk` from PyPI with the `falcon` extra:

   ```bash
   $ pip install --upgrade 'sentry-sdk[falcon]'
   ```

2. To configure the SDK, initialize it with the integration before your app has been initialized:

   ```python
   import falcon
   import sentry_sdk
   from sentry_sdk.integrations.falcon import FalconIntegration

   sentry_sdk.init(
      dsn="___PUBLIC_DSN___",
      integrations=[
         FalconIntegration(),
      ],

      # Set traces_sample_rate to 1.0 to capture 100%
      # of transactions for performance monitoring.
      # We recommend adjusting this value in production,
      traces_sample_rate=1.0,
   )

   api = falcon.API()
   ```

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
