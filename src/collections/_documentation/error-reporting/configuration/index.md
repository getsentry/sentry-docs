---
title: Configuration
sidebar_order: 2
---

SDKs are configurable in many ways.  The options are largely standardized between SDKs but there are
some differences to better accommodate platform peculiarities.  Options are set when the SDK is first
initialized.

{% include components/platform_content.html content_dir='config-intro' %}

## Common Options

The list of common options across SDKs.  These work more or less the same in all SDKs, but some
subtle differences will exist to better support the platform. Options which can be read from an environment variable or your `~/.sentryclirc` file (`SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_RELEASE`) are read automatically. See [Working with Projects]({%- link _documentation/cli/configuration.md -%}#sentry-cli-working-with-projects) for more information. 

{:.config-key}
### `dsn`

The _DSN_ tells the SDK where to send the events to. If this value is not
provided, the SDK will try to read it from the `SENTRY_DSN` environment
variable. If that variable also does not exist, the SDK will just not send any
events.

In runtimes without a process environment (such as the browser) that fallback does not apply.

{:.config-key}
### `debug`

{% unsupported php %}
Turns debug mode on or off.  If debug is enabled SDK will attempt to print out useful debugging
information if something goes wrong with sending the event.  The default is always `false` and
it's generally not recommended to turn it on in production but doing so will not cause any
safety concerns.
{% endunsupported %}

{:.config-key}
### `release`

Sets the release.  Some SDKs will try to automatically configure a release out of the box but
if you have the chance it's a better idea to manually set it.  That way it's guaranteed to be
in sync with your deploy integrations or source map uploads.

Release names are just strings but some formats are detected by Sentry and might be rendered
differently.  For more information have a look at [the releases documentation]({% link _documentation/workflow/releases.md %}).

By default the SDK will try to read this value from the `SENTRY_RELEASE` environment
variable (in the browser SDK, this will be read off of the `window.SENTRY_RELEASE` if
available).

{:.config-key}
### `environment`

Sets the environment.  This string is freeform and not set by default.  A release can be associated
with more than one environment to separate them in the UI (think `staging` vs `prod` or similar).

By default the SDK will try to read this value from the `SENTRY_ENVIRONMENT`
environment variable (except for the browser SDK where this is not applicable).

{:.config-key}
### `error_types`

{% supported php %}
Sets which errors are reported. It takes the same values as PHP's [`error_reporting`](https://www.php.net/manual/errorfunc.configuration.php#ini.error-reporting) configuration parameter.

By default all types of errors are be reported (equivalent to `E_ALL`).
{% endsupported %}

{:.config-key}
### `sample-rate`

Configures the sample rate as a percentage of events to be sent in the range of `0.0` to `1.0`.  The
default is `1.0` which means that 100% of events are sent.  If set to `0.1` only 10% of events will
be sent.  Events are picked randomly.

{:.config-key}
### `max-breadcrumbs`

This variable controls the total amount of breadcrumbs that should be captured.  This defaults
to `100`.

{:.config-key}
### `attach-stacktrace`

When enabled, stack traces are automatically attached to all messages logged.  Stack traces
are always attached to exceptions but when this is set stack traces are also sent with messages. This, for instance, means that stack traces appear next to all log messages.

It's important to note that grouping in Sentry is different for events with stack traces and without.
This means that you will get new groups as you enable or disable this flag for certain events.

This feature is `off` by default.

{:.config-key}
### `send-default-pii`

{% unsupported browser javascript node %}
If this flag is enabled, certain personally identifiable information is added by active integrations. By default no such data is sent.

If possible, it's recommended to turn on this feature to send all such data by default, and manually remove what you don't want to send using our features for managing [_Sensitive Data_]({%- link _documentation/data-management/sensitive-data.md -%}).
{% endunsupported %}

{:.config-key}
### `server-name`

{% unsupported browser %}
Can be used to supply a "server name."  When provided, the name of the server is sent along and
persisted in the event.  For many integrations the server name actually corresponds to
the device hostname even in situations where the machine is not actually a server.  Most SDKs
will attempt to auto-discover this value.
{% endunsupported %}

{:.config-key}
### `blacklist-urls`

{% supported browser browsernpm %}
A list of strings or regex patterns that match error URLs which should not be sent to Sentry.  By default, all errors will be sent.
{% endsupported %}

{:.config-key}
### `whitelist-urls`

{% supported browser browsernpm %}
A list of strings or regex patterns that match error URLs which should exclusively be sent to Sentry.  By default, all errors
will be sent.
{% endsupported %}

{:.config-key}
### `in-app-include`

{% supported python rust csharp php %}
A list of string prefixes of module names that belong to the app. This option takes precedence over `in_app_exclude`.
{% endsupported %}

{:.config-key}
### `in-app-exclude`

{% supported python rust csharp php %}
A list of string prefixes of module names that do not belong to the app, but rather third-party packages. Modules considered not to be part of the app will be hidden from stack traces by default.

This option can be overridden using `in-app-include`.
{% endsupported %}

{:.config-key}
### `request-bodies`

{% supported python php %}
This parameter controls if integrations should capture HTTP request bodies.  It can be set to one
of the following values:

* `never`: request bodies are never sent.
* `small`: only small request bodies will be captured where the cutoff for small depends on the SDK (typically 4KB)
* `medium`: medium-sized requests and small requests will be captured. (typically 10KB)
* `always`: the SDK will always capture the request body for as long as sentry can make sense of it
{% endsupported %}

{:.config-key}
### `with-locals`

{% supported python %}
When enabled local variables are sent along with stackframes.  This can have a performance
and PII impact.  Enabled by default on platforms where this is available.
{% endsupported %}

{:.config-key}
### `ca-certs`

{% supported python %}
A path to an alternative CA bundle file in PEM-format.
{% endsupported %}

## Integration Configuration

For many platform SDKs integrations can be configured alongside it.  On some platforms that
happen as part of the `init()` call, in some others, different patterns apply.

{:.config-key}
### `integrations`

{% unsupported csharp aspnetcore rust %}
In some SDKs, the integrations are configured through this parameter on library initialization.
For more information, have a look at the specific integration documentation.
{% endunsupported %}

{:.config-key}
### `default-integrations`

{% unsupported csharp aspnetcore rust %}
This can be used to disable integrations that are added by default.  When set to `false` no
default integrations are added.
{% endunsupported %}

## Hooks

These options can be used to hook the SDK in various ways to customize the reporting of events.

{:.config-key}
### `before-send`

This function is called with an SDK specific event object and can return a modified event object or
nothing to skip reporting the event.  This can be used for instance for manual PII stripping before
sending.

{:.config-key}
### `before-breadcrumb`

This function is called with an SDK specific breadcrumb object before the breadcrumb is added to the
scope.  When nothing is returned from the function, the breadcrumb is dropped.  To pass the 
breadcrumb through, simply return the first argument, which contains the breadcrumb object.
The callback typically gets a second argument (called a "hint") which contains the original object 
that the breadcrumb was created from to further customize what the breadcrumb should look like.

## Transport Options

Transports are used to send events to Sentry.  This can be customized to some degree to better
support highly specific deployments.

{:.config-key}
### `transport`

{% unsupported php %}
This switches out the transport that is used to send events.  How this works depends on the SDK.  It
can, for instance, be used to capture events for unit-testing or to send it through some more complex
setup that requires proxy authentication.
{% endunsupported %}

{:.config-key}
### `http-proxy`

{% unsupported browser %}
When set, a proxy can be configured that should be used for outbound requests.  This is also used for
HTTPS requests unless a separate `https-proxy` is configured.  However, not all SDKs
support a separate HTTPS proxy.  SDKs will attempt to default to the system-wide configured proxy
if possible.  For instance, on Unix systems, the `http_proxy` environment variable will be picked up.
{% endunsupported %}

{:.config-key}
### `https-proxy`

{% unsupported browser csharp aspnetcore php %}
Configures a separate proxy for outgoing HTTPS requests.  This value might not be supported by all
SDKs.  When not supported the `http-proxy` value is also used for HTTPS requests at all times.
{% endunsupported %}

{:.config-key}
### `shutdown-timeout`

{% unsupported browser php %}
Controls how many seconds to wait before shutting down.  Sentry SDKs send events from a background
queue and this queue is given a certain amount to drain pending events.  The default is SDK specific
but typically around 2 seconds.  Setting this value too low will most likely cause problems for
sending events from command line applications.  Setting it too high will cause the application to
block for a long time for users with network connectivity problems.
{% endunsupported %}
