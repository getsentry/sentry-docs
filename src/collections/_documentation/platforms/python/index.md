---
title: Python
---

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform specific and allow Sentry to have a deep understanding of how your application works.

Install our Python SDK using `pip`:

```bash
$ pip install --upgrade sentry-sdk
```

The SDK provides support for Python 2.7 and 3.4 or later. [Integrations](#integrations) with specific frameworks (particularly asynchronous ones) may impose additional requirements though.

{% include components/alert.html
  title="Upgrading the SDK and want to understand what's new?"
  content="Have a look at the [Changelog](https://github.com/getsentry/sentry-python/releases)."
  level="info"
%}

### Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

Import and initialize the Sentry SDK early in your application’s setup:

```python
import sentry_sdk
sentry_sdk.init(dsn='___PUBLIC_DSN___')
```

### Verifying Your Setup

Great! Now that you’ve completed setting up the SDK, maybe you want to quickly test out how Sentry works. Start by capturing an exception:

```python
sentry_sdk.capture_exception(Exception("This is an example of an error message."))
```

Once the exception is captured, you'll see the error in your Sentry dashboard.

## Capturing Errors

In Python you can either capture a caught exception or the one currently held in `sys.exc_info()` by not passing an argument:

```python
from sentry_sdk import capture_exception

try:
    a_potentially_failing_function()
except Exception as e:
    # Alternatively the argument can be omitted
    capture_exception(e)
```

## Releases

A release is a version of your code that you deploy to an environment. When you give Sentry information about your releases, you unlock many new features:

- Determine the issue and regressions introduced in a new release
- Predict which commit caused an issue and who is likely responsible
- Resolve issues by including the issue number in your commit message
- Receive email notifications when your code gets deployed

After configuring your SDK, setting up releases is a 2-step process:

1. [Create Release and Associate Commits]({%- link _documentation/workflow/releases.md -%}#create-release)
2. [Tell Sentry When You Deploy a Release]({%- link _documentation/workflow/releases.md -%}#create-deploy)

For more information, see [Releases Are Better With Commits](https://blog.sentry.io/2017/05/01/release-commits.html).

## Context

Sentry supports additional context with events. Often this context is shared among any issue captured in its lifecycle, and includes the following components:

**Structured Contexts**

: Structured contexts are typically set automatically.

[**User**](#capturing-the-user)

: Information about the current actor

[**Tags**](#tagging-events)

: Key/value pairs which generate breakdown charts and search filters

[**Level**](#setting-the-level)

: An event's severity

[**Fingerprint**](#setting-the-fingerprint)

: A value used for grouping events into issues

[**Unstructured Extra Data**](#extra-context)

: Arbitrary unstructured data which the Sentry SDK stores with an event sample

### Setting Context

In addition to the structured context that Sentry understands, you can send arbitrary key/value pairs of data which the Sentry SDK will store alongside the event. These are not indexed, and the Sentry SDK uses them to add additional information about what might be happening.

`.set_context()` will take an object as the second argument and place the object inside `contexts` in the event payload.

```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_context("my_cool_data", {"foo": "bar"})
```

### Extra Context

`.set_extra()` is similar to `.set_context()`, however it doesn't have reserved keys.

```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_extra("character_name", "Mighty Fighter")
```

### Unsetting Context

Context is held in the current scope and thus is cleared out at the end of each operation — request, etc. You can also append and pop your own scopes to apply context data to a specific code block or function. Typically, unsetting context happens within an integration. For more information, see our [Python integrations](#integrations).

There are two different scopes for unsetting context — a global scope which Sentry does not discard at the end of an operation, and a scope that can be created by the user.

```python
from sentry_sdk import configure_scope, push_scope, capture_exception

# This will be changed for all future events
with configure_scope() as scope:
    scope.user = some_user

with push_scope() as scope:
    # This will be changed only for the error caught inside and automatically discarded afterward
    scope.user = some_user
    capture_exception(...)
```

### Capturing the User

Sending users to Sentry will unlock many features, primarily the ability to drill down into the number of users affecting an issue, as well as to get a broader sense about the quality of the application.

```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.user = {"email": "john.doe@example.com"}
```

Users consist of a few critical pieces of information which are used to construct a unique identity in Sentry. Each of these is optional, but one **must** be present for the Sentry SDK to capture the user:

**`id`**

: Your internal identifier for the user.

**`username`**

: The user’s username. Generally used as a better label than the internal ID.

**`email`**

: An alternative, or addition, to a username. Sentry is aware of email addresses and can show things like Gravatars, unlock messaging capabilities, and more.

**`ip_address`**

: The IP address of the user. If the user is unauthenticated providing the IP address will suggest that this is unique to that IP. If available, we will attempt to pull this from the HTTP request data.

Additionally, you can provide arbitrary key/value pairs beyond the reserved names, and the Sentry SDK will store those with the user.

### Tagging Events

Sentry implements a system it calls tags. Tags are various key/value pairs that get assigned to an event, and the user can later use them as a breakdown or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.set_tag("page_locale", "de-at")
```

For more information, see the [Tagging Events section]({%- link _documentation/enriching-error-data/context.md -%}#tagging-events) in Context.

### Setting the Level

You can set the severity of an event to one of five values: fatal, error, warning, info, and debug. error is the default, fatal is the most severe, and debug is the least severe.

```python
from sentry_sdk import configure_scope

with configure_scope() as scope:
    scope.level = 'warning'
```

### Setting the Fingerprint

Sentry uses a fingerprint to decide how to group errors into issues.

For some very advanced use cases, you can override the Sentry default grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information and should be an array of strings.

If you wish to append information, thus making the grouping slightly less aggressive, you can do that as well by adding the special string `{{default}}` as one of the items.

For more information, see [Aggregate Errors with Custom Fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).

## Advanced Usage

### Advanced Configuration

The Sentry SDK sets the options when you first initialize the SDK.

```python
import sentry_sdk

sentry_sdk.init(
    'https://<key>@sentry.io/<project>',
    max_breadcrumbs=50,
    debug=True,
)
```

For more information, see:

- [Sentry’s complete list of Common Options across SDKs]({%- link _documentation/error-reporting/configuration/index.md -%})
- [Full documentation on Environments]({%- link _documentation/enriching-error-data/environments.md -%})

### Breadcrumbs

Sentry will automatically record certain events, such as changes to the URL and XHR requests to provide context to an error.

You can manually add breadcrumbs on other events or disable breadcrumbs.

```python
from sentry_sdk import add_breadcrumb

add_breadcrumb(
    category='auth',
    message='Authenticated user %s' % user.email,
    level='info',
)
```

For more information, see:

- [Full documentation on Breadcrumbs]({%- link _documentation/enriching-error-data/breadcrumbs.md -%})
- [Debug Issues Faster with Breadcrumbs](https://blog.sentry.io/2016/05/04/breadcrumbs).

### Filter Events & Custom Logic

Sentry exposes a beforeSend callback which can be used to filter out information or add additional context to the event object.

```python
import sentry_sdk

def strip_sensitive_data(event, hint):
    # modify event here
    return event

sentry_sdk.init(
    before_send=strip_sensitive_data
)
```

For more information, see:

- [Full documentation on Filtering Events]({%- link _documentation/error-reporting/configuration/filtering.md -%})
- [Manage Your Flow of Errors Using Inbound Filters](https://blog.sentry.io/2017/11/27/setting-up-inbound-filters).

### Integrations

*Integrations* extend the functionality of the SDK for some common frameworks and libraries. Similar to plugins, they extend the functionality of the Sentry SDK. A call to `sentry_sdk.init` configures integrations. Unless you set `default_integrations` to `False`, Sentry automatically adds any default integration not in the list below.

#### Web Frameworks

- [Django]({%- link _documentation/platforms/python/django.md -%})
- [Flask]({%- link _documentation/platforms/python/flask.md -%})
- [Sanic]({%- link _documentation/platforms/python/sanic.md -%})
- [Pyramid]({%- link _documentation/platforms/python/pyramid.md -%})
- [AIOHTTP]({%- link _documentation/platforms/python/aiohttp.md -%})
- [Tornado]({%- link _documentation/platforms/python/tornado.md -%})
- [Bottle]({%- link _documentation/platforms/python/bottle.md -%})
- [Falcon]({%- link _documentation/platforms/python/falcon.md -%})
- [Generic WSGI]({%- link _documentation/platforms/python/wsgi.md -%})
- [Generic ASGI]({%- link _documentation/platforms/python/asgi.md -%})

#### Task Queues

- [Celery]({%- link _documentation/platforms/python/celery.md -%})
- [RQ (Redis Queue)]({%- link _documentation/platforms/python/rq.md -%})

#### Serverless

- [AWS Lambda]({%- link _documentation/platforms/python/aws_lambda.md -%})
- [Generic Serverless]({%- link _documentation/platforms/python/serverless.md -%})

#### Other Integrations

- [Logging]({%- link _documentation/platforms/python/logging.md -%})
- [GNU Backtrace]({%- link _documentation/platforms/python/gnu_backtrace.md -%})
- [Redis]({%- link _documentation/platforms/python/redis.md -%})

### Default Integrations

System integrations are integrations enabled by default that integrate into the standard library or the interpreter itself. Sentry documents them so you can see what they do and that they can be disabled if they cause issues. To disable system integrations, set `default_integrations=False` when calling `init()`.

For more information, see full documentation on [Default Integrations]({%- link _documentation/platforms/python/default-integrations.md -%}).

## Hints

The Python SDK provides some common [hints]({% link _documentation/error-reporting/configuration/filtering.md %}#event-hints) for breadcrumbs and events.  These hints are passed as the `hint` parameter to `before_send` and `before_breadcrumb` (as well as event processors) as a dictionary.  More than one hint can be supplied, but this is rare.

`exc_info`

: If you set this hint, then it's an exc info tuple in the form `(exc_type, exc_value, tb)`.  This can be used to extract additional information from the original error object.

`log_record`

: This hint is passed to breadcrumbs and contains the log record that created it.  It can be used to extract additional information from the original `logging` log record that is not extracted by default. Likewise, it can be useful to discard uninteresting breadcrumbs.

`httplib_request`

: An `httplib` request object for breadcrumbs created from HTTP requests.
