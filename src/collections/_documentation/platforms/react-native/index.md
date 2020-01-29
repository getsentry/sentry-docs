---
title: 'React Native'
---

The React-Native SDK uses a native extension for iOS and Android but will fall back to a pure JavaScript version if necessary.

<!-- WIZARD -->
## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your application works.

{% capture __alert_content -%}
If you are using `expo-cli` you need to use another SDK see: [https://docs.expo.io/versions/latest/guides/using-sentry/](https://docs.expo.io/versions/latest/guides/using-sentry/)
This SDK only works for ejected projects or projects that directly use React Native.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}


To install the React Native SDK, add the dependency to your project by either using `npm` or `yarn`.

```bash
npm install @sentry/react-native --save
# or
yarn add @sentry/react-native
```

### Linking

Since our SDK also supports native crashes, we need to link the SDK to your native projects.

Above `react-native >= 0.60` you need to do:

```bash
npx sentry-wizard -i reactNative -p ios android
# or
yarn sentry-wizard -i reactNative -p ios android

cd ios
pod install
```

Since our SDK supports [auto-linking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) and iOS relies on CocoaPods, you need to install the dependencies.

If you are running a project with `react-native < 0.60` you still need to call `react-native link`.

```bash
react-native link @sentry/react-native
```

The *link* step or the `sentry-wizard` call will patch your project accordingly. 

The [Sentry Wizard](https://github.com/getsentry/sentry-wizard) will guide you through the process of setting everything up correctly. This has to be done only once, and the files created can go into your version control system.

The following changes will be performed:

- add the sentry-java package for native crash reporting on Android
- add the sentry-cocoa package for native crash reporting on iOS
- enable the Sentry Gradle build step for Android
- patch *_MainApplication.java_* for Android
- configure Sentry for the supplied DSN in your *_index.js/App.js_* files
- store build credentials in *_ios/sentry.properties_* and *_android/sentry.properties_*.

<!-- ENDWIZARD -->

## Upgrading from react-native-sentry

If you are upgrading from an earlier version of react-native-sentry you should unlink the package to ensure the generated code is updated to the latest version:

```bash
$ react-native unlink react-native-sentry
```

After that remove `react-native-sentry` from your `package.json` and follow the installation instructions.

## iOS Specifics

When you use Xcode, you can hook directly into the build process to upload debug symbols and source maps. However, if you are using bitcode, you will need to disable the “Upload Debug Symbols to Sentry” build phase and then separately upload debug symbols from iTunes Connect to Sentry.

## Android Specifics

For Android, we hook into Gradle for the source map build process. When you run `react-native link`, the Gradle files are automatically updated. When you run `./gradlew assembleRelease` source maps are automatically built and uploaded to Sentry.

<!-- WIZARD -->
## Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

To initialize the SDK, you need to call:

```javascript
import * as Sentry from '@sentry/react-native';
    
Sentry.init({ 
  dsn: '___PUBLIC_DSN___', 
});
```

The `sentry-wizard` will try to add it to your `App.js`

## Verifying Your Setup

Great! Now that you’ve completed setting up the SDK, maybe you want to quickly test out how Sentry works. You can trigger a JS exception by throwing one in your application:

```javascript
throw new Error("My first Sentry error!");
```

You can even try a native crash with:

```javascript
Sentry.nativeCrash();
```
<!-- ENDWIZARD -->

## Capturing Errors

In most situations, you can capture errors automatically with `captureException()`.

```javascript
try { 
  aFunctionThatMightFail();
} catch (err) { 
  Sentry.captureException(err);
}
```

## Setting Release / Dist

```javascript
Sentry.setRelease('release');
Sentry.setDist('dist');
```

Since this SDK is unified, all function that are available for JavaScript are also available in this SDK, for more examples:
- [Adding Context]({%- link _documentation/platforms/javascript/index.md -%}#adding-context)
- [JavaScript Advanced Usage]({%- link _documentation/platforms/javascript/index.md -%}#advanced-usage)

## Deep Dive

-   [Using Sentry with Expo]({%- link _documentation/platforms/react-native/expo.md -%})
-   [Using Sentry with CodePush]({%- link _documentation/platforms/react-native/codepush.md -%})
-   [Source Maps for Other Platforms]({%- link _documentation/platforms/react-native/sourcemaps.md -%})
-   [Setup With CocoaPods]({%- link _documentation/platforms/react-native/cocoapods.md -%})
-   [Using RAM Bundles]({%- link _documentation/platforms/react-native/ram-bundles.md -%})
-   [Manual Setup]({%- link _documentation/platforms/react-native/manual-setup.md -%})
    -   [iOS]({%- link _documentation/platforms/react-native/manual-setup.md -%}#ios)
    -   [Android]({%- link _documentation/platforms/react-native/manual-setup.md -%}#android)
