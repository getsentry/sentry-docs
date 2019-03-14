---
title: Default Integrations
sidebar_order: 10
---

System integrations are integrations enabled by default that integrate into the
standard library or the interpreter itself. They are documented so you can see
what they do and that they can be disabled if they cause issues. To disable
system integrations set `defaultIntegrations: false` when calling `init()`.
To override their settings, provide a new instance with your config
to `integrations` option, for example to turn off browser capturing console calls
`integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })]`.

## Core

### Dedupe

_Import name: `Sentry.Integrations.Dedupe`_

This integration deduplicates certain events. This is enabled by default and should not
be disabled except in rare circumstances. Disabling this integration for instance will
cause duplicate error logging.

### InboundFilters

_Import name: `Sentry.Integrations.InboundFilter`_

This integration allows developers to ignore specific errors based on the type or message,
as well as blacklist/whitelist urls which exception originates from.
It ignores errors, which message starts with `Script error` or `Javascript error: Script error` by default.
More on this in our ["What the heck is "Script error"?"](https://blog.sentry.io/2016/05/17/what-is-script-error) blog post.

To configure it, use `ignoreErrors`, `blacklistUrls` and `whitelistUrls` SDK options directly.

### FunctionToString

_Import name: `Sentry.Integrations.FunctionToString`_

This integration allows SDK to provide original functions and method names,
even when they are wrapped by our error or breadcrumbs handlers.

### ExtraErrorData

_Import name: `Sentry.Integrations.ExtraErrorData`_

This integration extracts all non-native attributes from the Error object and attaches
them to the event as the `extra` data.

## Browser specific

### TryCatch

_Import name: `Sentry.Integrations.TryCatch`_

This integration wraps native time and events APIs (`setTimeout`, `setInterval`, `requestAnimationFrame`,
`addEventListener/removeEventListener`) in `try/catch` blocks to handle async exceptions.

### Breadcrumbs

_Import name: `Sentry.Integrations.Breadcrumbs`_

This integration wrap native APIs to capture breadcrumbs. By default, all APIs are wrapped.

Available options:

```js
{
  beacon: boolean;  // Log HTTP requests done with the Beacon API
  console: boolean; // Log calls to `console.log`, `console.debug`, etc
  dom: boolean;     // Log all click and keypress events
  fetch: boolean;   // Log HTTP requests done with the Fetch API
  history: boolean; // Log calls to `history.pushState` and friends
  sentry: boolean;  // Log whenever we send an event to the server
  xhr: boolean;     // Log HTTP requests done with the XHR API
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

### UserAgent

_Import name: `Sentry.Integrations.UserAgent`_

This integration attaches user-agent information to the event, which allows us to correctly
catalogue and tag them with specific OS, Browser and version informations.
