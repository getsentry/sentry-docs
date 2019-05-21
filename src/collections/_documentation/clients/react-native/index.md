---
title: 'React Native'
sidebar_relocation: platforms
---

This is the documentation for our React-Native SDK. The React-Native SDK uses a native extension for iOS and Android but will fall back to a pure JavaScript version if necessary.

## Getting Started
Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
3.  [Configure it](#configure)

<!-- WIZARD -->
## Installation {#install}

Start by adding Sentry and then linking it:

```bash
$ npm install react-native-sentry --save
# or
# yarn add react-native-sentry
# if you are using yarn
# this is for linking
$ react-native link react-native-sentry
```

The _link_ step will pull in the native dependency and patch your project accordingly. If you are using expo you don’t have to (or can’t) run that link step. For more information about that see [_Using Sentry with Expo_]({%- link _documentation/clients/react-native/expo.md -%}).

On linking the new [Sentry Wizard](https://github.com/getsentry/sentry-wizard) will help you to configure your project and change files accordingly.

Upon linking the following changes will be performed:

-   add the sentry-java package for native crash reporting on Android
-   add the sentry-cocoa package for native crash reporting on iOS
-   enable the sentry gradle build step for android
-   patch _AppDelegate.m_ for iOS
-   patch _MainApplication.java_ for Android
-   configure Sentry for the supplied DSN in your _index.js/App.js_ files
-   store build credentials in _ios/sentry.properties_ and _android/sentry.properties_.

To see what is happening during linking you can refer to [_Manual Setup_]({%- link _documentation/clients/react-native/manual-setup.md -%}) which will give you all the details.

Note that we only support `react-native >= 0.38` at the moment.
<!-- ENDWIZARD -->

## Upgrading

If you are upgrading from an earlier version of sentry-react-native you should re-link the package to ensure the generated code is updated to the latest version:

```bash
$ react-native unlink react-native-sentry
$ react-native link react-native-sentry
```

## iOS Specifics

When you use Xcode you can hook directly into the build process to upload debug symbols and source maps. If you however are using bitcode you will need to disable the “Upload Debug Symbols to Sentry” build phase and then separately upload debug symbols from iTunes Connect to Sentry.

## Android Specifics

For Android we hook into gradle for the source map build process. When you run `react-native link` the gradle files are automatically updated. When you run `./gradlew assembleRelease` source maps are automatically built and uploaded to Sentry.

<!-- WIZARD -->
## Client Configuration {#configure}

Note: When you run `react-native link` we will automatically update your _index.ios.js_ / _index.android.js_ with the following changes:

```javascript
import { Sentry } from 'react-native-sentry';
Sentry.config('___PUBLIC_DSN___').install();
```

You can pass additional configuration options to the `config()` method if you want to do so.
<!-- ENDWIZARD -->

## Mixed Stacktraces

Currently we only support mixed stack traces on iOS. By default this feature is disabled. We recommend testing your app thoroughly when activating this, to turn it on `deactivateStacktraceMerging: false` see: [_Additional Configuration_]({%- link _documentation/clients/react-native/config.md -%}).

## Deep Dive

-   [Additional Configuration]({%- link _documentation/clients/react-native/config.md -%})
-   [Using Sentry with Expo]({%- link _documentation/clients/react-native/expo.md -%})
-   [Using Sentry with CodePush]({%- link _documentation/clients/react-native/codepush.md -%})
-   [Source maps for Other Platforms]({%- link _documentation/clients/react-native/sourcemaps.md -%})
-   [Setup With CocoaPods]({%- link _documentation/clients/react-native/cocoapods.md -%})
-   [Using RAM Bundles]({%- link _documentation/clients/react-native/ram-bundles.md -%})
-   [Manual Setup]({%- link _documentation/clients/react-native/manual-setup.md -%})
    -   [iOS]({%- link _documentation/clients/react-native/manual-setup.md -%}#ios)
    -   [Android]({%- link _documentation/clients/react-native/manual-setup.md -%}#android)
