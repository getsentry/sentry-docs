---
name: Tryton
doc_link: https://docs.sentry.io/platforms/python/guides/tryton/
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

The Tryton integration adds support for the [Tryton Framework Server](https://www.tryton.org/).

To configure the SDK, initialize it with the integration in a custom wsgi.py script:

```python
# wsgi.py
import sentry_sdk
import sentry_sdk.integrations.trytond

sentry_sdk.init(
    dsn="___PUBLIC_DSN___",
    integrations=[
        sentry_sdk.integrations.trytond.TrytondWSGIIntegration(),
    ],

    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for performance monitoring.
    # We recommend adjusting this value in production,
    traces_sample_rate=1.0,
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
