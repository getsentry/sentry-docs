---
title: System
sidebar_order: 4
---

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself.  They are documented so you can see
what they do and that they can be disabled if they cause issues.  To disable
system integrations set `default_integrations=False` when calling `init()`.

## Atexit
This integrates with the interpreter's `atexit` system to automatically flush
events from the background queue on interpreter shutdown.  Typically one does
not need to disable this.  Even if the functionality is not wanted it can also
be disabled by setting the `shutdown_timeout` to `0` in the options to
`init()`.

Import name: `sentry_sdk.integrations.atexit.AtExitIntegration`

## Excepthook
This integration registers with the interpreter's except hook system.  Through this
any exception that is unhandled will be reported to Sentry automatically.  Exceptions
raised interactive interpreter sessions will not be reported.

Import name: `sentry_sdk.integrations.excepthook.ExceptHookIntegration`

## Deduplication
This integration deduplicates certian events.  This is enabled by default and should not
be disabled except in rare circumstances.  Disabling this integration for instance will
cause duplicate error logging in the Flask framework.

Import name: `sentry_sdk.integrations.dedupe.DedupeIntegration`

## Stdlib
The stdlib integration instruments certain modules in the standard library to emit
breadcrumbs.  This is enabled by default and rarely makes sense to disable.

Import name: `sentry_sdk.integrations.stdlib.StdlibIntegration`
