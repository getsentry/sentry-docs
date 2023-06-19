---
name: React-Native
doc_link: https://docs.sentry.io/platforms/react-native/
support_level: production
type: language
---

Sentry captures data by using an SDK within your application’s runtime.

> If you are using Expo, see [How to Add Sentry to Your Expo Project](https://docs.expo.io/guides/using-sentry/). This SDK works for both managed and bare projects.

Run `@sentry/wizard`:

```bash
npx @sentry/wizard -s -i reactNative
```

[Sentry Wizard](https://github.com/getsentry/sentry-wizard) will patch your project accordingly, though you can [setup manually](/platforms/react-native/manual-setup/manual-setup/) if you prefer.

- iOS Specifics: When you use Xcode, you can hook directly into the build process to upload debug symbols and source maps. ```
- Android Specifics: We hook into Gradle for the source map build process. When you run `./gradlew assembleRelease`, source maps are automatically built and uploaded to Sentry. If you have enabled Gradle's `org.gradle.configureondemand` feature, you'll need a clean build, or you'll need to disable this feature to upload the source map on every build by setting `org.gradle.configureondemand=false` or remove it.

### Initialize the SDK

```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "___PUBLIC_DSN___",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});
```

The `sentry-wizard` will try to add it to your `App.tsx`

### Wrap your app

Wrap your app with Sentry to automatically instrument it with [touch event tracking](/platforms/react-native/touchevents/) and [automatic performance monitoring](/platforms/react-native/performance/instrumentation/automatic-instrumentation/):

```javascript
export default Sentry.wrap(App);
```

You do not need to do this for Sentry to work or if your app does not have a single parent "App" component.

### Verify

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

## Performance

Sentry can measure the performance of your app automatically when instrumented with the following routers:

- [React Navigation](https://docs.sentry.io/platforms/react-native/performance/instrumentation/automatic-instrumentation/#react-navigation)
- [React Navigation V4 and prior](https://docs.sentry.io/platforms/react-native/performance/instrumentation/automatic-instrumentation/#react-navigation-v4)
- [React Native Navigation](https://docs.sentry.io/platforms/react-native/performance/instrumentation/automatic-instrumentation/#react-native-navigation)

Additionally, you can create transactions and spans programatically:

For example:

```javascript
// Let's say this function is invoked when a user clicks on the checkout button of your shop
shopCheckout() {
  // This will create a new Transaction for you
  const transaction = Sentry.startTransaction({ name: "shopCheckout" });
  // Set transaction on scope to associate with errors and get included span instrumentation
  // If there's currently an unfinished transaction, it may be dropped
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction));

  // Assume this function makes an xhr/fetch call
  const result = validateShoppingCartOnServer();

  const span = transaction.startChild({
    data: {
      result
    },
    op: 'task',
    description: `processing shopping cart result`,
  });
  try {
    processAndValidateShoppingCart(result);
    span.setStatus(SpanStatus.Ok);
  } catch (err) {
    span.setStatus(SpanStatus.UnknownError);
    throw err;
  } finally {
    span.finish();
    transaction.finish();
  }
}
```

For more information, please refer to the [Sentry React Native documentation.](https://docs.sentry.io/platforms/react-native/performance/instrumentation/)
