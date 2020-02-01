---
title: Default Integrations
sidebar_order: 10
---

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself.  Sentry documents them so you can see
what they do and that they can be disabled if they cause issues.  To disable
all system integrations, set `default_integrations=False` when calling `init()`.

## Atexit
*Import name: `sentry_sdk.integrations.atexit.AtexitIntegration`*

This integrates with the interpreter's `atexit` system to automatically flush
events from the background queue on interpreter shutdown.  Typically, one does
not need to disable this.  Even if the functionality is not wanted, it's easier to disable it by setting the `shutdown_timeout` to `0` in the options passed to
`init()`.

## Excepthook
*Import name: `sentry_sdk.integrations.excepthook.ExcepthookIntegration`*

This integration registers with the interpreter's except hook system.  Through this,
any exception that is unhandled will be reported to Sentry automatically.  Note that exceptions
raised in interactive interpreter sessions will not be reported.

### Options

You can pass the following keyword arguments to `ExcepthookIntegration()`:

* `always_run`:
    
  ```bash
  $ python
  >>> import sentry_sdk
  >>> from sentry_sdk.integrations.excepthook import ExcepthookIntegration
  >>> sentry_sdk.init(..., integrations=[ExcepthookIntegration(always_run=True)])
  >>> raise Exception("I will become an error")
  ```

  By default, the SDK does not capture errors occurring in the REPL (`always_run=False`).

## Deduplication
*Import name: `sentry_sdk.integrations.dedupe.DedupeIntegration`*

This integration deduplicates certain events. The Sentry Python SDK enables it by default, and it should not be disabled except in rare circumstances. Disabling this integration, for instance, will cause duplicate error logging in the Flask framework.

## Stdlib
*Import name: `sentry_sdk.integrations.stdlib.StdlibIntegration`*

The stdlib integration instruments certain modules in the standard library to emit breadcrumbs.  The Sentry Python SDK enables this by default, and it rarely makes sense to disable.

* Any outgoing HTTP request done with `httplib` will result in a [breadcrumb]({%- link _documentation/enriching-error-data/breadcrumbs.md -%}) being logged. `urllib3` and `requests` use `httplib` under the hood, so HTTP requests from those packages should be covered as well.

* {% version_added 0.10.0 %} Subprocesses spawned with the `subprocess` module will result in a [breadcrumb]({%- link _documentation/enriching-error-data/breadcrumbs.md -%}) being logged.

## Modules
*Import name: `sentry_sdk.integrations.modules.ModulesIntegration`*

Sends a list of installed Python packages along with each event.

## Argv
*Import name: `sentry_sdk.integrations.argv.ArgvIntegration`*

{% version_added 0.5.0 %}

Adds `sys.argv` as an `extra` attribute to each event.

## Logging
*Import name: `sentry_sdk.integrations.logging.LoggingIntegration`*

See [_Logging_]({% link _documentation/platforms/python/logging.md %})

## Threading
*Import name: `sentry_sdk.integrations.threading.ThreadingIntegration`*

{% version_added 0.7.3 %}

Reports crashing threads.

It also accepts an option `propagate_hub` that changes the way clients are transferred between threads, and transfers scope data (such as tags) from the parent thread to the child thread. This option is currently disabled (`False`) by default, but this will likely change in the future.
