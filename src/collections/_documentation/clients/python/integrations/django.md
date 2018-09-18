---
title: Django
sidebar_order: 6
---

[Django](http://djangoproject.com/) version 1.4 and newer are supported.

## Installation

If you haven’t already, start by downloading Raven. The easiest way is with _pip_:

```bash
pip install raven --upgrade
```

<!-- WIZARD -->
## Setup

Using the Django integration is as simple as adding `raven.contrib.django.raven_compat` to your installed apps:

```python
INSTALLED_APPS = (
    'raven.contrib.django.raven_compat',
)
```

{% capture __alert_content -%}
This causes Raven to install a hook in Django that will automatically report uncaught exceptions.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

Additional settings for the client are configured using the `RAVEN_CONFIG` dictionary:

```python
import os
import raven

RAVEN_CONFIG = {
    'dsn': '___DSN___',
    # If you are using git, you can also automatically configure the
    # release based on the git info.
    'release': raven.fetch_git_sha(os.path.abspath(os.pardir)),
}
```

Once you’ve configured the client, you can test it using the standard Django management interface:

```bash
python manage.py raven test
```

You’ll be referencing the client slightly differently in Django as well:

```python
from raven.contrib.django.raven_compat.models import client

client.captureException()
```
<!-- ENDWIZARD -->

## Using with Raven.js {#using-with-raven-js}

A Django template tag is provided to render a proper public DSN inside your templates, you must first load `raven`:

```django
{% raw %}{% load raven %}{% endraw %}
```

Inside your template, you can now use:

```html
{% raw %}<script>Raven.config('{% sentry_public_dsn %}').install()</script>{% endraw %}
```

By default, the DSN is generated in a protocol relative fashion, e.g. `//public@example.com/1`. If you need a specific protocol, you can override:

```html
{% raw %}{% sentry_public_dsn 'https' %}{% endraw %}
```

See the [_Raven.js documentation_]({%- link _documentation/clients/javascript/index.md -%}) for more information.

## Integration with `logging`

To integrate with the standard library’s `logging` module, and send all ERROR and above messages to sentry, the following config can be used:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'root': {
        'level': 'WARNING',
        'handlers': ['sentry'],
    },
    'formatters': {
        'verbose': {
            'format': '%(levelname)s  %(asctime)s  %(module)s '
                      '%(process)d  %(thread)d  %(message)s'
        },
    },
    'handlers': {
        'sentry': {
            'level': 'ERROR', # To capture more than ERROR, change to WARNING, INFO, etc.
            'class': 'raven.contrib.django.raven_compat.handlers.SentryHandler',
            'tags': {'custom-tag': 'x'},
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        }
    },
    'loggers': {
        'django.db.backends': {
            'level': 'ERROR',
            'handlers': ['console'],
            'propagate': False,
        },
        'raven': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        },
        'sentry.errors': {
            'level': 'DEBUG',
            'handlers': ['console'],
            'propagate': False,
        },
    },
}
```

### Usage

Logging usage works the same way as it does outside of Django, with the addition of an optional `request` key in the extra data:

```python
logger.error('There was some crazy error', exc_info=True, extra={
    # Optionally pass a request and we'll grab any information we can
    'request': request,
})
```

## 404 Logging {#logging}

In certain conditions you may wish to log 404 events to the Sentry server. To do this, you simply need to enable a Django middleware:

```python
# Use ``MIDDLEWARE_CLASSES`` prior to Django 1.10
MIDDLEWARE = (
    'raven.contrib.django.raven_compat.middleware.Sentry404CatchMiddleware',
    ...,
) + MIDDLEWARE
```

It is recommended to put the middleware at the top, so that only 404s that bubbled all the way up get logged. Certain middlewares (e.g. flatpages) capture 404s and replace the response.

It is also possible to configure this middleware to ignore 404s on particular pages by defining the `IGNORABLE_404_URLS` setting as an iterable of regular expression patterns. If any pattern produces a match against the full requested URL (as defined by the regular expression’s `search` method), then the 404 will not be reported to Sentry.

```python
import re

IGNORABLE_404_URLS = (
    re.compile('/foo'),
)
```

## Message References

Sentry supports sending a message ID to your clients so that they can be tracked easily by your development team. There are two ways to access this information, the first is via the `X-Sentry-ID` HTTP response header. Adding this is as simple as appending a middleware to your stack:

```python
# Use ``MIDDLEWARE_CLASSES`` prior to Django 1.10
MIDDLEWARE = MIDDLEWARE + (
  # We recommend putting this as high in the chain as possible
  'raven.contrib.django.raven_compat.middleware.SentryResponseErrorIdMiddleware',
  ...,
)
```

Another alternative method is rendering it within a template. By default, Sentry will attach `request.sentry` when it catches a Django exception. In our example, we will use this information to modify the default `500.html` which is rendered, and show the user a case reference ID. The first step in doing this is creating a custom `handler500()` in your `urls.py` file:

```python
from django.conf.urls.defaults import *

from django.views.defaults import page_not_found, server_error
from django.template.response import TemplateResponse

def handler500(request):
    """500 error handler which includes ``request`` in the context.

 Templates: `500.html`
 Context: None
 """

    context = {'request': request}
    template_name = '500.html'  # You need to create a 500.html template.
    return TemplateResponse(request, template_name, context, status=500)
```

Once we’ve successfully added the `request` context variable, adding the Sentry reference ID to our `500.html` is simple:

```html
{% raw %}<p>You've encountered an error, oh noes!</p>
{% if request.sentry.id %}
    <p>If you need assistance, you may reference this error as
    <strong>{{ request.sentry.id }}</strong>.</p>
{% endif %}{% endraw %}
```

## WSGI Middleware

If you are using a WSGI interface to serve your app, you can also apply a middleware which will ensure that you catch errors even at the fundamental level of your Django application:

```python
from raven.contrib.django.raven_compat.middleware.wsgi import Sentry
from django.core.wsgi import get_wsgi_application

application = Sentry(get_wsgi_application())
```

## User Feedback {#python-django-user-feedback}

To enable user feedback for crash reports, start with ensuring the `request` value is available in your context processors:

```python
TEMPLATE_CONTEXT_PROCESSORS = (
    # ...
    'django.core.context_processors.request',
)
```

By default Django will render `500.html`, so simply drop the following snippet into your template:

```html
{% raw %}<!-- Sentry JS SDK 2.1.+ required -->
<script src="https://cdn.ravenjs.com/2.3.0/raven.min.js"></script>

{% if request.sentry.id %}
  <script>
  Raven.showReportDialog({
    eventId: '{{ request.sentry.id }}',

    // use the public DSN (dont include your secret!)
    dsn: '___PUBLIC_DSN___'
  });
  </script>
{% endif %}{% endraw %}
```

That’s it!

For more details on this feature, see the [_User Feedback guide_]({%- link _documentation/learn/user-feedback.md -%}).

## Additional Settings

`SENTRY_CLIENT`

: In some situations you may wish for a slightly different behavior to how Sentry communicates with your server. For this, Raven allows you to specify a custom client:

  ```python
  SENTRY_CLIENT = 'raven.contrib.django.raven_compat.DjangoClient'
  ```

`SENTRY_CELERY_LOGLEVEL`

: If you are also using Celery, there is a handler being automatically registered for you that captures the errors from workers. The default logging level for that handler is `logging.ERROR` and can be customized using this setting:

  ```python
  SENTRY_CELERY_LOGLEVEL = logging.INFO
  ```

  Alternatively you can use a similarly named key in `RAVEN_CONFIG`:

  ```python
  RAVEN_CONFIG = {
      'CELERY_LOGLEVEL': logging.INFO
  }
  ```

`SENTRY_CELERY_IGNORE_EXPECTED`

: If you are also using Celery, then you can ignore expected exceptions by setting this to `True`. This will cause exception classes in `Task.throws` to be ignored.

## Caveats

The following things you should keep in mind when using Raven with Django.

### Error Handling Middleware

If you already have middleware in place that handles `process_exception()` you will need to take extra care when using Sentry.

For example, the following middleware would suppress Sentry logging due to it returning a response:

```python
class MyMiddleware(object):
    def process_exception(self, request, exception):
        return HttpResponse('foo')
```

To work around this, you can either disable your error handling middleware, or add something like the following:

```python
from django.core.signals import got_request_exception

class MyMiddleware(object):
    def process_exception(self, request, exception):
        # Make sure the exception signal is fired for Sentry
        got_request_exception.send(sender=self, request=request)
        return HttpResponse('foo')
```

Note that this technique may break unit tests using the Django test client (`django.test.client.Client`) if a view under test generates a `Http404` or `PermissionDenied` exception, because the exceptions won’t be translated into the expected 404 or 403 response codes.

Or, alternatively, you can just enable Sentry responses:

```python
from raven.contrib.django.raven_compat.models import sentry_exception_handler

class MyMiddleware(object):
    def process_exception(self, request, exception):
        # Make sure the exception signal is fired for Sentry
        sentry_exception_handler(request=request)
        return HttpResponse('foo')
```

### Circus

If you are running Django with [circus](http://circus.rtfd.org/) and [chaussette](https://chaussette.readthedocs.io/) you will also need to add a hook to circus to activate Raven:

```python
from django.conf import settings
from django.core.management import call_command

def run_raven(*args, **kwargs):
    """Set up raven for django by running a django command.
 It is necessary because chaussette doesn't run a django command.
 """
    if not settings.configured:
        settings.configure()

    call_command('validate')
    return True
```

And in your circus configuration:

```ini
[socket:dwebapp]
host = 127.0.0.1
port = 8080

[watcher:dwebworker]
cmd = chaussette --fd $(circus.sockets.dwebapp) dproject.wsgi.application
use_sockets = True
numprocesses = 2
hooks.after_start = dproject.hooks.run_raven
```
