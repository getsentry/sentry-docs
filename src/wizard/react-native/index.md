---
name: React-Native
doc_link: https://docs.sentry.io/platforms/react-native/
support_level: production
type: language
---

Sentry captures data by using an SDK within your application’s runtime.

> If you are using Expo, see [How to Add Sentry to Your Expo Project](https://docs.expo.io/guides/using-sentry/). This SDK works for both managed and bare projects.


Install our React Native SDK using either `yarn` or `npm`:

```bash
npm install --save @sentry/react-native
# or
yarn add @sentry/react-native
```

### Linking

Link the SDK to your native projects to enable native crash reporting. If you are running a project with `react-native < 0.60`, you still need to call `react-native link`, otherwise you can skip this step as `react-native >=0.60` does this automatically.

```bash
npx @sentry/wizard -i reactNative -p ios android
# or
yarn sentry-wizard -i reactNative -p ios android

cd ios
pod install
```

The call to the [Sentry Wizard](https://github.com/getsentry/sentry-wizard) will patch your project accordingly, though you can [link manually](https://docs.sentry.io/platforms/react-native/manual-setup/manual-setup/) if you prefer.

- iOS Specifics: When you use Xcode, you can hook directly into the build process to upload debug symbols and source maps. However, if you are using bitcode, you will need to disable the “Upload Debug Symbols to Sentry” build phase and then separately upload debug symbols from iTunes Connect to Sentry.
- Android Specifics: We hook into Gradle for the source map build process. When you run `react-native link`, the Gradle files are automatically updated. When you run `./gradlew assembleRelease`, source maps are automatically built and uploaded to Sentry. If you have enabled Gradle's `org.gradle.configureondemand` feature, you'll need a clean build, or you'll need to disable this feature to upload the source map on every build by setting `org.gradle.configureondemand=false` or remove it.

Initialize the SDK:

```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
});
```

The `sentry-wizard` will try to add it to your `App.js`

Then create an intentional error, so you can test that everything is working:

```javascript
throw new Error("My first Sentry error!");
```

Or, try a native crash with:

```javascript
Sentry.nativeCrash();
```
If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.
