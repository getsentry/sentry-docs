---
title: Falcon
sidebar_order: 5
---

{% version_added 0.7.11 %}


<!-- WIZARD -->
The Falcon integration adds support for the [Falcon Web Framework](https://falconframework.org/).
The integration has been confirmed to work with Falcon 1.4 and 2.0.

1. Install `sentry-sdk` from PyPI with the `falcon` extra:

    ```bash
    $ pip install --upgrade 'sentry-sdk[falcon]=={% sdk_version sentry.python %}'
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

<!-- ENDWIZARD -->

## Behavior

* The Sentry Python SDK will install the Falcon integration for all of your apps. The integration hooks into the base `falcon.API` class via monkey patching.

* All exceptions leading to an Internal Server Error are reported.

* {% include platforms/python/request-data.md %}

## Options

You can pass the following keyword arguments to `FalconIntegration()`:

* `transaction_style`:

  ```python
  class MessageResource:
      def on_get(self, req, resp, message_id):
          msg = database.get_message(message_id)
          resp.media = msg.as_json()

  app = falcon.API()
  app.add_route("/message/{message_id}", MessageResource())
  ```

  In the above code, you would set the transaction to:

  * `/myurl/b48a7686-ad8c-4c94-8c3b-412ec7f25db2123` if you set `transaction_style="path"`.
  * `/myurl/{message_id}` if you set `transaction_style="uri_template"`

  The default is `"uri_template"`.
