---
title: Electron
sidebar_order: 2000
---

`@sentry/electron` is the official Sentry SDK for Electron applications. It can capture JavaScript exceptions in the main process and renderers, as well as collect native crash reports (Minidumps).

{% capture __alert_content -%}
This SDK is still in beta and undergoing active development. It is part of an early access preview for the [next generation JavaScript SDKs](https://github.com/getsentry/sentry-javascript/blob/master/README.md). Until the _1.x_ stable release, APIs are still subject to change.
{%- endcapture -%}
{%- include components/alert.html
  title="Support"
  content=__alert_content
%}

## Wizard

Our Sentry Wizard can help with the setup process. Make sure you have installed the `@sentry/wizard` npm package globally, then run:

```sh
$ npm install -g @sentry/wizard
$ sentry-wizard --integration electron
```

This will guide you through the installation and configuration process and suggest useful tools for development. If you instead prefer to setup manually, keep reading.

## Configuring the Client

Start by configuring the SDK as described in the [quickstart guide]({%- link _documentation/error-reporting/quickstart.md -%}?platform=electron#configure-the-sdk). This will enable the [Electron CrashReporter](https://electronjs.org/docs/api/crash-reporter) for native app crashes and capture any uncaught JavaScript exceptions using the JavaScript SDKs under the hood. Be sure to call this function as early as possible in the main process and all renderer processes to also catch errors during startup.

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

If your app uses a custom Electron fork, contains modules with native extensions or spawns subprocesses, you have to upload those symbols manually using Sentry CLI. For more information, see [_Native Usage_]({%- link _documentation/platforms/javascript/electron.md -%}).

{% capture __alert_content -%}
It is currently not possible to send events from native code (such as a C++ extension). However, crashes will still be reported to Sentry if they happen in a process where the SDK has been configured. Also, crash reports from sub processes will not be reported automatically on all platforms. This feature will be added in a future SDK update.
{%- endcapture -%}
{%- include components/alert.html
  title="Known Issue"
  content=__alert_content
%}

## Dealing with Minified Source Code

The Electron SDK supports [Source Maps](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). If you upload source maps in addition to your minified files that data becomes available in Sentry. For more information see [_Source Maps_]({%- link _documentation/platforms/javascript/electron.md  -%}).

## Native


Sentry can process Minidumps created when the Electron process or one of its renderers crashes. To do so, the SDK needs to upload those files once the application restarts (or immediately for renderer crashes). All event meta data including user information and breadcrumbs are included in these uploads.

Due to restrictions of macOS app sandboxing, native crashes cannot be collected in Mac App Store builds. In this case, native crash handling will be disabled, regardless of the `enableNative` setting.

{% capture __alert_content -%}
Minidumps are memory dumps of the process at the moment it crashes. As such, they might contain sensitive information on the target system, such as environment variables, local path names or maybe even in-memory representations of input fields including passwords. **Sentry does not store these memory dumps**. Once processed, they are removed immediately and all sensitive information is stripped from the resulting issues.
{%- endcapture -%}
{%- include components/alert.html
  title="A Word on Data Privacy"
  content=__alert_content
%}

### Uploading Debug Information

To allow Sentry to fully process native crashes and provide you with symbolicated stack traces, you need to upload _Debug Information Files_ (sometimes also referred to as _Debug Symbols_ or just _Symbols_).

Sentry Wizard creates a convenient `sentry-symbols.js` script that will upload the Electron symbols for you. After installing the SDK and every time you upgrade the Electron version, run this script:

```sh
$ node sentry-symbols.js
```

This script will download symbol archives for all platforms from the Electron [releases page](https://github.com/electron/electron/releases/latest) and upload them to Sentry. If your app uses a custom Electron fork or you simply prefer to upload them manually, you can do so with our CLI:

```sh
$ export VERSION=v1.8.4
$ sentry-cli upload-dif -t dsym electron-$VERSION-darwin-x64-dsym.zip
$ sentry-cli upload-dif -t breakpad electron-$VERSION-linux-x64-symbols.zip
$ sentry-cli upload-dif -t breakpad electron-$VERSION-win32-x64-symbols.zip
$ sentry-cli upload-dif -t breakpad electron-$VERSION-win32-ia32-symbols.zip
```

Likewise, if your app uses custom native extensions or you wish to symbolicate crashes from a spawned child process, upload its debug information manually during your build or release process. For more information on uploading debug information and their supported formats, see [Debug Information Files]({%- link _documentation/cli/dif/index.md -%}#sentry-cli-dif).

### Child Processes

The SDK relies on the [Electron CrashReporter](https://electronjs.org/docs/api/crash-reporter) to generate the crash dumps. To receive crash reports for child processes, you need to make sure the crash reporter is activated by either the SDK or manually (see [below](#electron-native-manual)).

An exception to this is _macOS_, where the crash reporter only needs to be started in the main process and watches all its child processes. The SDK already takes care of this difference, so there is no need to manually disable `enableNative`.

For custom child processes, especially ones not written in JavaScript, you need to integrate a library that can generate Minidumps. These are most notably [Crashpad](https://chromium.googlesource.com/crashpad/crashpad/) and [Breakpad](https://chromium.googlesource.com/breakpad/breakpad). Please refer to their respective documentation on how to build and integrate them. Configure them with the following upload URL:

```text
___MINIDUMP_URL___
```

It currently not possible create breadcrumbs or other event meta data from native code. This has to happen in JavaScript. Support for this is planned in future releases.

### Manual Crash Reporting {#electron-native-manual}

You can also capture native crashes by starting the [Electron CrashReporter](https://electronjs.org/docs/api/crash-reporter) manually. Sentry is able to provide symbolicated stack traces and show system information, but no Electron-specific metadata, breadcrumbs or context information will be present. This is useful in cases where you cannot use the full Electron SDK:

```javascript
const { crashReporter } = require('electron');
crashReporter.start({
  companyName: 'YourCompany',
  productName: 'YourApp',
  ignoreSystemCrashHandler: true,
  submitURL: '___MINIDUMP_URL___'
});
```

## Source Maps

To find out why Sentry needs your source maps and how to provide them visit: [Source Maps]({%- link _documentation/platforms/javascript/sourcemaps.md -%}) 

### Native Application

To allow Sentry to match source code references to uploaded source maps or source files, make sure your tool outputs files relative to your project root folder and prefixes them either with `/` or with `~/`. Some tools do this automatically (e.g. Webpack), or have a configuration option (e.g. TypeScript). For others, please see the section on rewriting source maps before uploading.

The SDK will rewrite stack traces before sending them to Sentry. If your application generates manual stack traces for some reason, make sure stack frames always contain relative paths from the project root starting with `~/` or `app:///`.

