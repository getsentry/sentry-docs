---
title: Python
sidebar_order: 12
robots: noindex
---

For pairing Sentry up with Python you can use the Raven for Python (raven-python) library. It is the official standalone Python client for Sentry. It can be used with any modern Python interpreter be it CPython 2.x or 3.x, PyPy or Jython. It’s an Open Source project and available under a very liberal BSD license.

<!-- WIZARD -->
## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```
<!-- ENDWIZARD -->

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
-   [Integrations]({%- link _documentation/clients/python/integrations.md -%})
    -   [Bottle]({%- link _documentation/clients/python/integrations.md -%}#bottle)
    -   [Celery]({%- link _documentation/clients/python/integrations.md -%}#celery)
    -   [Django]({%- link _documentation/clients/python/integrations.md -%}#django)
    -   [Flask]({%- link _documentation/clients/python/integrations.md -%}#flask)
    -   [Amazon Web Services Lambda]({%- link _documentation/clients/python/integrations.md -%}#lambda)
    -   [Logbook]({%- link _documentation/clients/python/integrations.md -%}#logbook)
    -   [Logging]({%- link _documentation/clients/python/integrations.md -%}#logging)
    -   [Pylons]({%- link _documentation/clients/python/integrations.md -%}#pylons)
    -   [Pyramid]({%- link _documentation/clients/python/integrations.md -%}#pyramid)
    -   [RQ]({%- link _documentation/clients/python/integrations.md -%}#rq)
    -   [Tornado]({%- link _documentation/clients/python/integrations.md -%}#tornado)
    -   [WSGI Middleware]({%- link _documentation/clients/python/integrations.md -%}#wsgi)
    -   [ZConfig logging configuration]({%- link _documentation/clients/python/integrations.md -%}#zconfig)
    -   [ZeroRPC]({%- link _documentation/clients/python/integrations.md -%}#zerorpc)
    -   [Zope/Plone]({%- link _documentation/clients/python/integrations.md -%}#zope)
-   [Transports]({%- link _documentation/clients/python/transports.md -%})
-   [Supported Platforms]({%- link _documentation/clients/python/platform-support.md -%})
-   [API Reference]({%- link _documentation/clients/python/api.md -%})

Resources:

-   [Documentation]({%- link _documentation/clients/python/index.md -%})
-   [Bug Tracker](http://github.com/getsentry/raven-python/issues)
-   [Code](http://github.com/getsentry/raven-python)
-   [Mailing List](https://groups.google.com/group/getsentry)
-   [IRC](irc://irc.freenode.net/sentry) (irc.freenode.net, #sentry)
