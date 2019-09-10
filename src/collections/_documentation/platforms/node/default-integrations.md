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

This integration allows developers to ignore specific errors based on the type of message, as well as blacklist/whitelist URLs from which the exception originated.

To configure it, use `ignoreErrors`, `blacklistUrls` and `whitelistUrls` SDK options directly.

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

This integration attaches global unhandled rejection handlers.

{% capture __alert_content -%}
This integration suppresses the default Node warning about unhandled promise rejection. If you want to restore this behavior, use the `--unhandled-rejections=warn` flag to run your code.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

```bash
$ node --unhandled-rejections=warn app.js
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
