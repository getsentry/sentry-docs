---
title: Default Integrations
sidebar_order: 10
---

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself.  They are documented so you can see
what they do and that they can be disabled if they cause issues.  To disable
system integrations, set `default_integrations=False` when calling `init()`.

## Atexit
*Import name: `sentry_sdk.integrations.atexit.AtExitIntegration`*

This integrates with the interpreter's `atexit` system to automatically flush
events from the background queue on interpreter shutdown.  Typically, one does
not need to disable this.  Even if the functionality is not wanted, it can also
be disabled by setting the `shutdown_timeout` to `0` in the options to
`init()`.

## Excepthook
*Import name: `sentry_sdk.integrations.excepthook.ExceptHookIntegration`*

This integration registers with the interpreter's except hook system.  Through this,
any exception that is unhandled will be reported to Sentry automatically.  Exceptions
raised interactive interpreter sessions will not be reported.

## Deduplication
*Import name: `sentry_sdk.integrations.dedupe.DedupeIntegration`*

This integration deduplicates certain events.  This is enabled by default and should not
be disabled except in rare circumstances.  Disabling this integration for instance will
cause duplicate error logging in the Flask framework.

## Stdlib
*Import name: `sentry_sdk.integrations.stdlib.StdlibIntegration`*

The stdlib integration instruments certain modules in the standard library to emit
breadcrumbs.  This is enabled by default and rarely makes sense to disable.

In detail it provides:

* Breadcrumbs for HTTP requests done using `httplib`, which also includes
  traffic going through `requests`.

## Modules
*Import name: `sentry_sdk.integrations.modules.ModulesIntegration`*

Send a list of installed Python packages along with each event.

## Argv
*Import name: `sentry_sdk.integrations.argv.ArgvIntegration`*

{% version_added 0.5.0 %}

Add `sys.argv` as `extra` attribute to each event.

## Logging
*Import name: `sentry_sdk.integrations.logging.LoggingIntegration`*

See [_Logging_]({% link _documentation/platforms/python/logging.md %})
