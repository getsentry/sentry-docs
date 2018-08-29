---
title: Configuration
sidebar_order: 4
---

SDKs are configurable in many ways.  The options are largely standardized between SDKs but there are
some differences to better acomodate platform peculiarities.  Options are set when the SDK is first
initialized.

{% include components/platform_content.html content_dir='config-intro' %}

## Common Options

The list of common options across SDKs.  These work more or less the same in all SDKs but some
subtle differences will exist to better support the platform.

{:.config-key}
### debug

Turns debug mode on or off.  If debug is enabled SKD will attempt to print out useful debugging
information if something goes wrong with sending the event.  The default is always `false` and
it's generally not recommended to turn it on in production but doing so will not cause any
safety concerns.

{:.config-key}
### release

Sets the release.  Some SDKs will try to automatically configure a release out of the box but
if you have the chance it's a better idea to manually set it.  That way it's guaranteed to be
in sync with your deploy integrations or sourcemap uploads.

Release names are just strings but some formats are detected by Sentry and might be rendered
differently.  For more information have a look at [the releases documentation]({% link _documentation/learn/releases.md %}).

{:.config-key}
### environment

Sets the environment.  This string is freeform and not set by default.  A release can be associated
with more than one environment to separate them im the UI (think `staging` vs `prod` or similar).

{:.config-key}
### repos

For repository integration the repository identifiers need to be sent along.  For more information
have a look at [the releases documentation]({% link _documentation/learn/releases.md %}).

{:.config-key}
### sample-rate

Configures the sample rate as a percentage of events to be sent in the range of `0.0` to `1.0`.  The
default is `1.0` which means that 100% of events are sent.  If set to `0.1` only 10% of events will
be sent.  Events are picked randomly.

{:.config-key}
### max-breadcrumbs

This variable controls the total amount of breadcrumbs that should be captured.  This defaults
to `100`.

{:.config-key}
### http-proxy

When set a proxy can be configured that should be used for outbound requests.  This is also used for
HTTPS requests unless a separate `https-proxy` is configured.  Note however that not all SDKs
support a separate HTTPS proxy.  SDKs will attempt to default to the system wide configured proxy
if possible.  For instance on unix systems the `http_proxy` environment variable will be picked up.

{:.config-key}
### https-proxy

{% unsupported csharp aspnetcore %}
Configures a separate proxy for outgoing HTTPS requests.  This value might not be supported by all
SDKs.  When not supported the `http-proxy` value is also used for HTTPS requests at all times.
{% endunsupported %}

{:.config-key}
### attach-stacktrace

When enabled stacktraces are automatically attached to all messages logged.  Note that stacktraces
are always attached to exceptions but when this is set stacktraces are also sent with messages.  This
for instance means that stacktraces appear next to all log messages.

It's important to note that grouping in Sentry is different for events with stacktraces and without.
This means that you will get new groups as you enable or disable this flag for certain events.

This feature is off by default.

{:.config-key}
### with-locals

{% supported python %}
When enabled local variables are sent along with stackframes.  This can have a performance
and PII impact.  Enabled by default on platforms where this is available.
{% endsupported %}

{:.config-key}
### send-default-pii

If this flag is enabled then certain personally identifyable information is added by active
integrations.  Without this flag they are never added to the event to begin with.  If possible
it's recommended to turn on this feature and use the server side PII stripping to remove the
values instead.

{:.config-key}
### shutdown-timeout

{% unsupported browser %}
Controls how many seconds to wait before shutting down.  Sentry SDKs send events from a background
queue and this queue is given a certain amount to drain pending events.  The default is SDK specific
but typically around 2 seconds.  Setting this value too low will most likely cause problems for
sending events from command line applications.  Setting it too high will cause the application to
block for long time for users with network connectivity problems.
{% endunsupported %}

{:.config-key}
### server-name

{% unsupported browser %}
Can be used to supply a "server name".  When provided the name of the server is sent along and
persisted in the event.  Note that for many integrations the server name actually corresponds to
the device hostname even in situations where the machine is not actually a server.  Most SDKs
will attempt to auto discover this value.
{% endunsupported %}

{:.config-key}
### blacklist-urls

{% supported browser %}
A pattern for error URLs which should not be sent to Sentry.  To whitelist certain errors instead,
use `whitelist-urls`.  By default, all errors will be sent.  This only applies to events sent
from browsers.
{% endsupported %}

{:.config-key}
### whitelist-urls

{% supported browser %}
A pattern for error URLs which should exclusively be sent to Sentry.  To
blacklist certain errors instead, use `blacklist-urls`.  By default, all errors
will be sent.  This only applies to events sent from browsers.
{% endsupported %}

## Integration Configuration

For many platform SDKs integrations can be configured alongside it.  On some platforms that
happens as part of the `init()` call, in some others different patterns apply.

{:.config-key}
### integrations

{% unsupported csharp aspnetcore rust %}
In some SDKs the integrations are configured through this parameter on library initialization.
For more information have a look at the specific integration documentation.
{% endunsupported %}

{:.config-key}
### default-integrations

{% supported python %}
This can be used to disable integrations that are added by default.  When set to `false` no
default integrations are added.
{% endsupported %}
