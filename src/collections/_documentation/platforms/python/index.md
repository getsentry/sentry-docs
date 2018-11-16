---
title: Python
sidebar_order: 3
---

Getting started with Sentry is a simple three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#pick-a-client-integration)
3.  [Configure it](#configure-the-sdk)

For an overview of what Sentry does, take a look at the Sentry [workflow](https://blog.sentry.io/2018/03/06/the-sentry-workflow).

&nbsp;
## Install the SDK {#pick-a-client-integration}

Monitor and fix crashes in real time. Sentry captures data by using an SDK within your app's runtime. SDKs are platform specific. If your environment is unique, feel free to implement your own SDK using our [_SDK API_]({%- link _documentation/development/sdk-dev/index.md -%}).

```
$ pip install --upgrade sentry-sdk==0.5.4 
```

{% wizard %}

{% wizard hide %}

&nbsp;
## Configure the SDK {#configure-the-sdk}

Setting up a project in Sentry will provide you with a _DSN_, or _Data Source Name_. It may look like a URL, but it's actually just a representation of the configuration required by Sentry SDKs. The DSN consists of a few pieces, including the protocol, public key, server address, and project identifier.
{% endwizard %}

```
import sentry_sdk
sentry_sdk.init("[project specific DSN here]")
```

Most SDKs will now automatically collect available data. Some SDKs may require a few extra configurations because not all platforms are created equal and limitations prevent automatic error collecting.
{% endwizard %}

&nbsp;

{% capture __alert_content -%}
As of Sentry 9, there's no need to provide the secret key. Older versions of SDKs may require you to provide the DSN --- including the secret --- which is now called DSN (Legacy). If you still need to provide the secret, check the corresponding SDK docs.

Find the DSN in Sentry by navigating to [Project Name] -> Project Settings -> Client Keys (DSN). Its template resembles the following:

```
'{PROTOCOL}://{PUBLIC_KEY}@{HOST}/{PROJECT_ID}'
```

If you’re using Heroku, and you’ve added Hosted Sentry via the standard addon hooks, most SDKs will automatically pick up the `SENTRY_DSN` environment variable that we’ve already configured for you.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

&nbsp;
## Integrations

Streamline your process flow with integrations. Integrations are plugins that extend the functionality of the SDK. They're configured by a call to `sentry_sdk.init`.  Any default integration not in the list is automatically added unless `default_integrations` is set to `False`.

&nbsp;
### Framework Integrations

Framework integrations are opt-in integrations for large frameworks or libraries.  Currently
the following are supported:

* [Celery]({% link _documentation/platforms/python/celery.md %})
* [Django]({% link _documentation/platforms/python/django.md %})
* [Flask]({% link _documentation/platforms/python/flask.md %})
* [Sanic]({% link _documentation/platforms/python/sanic.md %})
* [Pyramid]({% link _documentation/platforms/python/pyramid.md %})
* [Logging]({% link _documentation/platforms/python/logging.md %})
* [RQ (Redis Queue)]({% link _documentation/platforms/python/rq.md %})

&nbsp;
### Other Integrations

In addition to framework integrations there are also a few other integrations:

* [AWS Lambda]({% link _documentation/platforms/python/aws_lambda.md %})
* [Default integrations]({% link _documentation/platforms/python/default-integrations.md %})

&nbsp;
## Hints

The Python SDK provides some common [hints]({% link _documentation/error-reporting/configuration/filtering.md %}#event-hints) for breadcrumbs
and events.  These hints are passed as the `hint` parameter to `before_send` and `before_breadcrumb`
(as well as event processors) as a dictionary.  More than one hint can be supplied but this is rare.

`exc_info`

: If this hint is set then it's an exc info tuple in the form `(exc_type, exc_value, tb)`.  This
  can be used to extract additional information from the original error object.

`log_record`

: This hint is passed to breadcrumbs and contains the log record that created it.  It can be used
  to extract additional information from the original `logging` log record that is not extracted by default.
  Likewise it can be useful to discard uninteresting breadcrumbs.

`httplib_request`

: An `httplib` request object for breadcrumbs created from HTTP requests.

&nbsp;
## Next Steps

Now that you’ve got basic reporting setup, you’ll want to explore adding extra context to your data.

-   [_manual error and event capturing_]({%- link _documentation/error-reporting/capturing.md -%})
-   [_configuration options_]({%- link _documentation/error-reporting/configuration/index.md -%})
-   [_adding context (tags, user and extra information)_]({%- link _documentation/enriching-error-data/context.md -%})
-   [_tracing issues with breadcrumbs_]({%- link _documentation/enriching-error-data/breadcrumbs.md -%})
-   [_capturing user feedback on crashes_]({%- link _documentation/enriching-error-data/user-feedback.md -%})

&nbsp;
{% capture __alert_content -%}
Looking for [the legacy Python SDK "Raven"?]({%- link _documentation/clients/python/index.md -%})
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}