---
title: Default Integrations
sidebar_order: 10
---

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself. They are documented so you can see
what they do and that they can be disabled if they cause issues. To disable
system integrations set `default_integrations=False` when calling `init()`.
To override their settings, provide a new instance with your config
to `integrations` option, for example to turn off browser capturing console calls
`integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })]`.

## Core

### Dedupe

_Import name: `Sentry.Integrations.Dedupe`_

This integration deduplicates certain events. This is enabled by default and should not
be disabled except in rare circumstances. Disabling this integration for instance will
cause duplicate error logging.

### FunctionToString

_Import name: `Sentry.Integrations.FunctionToString`_

This integration allows SDK to provide original functions and method names,
even when they are wrapped by our error or breadcrumbs handlers.

### InboundFilters

_Import name: `Sentry.Integrations.InboundFilter`_

This integration allows developers to ignore specific errors based on the type or message,
as well as blacklist/whitelist urls which exception originates from.

To configure it, use `ignoreErrors`, `blacklistUrls` and `whitelistUrls` SDK options directly.

## Browser specific

### Breadcrumbs

_Import name: `Sentry.Integrations.Breadcrumbs`_

This integration wrap native APIs to capture breadcrumbs. By default, all APIs are wrapped.

Available options:

```js
{
  beacon: boolean;
  console: boolean;
  dom: boolean;
  fetch: boolean;
  history: boolean;
  sentry: boolean;
  xhr: boolean;
}
```

### GlobalHandlers

_Import name: `Sentry.Integrations.GlobalHandlers`_

This integration attaches global handlers to capture uncaught exceptions and unhandled rejections.

Available options:

```js
{
  onerror: boolean;
  onunhandledrejection: boolean;
}
```

### LinkedErrors

_Import name: `Sentry.Integrations.LinkedErrors`_

This integration allows to configure linked errors. They'll be recursively read up to a specified limit
and lookup will be performed by a specific key. By default, limit is set to 5 and key used is `cause`.

Available options:

```js
{
  key: string;
  limit: number;
}
```

### ReportingObserver

_Import name: `Sentry.Integrations.ReportingObserver`_

This integration hooks into ReportingObserver API and sends captured events through to Sentry.
Can be configured to handle only specific issue types.

Available options:

```js
{
  types: <'crash'|'deprecation'|'intervention'>[];
}
```

### TryCatch

_Import name: `Sentry.Integrations.TryCatch`_

This integration wraps native time and events APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`,
`addEventListener/removeEventListener`) in `try/catch` blocks to handle async exceptions.

### UserAgent

_Import name: `Sentry.Integrations.UserAgent`_

This integration attaches user-agent information to the event, which allows us to correctly
catalogue and tag them with specific OS, Browser and version informations.

## Node.js specific

### Console

_Import name: `Sentry.Integrations.Console`_

This integration wraps `console` module to treat all it's calls as breadcrumbs.

### Http

_Import name: `Sentry.Integrations.Http`_

This integration wraps `http` and `https` modules to capture all network requests as breadcrumbs.

### OnUncaughtException

_Import name: `Sentry.Integrations.OnUncaughtException`_

This integration attaches global uncaught exception handler. Can be modified to provide a custom shutdown function.

Available options:

```js
{
  onFatalError: (firstError: Error, secondError?: Error) => void;
}
```

### OnUnhandledRejection

_Import name: `Sentry.Integrations.OnUnhandledRejection`_

This integration attaches global unhandled rejection handlers.

### LinkedErrors

_Import name: `Sentry.Integrations.LinkedErrors`_

This integration allows to configure linked errors. They'll be recursively read up to a specified limit
and lookup will be performed by a specific key. By default, limit is set to 5 and key used is `cause`.

Available options:

```js
{
  key: string;
  limit: number;
}
```
