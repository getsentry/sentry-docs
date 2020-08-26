---
name: Flask
doc_link: https://docs.sentry.io/platforms/python/guides/flask/
support_level: production
type: framework
---

The Flask integration adds support for the [Flask Web
Framework](http://flask.pocoo.org/).

Install `sentry-sdk` from PyPI with the `flask` extra:

```bash
$ pip install --upgrade 'sentry-sdk[flask]'
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
