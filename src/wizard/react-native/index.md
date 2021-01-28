---
name: React-Native
doc_link: https://docs.sentry.io/platforms/react-native/
support_level: production
type: language
---

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your application works.

> If you are using `expo-cli` you need to use another SDK see: [https://docs.expo.io/versions/latest/guides/using-sentry/](https://docs.expo.io/versions/latest/guides/using-sentry/)
> This SDK only works for ejected projects or projects that directly use React Native.


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

The _link_ step or the `sentry-wizard` call will patch your project accordingly.

The [Sentry Wizard](https://github.com/getsentry/sentry-wizard) will guide you through the process of setting everything up correctly. This has to be done only once, and the files created can go into your version control system.

The following changes will be performed:

- add the sentry-android package for native crash reporting on Android
- add the sentry-cocoa package for native crash reporting on iOS
- enable the Sentry Gradle build step for Android
- patch _*MainApplication.java*_ for Android
- configure Sentry for the supplied DSN in your _*index.js/App.js*_ files
- store build credentials in _*ios/sentry.properties*_ and _*android/sentry.properties*_.

## Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

To initialize the SDK, you need to call:

```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
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
