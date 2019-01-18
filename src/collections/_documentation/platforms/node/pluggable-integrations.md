---
title: Pluggable Integrations
sidebar_order: 11
---

Pluggable integrations are integrations that can be additionally enabled, to provide specific features. They're documented so you can see what they do and that they can be enabled. To enable pluggable integrations, provide a new instance with your config to the `integrations` option. For example: `integrations: [new Sentry.Integrations.Modules()]`.


## Core

### Debug

_Import name: `Sentry.Integrations.Debug`_

This integration allows you to quickly inspect the content of the processed event that will be passed to `beforeSend` and effectively send it to Sentry.

Available options:

```js
{
  debugger: boolean; // trigger DevTools debugger instead of using console.log
  stringify: boolean; // stringify event before passing it to console.log
}
```

### RewriteFrames

_Import name: `Sentry.Integrations.RewriteFrames`_

This integration allows you to apply a transformation to each frame of the stack trace. In the streamlined scenario, it can be used to change the name of the file frame it originates from, or it can be fed with an iterated function to apply any arbitrary transformation.

Available options:

```js
{
  root: string; // root path that will be appended to the basename of the current frame's url
  iteratee: (frame) => frame); // function that takes the frame, applies any transformation on it and returns it back
}
```

## Node specific

### Modules

_Import name: `Sentry.Integrations.Modules`_

This integration fetches names of all currently installed Node modules and attaches the list to the event. Once fetched, Sentry will cache the list for later reuse.

### Transaction

_Import name: `Sentry.Integrations.Transaction`_

This integration tries to extract useful transaction names that will be used to distinguish the event from the rest. It walks through all stack trace frames and reads the first in-app frame's module and function name.