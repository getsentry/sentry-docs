---
title: Python
sidebar_order: 12
---

For pairing Sentry up with Python you can use the Raven for Python (raven-python) library. It is the official standalone Python client for Sentry. It can be used with any modern Python interpreter be it CPython 2.x or 3.x, PyPy or Jython. It’s an Open Source project and available under a very liberal BSD license.

## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```

## Configuring the Client

Settings are specified as part of the initialization of the client. The client is a class that can be instanciated with a specific configuration and all reporting can then happen from the instance of that object. Typically an instance is created somewhere globally and then imported as necessary. For getting started all you need is your DSN:

```python
from raven import Client
client = Client('___DSN___')
```

## Capture an Error

The most basic use for raven is to record one specific error that occurs:

```python
from raven import Client

client = Client('___DSN___')

try:
    1 / 0
except ZeroDivisionError:
    client.captureException()
```

## Adding Context

Much of the usefulness of Sentry comes from additional context data with the events. The Python client makes this very convenient by providing methods to set thread local context data that is then submitted automatically with all events. For instance you can use [`user_context()`]({%- link _documentation/clients/python/api.md -%}#raven.Client.user_context "raven.Client.user_context") to set the information about the current user:

```python
def handle_request(request):
    client.user_context({
        'email': request.user.email
    })
```

## Deep Dive

Raven Python is more than that however. To dive deeper into what it does, how it works and how it integrates into other systems there is more to discover:

-   [Basic Usage]({%- link _documentation/clients/python/usage.md -%})
-   [Advanced Usage]({%- link _documentation/clients/python/advanced.md -%})
-   [Logging Breadcrumbs]({%- link _documentation/clients/python/breadcrumbs.md -%})
-   [Integrations]({%- link _documentation/clients/python/integrations/index.md -%})
    -   [Bottle]({%- link _documentation/clients/python/integrations/bottle.md -%})
    -   [Celery]({%- link _documentation/clients/python/integrations/celery.md -%})
    -   [Django]({%- link _documentation/clients/python/integrations/django.md -%})
    -   [Flask]({%- link _documentation/clients/python/integrations/flask.md -%})
    -   [Amazon Web Services Lambda]({%- link _documentation/clients/python/integrations/lambda.md -%})
    -   [Logbook]({%- link _documentation/clients/python/integrations/logbook.md -%})
    -   [Logging]({%- link _documentation/clients/python/integrations/logging.md -%})
    -   [Pylons]({%- link _documentation/clients/python/integrations/pylons.md -%})
    -   [Pyramid]({%- link _documentation/clients/python/integrations/pyramid.md -%})
    -   [RQ]({%- link _documentation/clients/python/integrations/rq.md -%})
    -   [Tornado]({%- link _documentation/clients/python/integrations/tornado.md -%})
    -   [WSGI Middleware]({%- link _documentation/clients/python/integrations/wsgi.md -%})
    -   [ZConfig logging configuration]({%- link _documentation/clients/python/integrations/zconfig.md -%})
    -   [ZeroRPC]({%- link _documentation/clients/python/integrations/zerorpc.md -%})
    -   [Zope/Plone]({%- link _documentation/clients/python/integrations/zope.md -%})
-   [Transports]({%- link _documentation/clients/python/transports.md -%})
-   [Supported Platforms]({%- link _documentation/clients/python/platform-support.md -%})
-   [API Reference]({%- link _documentation/clients/python/api.md -%})

Resources:

-   [Documentation]({%- link _documentation/clients/python/index.md -%})
-   [Bug Tracker](http://github.com/getsentry/raven-python/issues)
-   [Code](http://github.com/getsentry/raven-python)
-   [Mailing List](https://groups.google.com/group/getsentry)
-   [IRC](irc://irc.freenode.net/sentry) (irc.freenode.net, #sentry)
