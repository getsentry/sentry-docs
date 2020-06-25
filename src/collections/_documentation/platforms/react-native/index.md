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

- add the sentry-android package for native crash reporting on Android
- add the sentry-cocoa package for native crash reporting on iOS
- enable the Sentry Gradle build step for Android
- patch *_MainApplication.java_* for Android
- configure Sentry for the supplied DSN in your *_index.js/App.js_* files
- store build credentials in *_ios/sentry.properties_* and *_android/sentry.properties_*.

<!-- ENDWIZARD -->

## Upgrading from react-native-sentry

If you are upgrading from an earlier version of react-native-sentry you should unlink the package to ensure the generated code is updated to the latest version:

```bash
react-native unlink react-native-sentry
```

After that remove `react-native-sentry` from your `package.json`:

```bash
npm uninstall react-native-sentry --save
# or
yarn remove react-native-sentry
```

You can then follow the installation instructions above.

## iOS Specifics

When you use Xcode, you can hook directly into the build process to upload debug symbols and source maps. However, if you are using bitcode, you will need to disable the “Upload Debug Symbols to Sentry” build phase and then separately upload debug symbols from iTunes Connect to Sentry.

## Android Specifics

For Android, we hook into Gradle for the source map build process. When you run `react-native link`, the Gradle files are automatically updated. When you run `./gradlew assembleRelease` source maps are automatically built and uploaded to Sentry.

If you have enabled Gradle's `org.gradle.configureondemand` feature, you'll need a clean build, or you'll need to disable this feature to upload the source map on every build.

To disable this feature, set `org.gradle.configureondemand=false` or remove it as its default value is disabled, do this in the `gradle.properties` file.

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

### Release Health

Monitor the [health of releases](/workflow/releases/health/) by observing user adoption, usage of the application, percentage of [crashes](/workflow/releases/health/#crash), and [session data](/workflow/releases/health/#session). Release health will provide insight into the impact of crashes and bugs as it relates to user experience, and reveal trends with each new issue through the release details, graphs, and filters.

To benefit from the health data you must use at least version 1.4.0 of the React Native SDK, and enable the collection of release health metrics when initializing the SDK:

```javascript
import * as Sentry from '@sentry/react-native';
    
Sentry.init({ 
  dsn: '___PUBLIC_DSN___',
  enableAutoSessionTracking: true,
});
```

The SDK automatically manages the start and end of sessions when the application is started, goes to background, returns to the foreground, etc.
By default, the session terminates once the application is in the background for more than 30 seconds. To change the timeout, use the option `sessionTrackingIntervalMillis`. For example:

```javascript
import * as Sentry from '@sentry/react-native';
    
Sentry.init({ 
  dsn: '___PUBLIC_DSN___',
  enableAutoSessionTracking: true,
  // Sessions close after app is 10 seconds in the background.
  sessionTrackingIntervalMillis: 10000,
});
```

For more details, see the [full documentation on Release Health](/workflow/releases/health/).

### Identification of the User

By default, we don't apply the user identification provided to the SDK via the API. Instead, we use the installation ID generated with the first use of the application. The ID doesn't contain any private or public data of your users or any public or shared data of their device.

### More options

This SDK is based on our browser JavaScript. That means that all functions available for JavaScript are also available in this SDK. For more examples:
- [Adding Context](/platforms/javascript/#adding-context)
- [JavaScript Advanced Usage](/platforms/javascript/#advanced-usage)

## Deep Dive

-   [Using Sentry with Expo](/platforms/react-native/expo/)
-   [Using Sentry with CodePush](/platforms/react-native/codepush/)
-   [Source Maps for Other Platforms](/platforms/react-native/sourcemaps/)
-   [Setup With CocoaPods](/platforms/react-native/cocoapods/)
-   [Using RAM Bundles](/platforms/react-native/ram-bundles/)
-   [Hermes](/platforms/react-native/hermes/)
-   [Manual Setup](/platforms/react-native/manual-setup/)
    -   [iOS](/platforms/react-native/manual-setup/#ios)
    -   [Android](/platforms/react-native/manual-setup/#android)
