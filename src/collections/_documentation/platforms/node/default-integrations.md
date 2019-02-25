---
title: Default Integrations
sidebar_order: 10
---

System integrations are integrations enabled by default that combine into the
standard library or the interpreter itself. They're documented so you can see
what they do and that they can be disabled if they cause issues. To disable
system integrations set `defaultIntegrations: false` when calling `init()`.
To override their settings, provide a new instance with your config
to `integrations` option. For example: to change fatal error handler
`integrations: [new Sentry.Integrations.OnUncaughtException({ onFatalError: () => { /** your implementation */ } })]`.

## Core

### Dedupe

_Import name: `Sentry.Integrations.Dedupe`_

This integration deduplicates certain events. It's enabled by default and should not be disabled, except in rare circumstances. Disabling this integration, for instance, will cause duplicate error logging.

### InboundFilters

_Import name: `Sentry.Integrations.InboundFilter`_

This integration allows developers to ignore specific errors based on the type of message, as well as blacklist/whitelist URLs from which the exception originated.

To configure it, use `ignoreErrors`, `blacklistUrls` and `whitelistUrls` SDK options directly.

### FunctionToString

_Import name: `Sentry.Integrations.FunctionToString`_

This integration allows the SDK to provide original functions and method names, even when they are wrapped by our error or breadcrumbs handlers.

### ExtraErrorData

_Import name: `Sentry.Integrations.ExtraErrorData`_

This integration extracts all non-native attributes from the Error object and attaches them to the event as the `extra` data.

## Node specific

### Console

_Import name: `Sentry.Integrations.Console`_

This integration wraps the `console` module to treat all its calls as breadcrumbs.

### Http

_Import name: `Sentry.Integrations.Http`_

This integration wraps `http` and `https` modules to capture all network requests as breadcrumbs.

### OnUncaughtException

_Import name: `Sentry.Integrations.OnUncaughtException`_

This integration attaches a global uncaught exception handler. It can be modified to provide a custom shutdown function.

Available options:

```js
{
  onFatalError: (firstError: Error, secondError?: Error) => void;
}
```

### OnUnhandledRejection

_Import name: `Sentry.Integrations.OnUnhandledRejection`_

This integration attaches global unhandled rejection handlers.

{% capture __alert_content -%}
This integration supresses default Node's warning about unhandled promise rejection. If you want to restore this behaviour, attach another handler using the snippet below.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

```js
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
```

### LinkedErrors

_Import name: `Sentry.Integrations.LinkedErrors`_

This integration allows you to configure linked errors. They'll be recursively read up to a specified limit and lookup will be performed by a specific key. By default, the limit sets to 5 and the key used is `cause`.

Available options:

```js
{
  key: string;
  limit: number;
}
```
