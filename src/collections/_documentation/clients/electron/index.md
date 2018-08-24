---
title: Electron
sidebar_order: 3
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

To use the Electron SDK for reporting JavaScript errors at your own discretion, disable native crash handling and use the private DSN:

```javascript
const { init } = require('@sentry/electron');
init({
    dsn: '___DSN___',
    enableNative: false,
});
```
{%- endcapture -%}
{%- include components/alert.html
  title="Sentry On-Premise"
  content=__alert_content
%}

## Installation

The Electron SDK is distributed via _npm_:

```sh
$ npm install --save @sentry/electron
$ yarn add @sentry/electron
```

Our Sentry Wizard can help with the setup process. Make sure you have installed the `@sentry/wizard` npm package globally, then run:

```sh
$ npm install -g @sentry/wizard
$ sentry-wizard --integration electron
```

This will guide you through the installation and configuration process and suggest useful tools for development. If you instead prefer to setup manually, keep reading.

## Configuring the Client

Initialize the client and configure it to use your [Sentry DSN]({%- link _documentation/learn/quickstart.md -%}#configure-the-dsn):

```javascript
const { init } = require('@sentry/electron');
init({
  dsn: '___PUBLIC_DSN___',
  // more options...
});
```

This configures the [Electron CrashReporter](https://electronjs.org/docs/api/crash-reporter) for native app crashes and captures any uncaught JavaScript exceptions using the JavaScript SDKs under the hood. Be sure to call this function as early as possible in the main process and all renderer processes to also catch errors during startup.

For more information on all configuration options, as well as the correct setup in [Sandbox mode](https://electronjs.org/docs/api/sandbox-option) or with disabled Node integration, see [_Configuration_]({%- link _documentation/clients/electron/config.md -%}).

## Manually Reporting Errors

By default, the Electron SDK makes a best effort to capture any uncaught exception and send crash reports from the Electron processes to Sentry.

To report errors manually, wrap potentially problematic code with a `try...catch` block and call _captureException_:

```javascript
const { captureException } = require('@sentry/electron');
try {
  myEvilOperation();
} catch (e) {
  captureException(e);
}
```

The SDK will automatically add useful information, such as the app name and version or collect breadcrumbs for certain events. But there are more ways to report errors and add custom metadata. For a complete guide on this see [_JavaScript Usage_]({%- link _documentation/clients/electron/javascript.md -%}).

## Uploading Debug Information

To get symbolicated stack traces for native crashes, you have to upload debug symbols to Sentry. Sentry Wizard creates a convenient `sentry-symbols.js` script that will upload the Electron symbols for you. After installing the SDK and every time you upgrade the Electron version, run this script:

```sh
$ node sentry-symbols.js
```

If your app uses a custom Electron fork, contains modules with native extensions or spawns subprocesses, you have to upload those symbols manually using Sentry CLI. For more information, see [_Native Usage_]({%- link _documentation/clients/electron/native.md -%}).

{% capture __alert_content -%}
It is currently not possible to send events from native code (such as a C++ extension). However, crashes will still be reported to Sentry if they happen in a process where the SDK has been configured. Also, crash reports from sub processes will not be reported automatically on all platforms. This feature will be added in a future SDK update.
{%- endcapture -%}
{%- include components/alert.html
  title="Known Issue"
  content=__alert_content
%}

## Dealing with Minified Source Code

The Electron SDK supports [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). If you upload source maps in addition to your minified files that data becomes available in Sentry. For more information see [_Source Maps_]({%- link _documentation/clients/electron/sourcemaps.md -%}).

## Deep Dive

For more detailed information about how to get most out of the Electron SDK, there is additional documentation available that covers all the rest:

-   [Configuration]({%- link _documentation/clients/electron/config.md -%})
-   [JavaScript Usage]({%- link _documentation/clients/electron/javascript.md -%})
-   [Native Usage]({%- link _documentation/clients/electron/native.md -%})
-   [Source Maps]({%- link _documentation/clients/electron/sourcemaps.md -%})
