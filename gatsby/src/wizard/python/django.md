---
name: Django
doc_link: https://docs.sentry.io/platforms/python/django/
support_level: production
type: framework
---
The Django integration adds support for the [Django Web Framework](https://www.djangoproject.com/)
from Version 1.6 upwards.

Install `sentry-sdk`:

```bash
$ pip install --upgrade 'sentry-sdk==0.16.2'
```

To configure the SDK, initialize it with the Django integration in your ``settings.py`` file:

```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[DjangoIntegration()],

    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)
```

You can easily verify your Sentry installation by creating a route that triggers an error:

```py
from django.urls import path

def trigger_error(request):
    division_by_zero = 1 / 0

urlpatterns = [
    path('sentry-debug/', trigger_error),
    # ...
]
```

Visiting this route will trigger an error that will be captured by Sentry.
