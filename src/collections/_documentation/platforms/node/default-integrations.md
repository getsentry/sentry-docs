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

### InboundFilters

_Import name: `Sentry.Integrations.InboundFilters`_

This integration allows developers to ignore specific errors based on the type of message, as well as deny/allow URLs from which the exception originated.
Keep in mind that denyUrl and allowUrl work only for captured exceptions, not raw message events.

To configure it, use `ignoreErrors`, `denyUrls` and `allowUrls` SDK options directly.

### FunctionToString

_Import name: `Sentry.Integrations.FunctionToString`_

This integration allows the SDK to provide original functions and method names, even when they are wrapped by our error or breadcrumbs handlers.

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

This integration attaches global unhandled rejection handlers. By default, all unhandled rejections trigger a warning and log the error. You can change this behavior using the `mode` option, which is in line with Node's CLI options: https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode

Available options:

```js
{
  mode: 'none' | 'warn' | 'strict';
}
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
