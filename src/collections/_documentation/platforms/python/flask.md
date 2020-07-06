---
title: Flask
sidebar_order: 2
---

<!-- WIZARD -->
The Flask integration adds support for the [Flask Web
Framework](http://flask.pocoo.org/).

Install `sentry-sdk` from PyPI with the `flask` extra:

```bash
$ pip install --upgrade 'sentry-sdk[flask]=={% sdk_version sentry.python %}'
```

To configure the SDK, initialize it with the integration before or after your app has been initialized:

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[FlaskIntegration()]
)

app = Flask(__name__)
```

You can easily verify your Sentry installation by creating a route that triggers an error:

```py
@app.route('/debug-sentry')
def trigger_error():
    division_by_zero = 1 / 0
```

Visiting this route will trigger an error that will be captured by Sentry.
<!-- ENDWIZARD -->

## Behavior

* The Sentry Python SDK will install the Flask integration for all of your apps. It hooks into Flask’s signals, not anything on the app object.

* All unhandled exceptions will be reported. Note that `@app.errorhandler(Exception)` will prevent all exceptions from being sent to Sentry while `@app.errorhandler(500)` will not.

* {% include platforms/python/request-data.md %}

* If you use ``flask-login`` and have set ``send_default_pii=True`` in your
  call to ``init``, user data is attached to the event. Apart from the user ID
  we will try to access the attributes `email` and `username` on your user
  object to capture some more data.

* Logging with `app.logger` or *any* logger will create breadcrumbs when
  the [Logging](/platforms/python/logging/)
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

  * `/myurl/&lt;foo&gt;` if you set `transaction_style="url"`. This matches the behavior of the old Raven SDK.
  * `myendpoint` if you set `transaction_style="endpoint"`

  The default is `"endpoint"`.

## User Feedback

You can use the user feedback feature with this integration.  For more information see [User Feedback](/enriching-error-data/user-feedback/?platform=flask).
