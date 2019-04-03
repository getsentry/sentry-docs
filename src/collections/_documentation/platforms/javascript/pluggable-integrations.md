---
title: Pluggable Integrations
sidebar_order: 11
---

Pluggable integrations are integrations that can be additionally enabled,
to provide some very specific features. They are documented so you can see
what they do and that they can be enabled.
To enable pluggable integrations, provide a new instance with your config
to `integrations` option, for example `integrations: [new Sentry.Integrations.ReportingObserver()]`.


## Core

### Dedupe

_Import name: `Sentry.Integrations.Dedupe`_

This integration deduplicates certain events. This is enabled by default and should not
be disabled except in rare circumstances. Disabling this integration for instance will
cause duplicate error logging.

### Debug

_Import name: `Sentry.Integrations.Debug`_

This integration allows you to easily inspect the content of the processed event,
that will be passed to `beforeSend` and effectively send to the Sentry.

Available options:

```js
{
  debugger: boolean; // trigger DevTools debugger instead of using console.log
  stringify: boolean; // stringify event before passing it to console.log
}
```

### ExtraErrorData

_Import name: `Sentry.Integrations.ExtraErrorData`_

This integration extracts all non-native attributes from the Error object and attaches
them to the event as the `extra` data.

Available options:

```js
{
  depth: number; // limit of how deep the object serializer should go. Anything deeper then limit will be replaced with standard Node.js REPL notation of [Object], [Array], [Function] or primitive value. Defaults to 3.
}
```

### RewriteFrames

_Import name: `Sentry.Integrations.RewriteFrames`_

This integration allows you to apply transformation to each frame of the stack trace.
In the simple scenario, it can be used to change name of the file frame originates from,
or can be fed with iteratee function, to apply any arbitrary transformation.

Available options:

```js
{
  root: string; // root path that will be appended to the basename of the current frame's url
  iteratee: (frame) => frame); // function that take the frame, apply any transformation on it and returns it back
}
```

## Browser specific

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