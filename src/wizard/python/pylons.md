---
name: Pylons
doc_link: https://docs.sentry.io/platforms/python/legacy-sdk/integrations/pylons/
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

## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```

### WSGI Middleware

A Pylons-specific middleware exists to enable easy configuration from settings:

```python
from raven.contrib.pylons import Sentry

application = Sentry(application, config)
```

Configuration is handled via the sentry namespace:

```ini
[sentry]
dsn=___PUBLIC_DSN___
include_paths=my.package,my.other.package,
exclude_paths=my.package.crud
```

### Logger setup

Add the following lines to your project’s _.ini_ file to setup _SentryHandler_:

```ini
[loggers]
keys = root, sentry

[handlers]
keys = console, sentry

[formatters]
keys = generic

[logger_root]
level = INFO
handlers = console, sentry

[logger_sentry]
level = WARN
handlers = console
qualname = sentry.errors
propagate = 0

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[handler_sentry]
class = raven.handlers.logging.SentryHandler
args = ('SENTRY_DSN',)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(asctime)s,%(msecs)03d %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

You may want to set up other loggers as well.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
