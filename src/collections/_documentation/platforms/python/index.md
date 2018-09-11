---
title: Python
sidebar_order: 3
---

The [Sentry Python SDK](https://pypi.org/project/sentry-sdk) provides Sentry
support for Python 2.7 and 3.4 or later.

The Python SDK follows the new unified SDK architecture.  To get started
have a look at the [quickstart]({% link _documentation/learn/quickstart.md
%}?platform=python) docs.

This documentation goes over some Python specific things such as integrations to
frameworks.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks and
libraries.  They can be seen as plugins that extend the functionality of the Sentry
SDK.  Integrations are configured by a call to `sentry_sdk.init`.  Any default
integration not in the list is automatically added unless `default_integrations` is
set to `False`.

### Framework Integrations

Framework integrations are opt-in integrations for large frameworks or libraries.  Currently
the following are supported:

* [Celery]({% link _documentation/platforms/python/celery.md %})
* [Django]({% link _documentation/platforms/python/django.md %})
* [Flask]({% link _documentation/platforms/python/flask.md %})
* [Logging]({% link _documentation/platforms/python/logging.md %})

### Other Integrations

In addition to framework integrations there are also a few other integrations:

* [Default integrations]({% link _documentation/platforms/python/default-integrations.md %})
* [Requests integration]({% link _documentation/platforms/python/requests.md %})
