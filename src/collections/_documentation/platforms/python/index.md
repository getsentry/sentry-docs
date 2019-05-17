---
title: Python
---

{% include learn-sdk.md platform="python" %}

The [Sentry Python SDK](https://pypi.org/project/sentry-sdk) provides support
for Python 2.7 and 3.4 or later.

This documentation goes over some Python specific things such as integrations to
frameworks.

## Integrations

*Integrations* extend the functionality of the SDK for some common frameworks and
libraries. Similar to plugins, they extend the functionality of the Sentry
SDK. A call to `sentry_sdk.init` configures integrations. Unless you set `default_integrations` to `False`, Sentry automatically adds any default integration not in the list below.

### Web Frameworks

* [Django]({% link _documentation/platforms/python/django.md %})
* [Flask]({% link _documentation/platforms/python/flask.md %})
* [Sanic]({% link _documentation/platforms/python/sanic.md %})
* [Pyramid]({% link _documentation/platforms/python/pyramid.md %})
* [AIOHTTP]({% link _documentation/platforms/python/aiohttp.md %})
* [Tornado]({% link _documentation/platforms/python/tornado.md %})
* [Bottle]({% link _documentation/platforms/python/bottle.md %})
* [Falcon]({% link _documentation/platforms/python/falcon.md %})
* [Generic WSGI]({% link _documentation/platforms/python/wsgi.md %})

### Task Queues

* [Celery]({% link _documentation/platforms/python/celery.md %})
* [RQ (Redis Queue)]({% link _documentation/platforms/python/rq.md %})

### Serverless

* [AWS Lambda]({% link _documentation/platforms/python/aws_lambda.md %})
* [Generic Serverless]({% link _documentation/platforms/python/serverless.md %})

### Other Integrations

* [Logging]({% link _documentation/platforms/python/logging.md %})
* [GNU Backtrace]({% link _documentation/platforms/python/gnu_backtrace.md %})
* [Default integrations]({% link _documentation/platforms/python/default-integrations.md %})

{% capture __alert_content -%}
Looking for [the legacy Python SDK "Raven"?]({%- link _documentation/clients/python/index.md -%})
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Hints

The Python SDK provides some common [hints]({% link _documentation/error-reporting/configuration/filtering.md %}#event-hints) for breadcrumbs and events.  These hints are passed as the `hint` parameter to `before_send` and `before_breadcrumb` (as well as event processors) as a dictionary.  More than one hint can be supplied, but this is rare.

`exc_info`

: If you set this hint, then it's an exc info tuple in the form `(exc_type, exc_value, tb)`.  This can be used to extract additional information from the original error object.

`log_record`

: This hint is passed to breadcrumbs and contains the log record that created it.  It can be used to extract additional information from the original `logging` log record that is not extracted by default. Likewise, it can be useful to discard uninteresting breadcrumbs.

`httplib_request`

: An `httplib` request object for breadcrumbs created from HTTP requests.
