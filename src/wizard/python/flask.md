---
name: Flask
doc_link: https://docs.sentry.io/platforms/python/guides/flask/
support_level: production
type: framework
---

The Flask integration adds support for the [Flask Web
Framework](https://flask.palletsprojects.com/).

Install `sentry-sdk` from PyPI with the `flask` extra:

```bash
pip install --upgrade 'sentry-sdk[flask]'
```

To configure the SDK, initialize it with the integration before or after your app has been initialized:

```python
import sentry_sdk
from flask import Flask
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)

app = Flask(__name__)
```

The above configuration captures both error and performance data. To reduce the volume of performance data captured, change `traces_sample_rate` to a value between 0 and 1.

You can easily verify your Sentry installation by creating a route that triggers an error:

```py
@app.route('/debug-sentry')
def trigger_error():
    division_by_zero = 1 / 0
```

Visiting this route will trigger an error that will be captured by Sentry.
