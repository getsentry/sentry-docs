---
name: Tryton
doc_link: https://docs.sentry.io/platforms/python/tryton/
support_level: production
type: framework
---
The Tryton integration adds support for the [Tryton Framework Server](https://www.tryton.org/).

To configure the SDK, initialize it with the integration in a custom wsgi.py script:

```python
# wsgi.py
import sentry_sdk
import sentry_sdk.integrations.trytond

sentry_sdk.init(
    desn="___PUBLIC_DSN___",
    integrations=[sentry_sdk.integrations.trytond.TrytondWSGIIntegration()]
)

from trytond.application import app as application

# ...
```

In Tryton>=5.4 an error handler can be registered to respond the client
with a custom error message including the Sentry event id instead of a traceback.

```python
# wsgi.py
# ...

from trytond.exceptions import TrytonException
from trytond.exceptions import UserError

@application.error_handler
def _(app, request, e):
    if isinstance(e, TrytonException):
        return
    else:
        event_id = sentry_sdk.last_event_id()
        data = UserError('Custom message', f'{event_id}\n{e}')
        return app.make_response(request, data)

```
