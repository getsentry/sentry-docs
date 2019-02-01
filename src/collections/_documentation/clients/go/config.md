---
title: Configuration
sidebar_order: 1
---

Go SDK has some configurable options, which can enhance your user experience,
as well as help you track errors more easily.

{:.config-key}
### `SetDSN`

The _DSN_ tells the SDK where to send the events to.  This option is always required
and Go SDKs can pick this up from an environment variable (`SENTRY_DSN`).
When set to empty string, SDK won't send any events to Sentry and all `Capture*` methods
will effectively act as no-ops.

```go
raven.SetDSN("___DSN___")
```

{:.config-key}
### `SetDefaultLoggerName`

The logger name used for the events.

```go
raven.SetDefaultLoggerName("some_logger_name")
```

{:.config-key}
### `SetDebug`

Outputs some debug logs for capturing and sending events.

```go
raven.SetDebug(true)
```

{:.config-key}
### `SetEnvironment`

Sets the environment. This string is freeform and not set by default.  A release can be associated
with more than one environment to separate them in the UI (think `staging` vs `prod` or similar).

```go
raven.SetEnvironment("staging")
```

{:.config-key}
### `SetRelease`

Sets the release. Release names are just strings but some formats are detected by Sentry and might be rendered differently.
For more information have a look at [the releases documentation]({% link _documentation/workflow/releases.md %}).

```go
raven.SetRelease("h3ll0w0rld")
```

{:.config-key}
### `SetSampleRate`

Configures the sample rate as a percentage of events to be sent in the range of `0.0` to `1.0`.  The
default is `1.0` which means that 100% of events are sent.  If set to `0.1` only 10% of events will
be sent.  Events are picked randomly.

```go
raven.SetSampleRate(0.2)
```

{:.config-key}
### `SetIgnoreErrors`

A list of messages to be filtered out before being sent to Sentry.  This list will form a RegExp,
that will check for partial match of either errors message or the message directly passed by the user.

```go
raven.SetIgnoreErrors([]string{"ThirdPartyServiceUnavailable", "Other error that we want to ignore"})
```

{:.config-key}
### `SetIncludePaths`

A list of string prefixes of module names that belong to the app.  This option will be used to determine
whether frame should be marked as user's or native/external code.

```go
raven.SetIncludePaths([]string{"/some/path", "other/path"})
```

