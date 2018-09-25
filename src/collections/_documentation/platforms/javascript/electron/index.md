---
title: Electron
sidebar_order: 2000
---

`@sentry/electron` is the official Sentry SDK for Electron applications. It can capture JavaScript exceptions in the main process and renderers, as well as collect native crash reports (Minidumps).

{% capture __alert_content -%}
This SDK is still in beta and undergoing active development. It is part of an early access preview for the [next generation JavaScript SDKs](https://github.com/getsentry/sentry-javascript/blob/master/README.md). Until the _1.x_ stable release, APIs are still subject to change.
{%- endcapture -%}
{%- include components/alert.html
  level="warning"
  title="Warning"
  content=__alert_content
%}{% capture __alert_content -%}
Support for Electron is currently limited to [sentry.io](https://sentry.io). The latest on-premise version of Sentry (_8.22.0_) does not provide server-side support for native crashes and their debug information files. Full support for Electron will made available to all on-premise customers with the next release.

To use the Electron SDK for reporting JavaScript errors at your own discretion, disable native crash handling and use the DSN:

{%- endcapture -%}
{%- include components/alert.html
  title="Sentry On-Premise"
  content=__alert_content
%}

```javascript
const { init } = require('@sentry/electron');
init({
    dsn: '___PUBLIC_DSN___',
    enableNative: false,
});
```

## Wizard

Our Sentry Wizard can help with the setup process. Make sure you have installed the `@sentry/wizard` npm package globally, then run:

```sh
$ npm install -g @sentry/wizard
$ sentry-wizard --integration electron
```

This will guide you through the installation and configuration process and suggest useful tools for development. If you instead prefer to setup manually, keep reading.

## Configuring the Client

After [configuring the SDK]({%- link _documentation/learn/quickstart.md -%}?platform=electron#configure-the-sdk) the [Electron CrashReporter](https://electronjs.org/docs/api/crash-reporter) for native app crashes and captures any uncaught JavaScript exceptions using the JavaScript SDKs under the hood. Be sure to call this function as early as possible in the main process and all renderer processes to also catch errors during startup.

## Browser integration

We recommend to put the initialization in a separate JavaScript module, to keep configuration options consistent. This also allows to use it as preload script when creating new `BrowserWindow` instances:

```javascript
mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    preload: path.join(__dirname, 'sentry.js')
  }
});
```

After this, the SDK is ready to capture any uncaught exception and native crashes that occur in those processes.

## Node Integration

The SDK requires some NodeJS APIs to operate properly. When creating windows without Node integration, the SDK must be loaded in a preload script, as described above. Doing so also ensures that the SDK is loaded as early as possible.

```javascript
mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: false,
    preload: path.join(__dirname, 'sentry.js')
  }
});
```

## Sandbox Mode

[Sandbox mode](https://electronjs.org/docs/api/sandbox-option) fully isolates the renderer processes from the operating system using OS-specific methods. Since most node APIs require system access, they are not available in sandbox mode, most notably `require()`. See the linked documentation for a detailed description of sandbox restrictions.

The Electron SDK can still be used from within a preload script. However, it needs to be bundled into a single file using bundlers like Webpack or Rollup due to the missing `require()` function. Please refer to the respective documentation your chosen tool for all possible configuration options.

The SDK is written in a way that prevents bundlers from processing any code that is only meant to be executed in the main process. The only remaining external dependency is `electron`, which must be explicitly excluded from inlining. For Webpack, this would be:

```javascript
module.exports = {
  externals: {
    electron: 'commonjs electron',
  },
  // ...
};
```

Or for Rollup:

```javascript
export default {
  external: ['electron'],
  plugins: [commonjs()],
  // ...
};
```

## Uploading Debug Information

To get symbolicated stack traces for native crashes, you have to upload debug symbols to Sentry. Sentry Wizard creates a convenient `sentry-symbols.js` script that will upload the Electron symbols for you. After installing the SDK and every time you upgrade the Electron version, run this script:

```sh
$ node sentry-symbols.js
```

If your app uses a custom Electron fork, contains modules with native extensions or spawns subprocesses, you have to upload those symbols manually using Sentry CLI. For more information, see [_Native Usage_]({%- link _documentation/platforms/javascript/electron/native.md -%}).

{% capture __alert_content -%}
It is currently not possible to send events from native code (such as a C++ extension). However, crashes will still be reported to Sentry if they happen in a process where the SDK has been configured. Also, crash reports from sub processes will not be reported automatically on all platforms. This feature will be added in a future SDK update.
{%- endcapture -%}
{%- include components/alert.html
  title="Known Issue"
  content=__alert_content
%}

## Dealing with Minified Source Code

The Electron SDK supports [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). If you upload source maps in addition to your minified files that data becomes available in Sentry. For more information see [_Source Maps_]({%- link _documentation/platforms/javascript/electron/sourcemaps.md  -%}).

## Deep Dive

For more detailed information about how to get most out of the Electron SDK, there is additional documentation available that covers all the rest:

-   [Native Usage]({%- link _documentation/platforms/javascript/electron/native.md -%})
