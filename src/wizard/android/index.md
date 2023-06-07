---
name: Android
doc_link: https://docs.sentry.io/platforms/android/
support_level: production
type: framework
---

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your app works.

### Auto-Installation and Source Context With the Sentry Android Gradle Plugin

The Sentry Android Gradle plugin will install the Android SDK and integrations relevant to your application.
It can also upload your source code to Sentry so it can be shown as part of the stack traces.

To install the plugin, please update your app's `build.gradle` file as follows:

```groovy {filename:app/build.gradle}
buildscript {
  repositories {
    mavenCentral()
  }
}
plugins {
  id "io.sentry.android.gradle" version "{{@inject packages.version('sentry.java.android.gradle-plugin', '3.9.0') }}"
}

sentry {
    // Generates a source bundle and uploads your source code to Sentry.
    // This enables source context, allowing you to see your source
    // code as part of your stack traces in Sentry.
  includeSourceContext = true

  org = "___ORG_SLUG___"
  projectName = "___PROJECT_SLUG___"
  authToken = "your-sentry-auth-token"
}
```

The plugin version `{{@inject packages.version('sentry.java.android.gradle-plugin', '3.9.0') }}` will automatically add the Sentry Android SDK (version `{{@inject packages.version('sentry.java.android', '6.21.0') }}`) to your app.

## Connecting the SDK to Sentry

Configuration is done via the application `AndroidManifest.xml`. The code snippet below includes the DSN, which tells the SDK to send the events to this project.

Here's an example config which should get you started:

```xml {filename:AndroidManifest.xml}
<application>
  <!-- Required: set your sentry.io project identifier (DSN) -->
  <meta-data android:name="io.sentry.dsn" android:value="___PUBLIC_DSN___" />

  <!-- enable automatic breadcrumbs for user interactions (clicks, swipes, scrolls) -->
  <meta-data android:name="io.sentry.traces.user-interaction.enable" android:value="true" />
  <!-- enable screenshot for crashes -->
  <meta-data android:name="io.sentry.attach-screenshot" android:value="true" />
  <!-- enable view hierarchy for crashes -->
  <meta-data android:name="io.sentry.attach-view-hierarchy" android:value="true" />

  <!-- enable the performance API by setting a sample-rate, adjust in production env -->
  <meta-data android:name="io.sentry.traces.sample-rate" android:value="1.0" />
  <!-- enable profiling when starting transactions, adjust in production env -->
  <meta-data android:name="io.sentry.traces.profiling.sample-rate" android:value="1.0" />
</application>
```

Under the hood Sentry uses a `ContentProvider` to initalize the SDK based on the values provided above. This way the SDK can capture important crashes and metrics right from the app start.

Additional options can be found [on our dedicated options page](https://docs.sentry.io/platforms/android/configuration/options/).

If you want to customize the SDK init behaviour, you can still use the [Manual Initialization method](https://docs.sentry.io/platforms/android/configuration/manual-init/).

## Verifying Your Setup

Great! Now that you’ve completed setting up the SDK, maybe you want to quickly test out how Sentry works. Start by capturing an exception:

In **Java**:

```java
import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;

import io.sentry.Sentry;

public class MyActivity extends AppCompatActivity {
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Sentry.captureMessage("testing SDK setup");
  }
}
```

In **Kotlin**:

```kotlin
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle

import io.sentry.Sentry

class MyActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    Sentry.captureMessage("testing SDK setup")
  }
}
```

## Performance Monitoring

Set `io.sentry.traces.sample-rate` to 1.0 to capture 100% of transactions for performance monitoring.

We recommend adjusting this value in production.

```xml {filename:AndroidManifest.xml}
<application>
    <meta-data android:name="io.sentry.traces.sample-rate" android:value="1.0" />
</application>
```

You can measure the performance of your code by capturing transactions and spans.

```kotlin
import io.sentry.Sentry

// Transaction can be started by providing, at minimum, the name and the operation
val transaction = Sentry.startTransaction("test-transaction-name", "test-transaction-operation")

// Transactions can have child spans (and those spans can have child spans as well)
val span = transaction.startChild("test-child-operation")

// ...
// (Perform the operation represented by the span/transaction)
// ...


span.finish() // Mark the span as finished
transaction.finish() // Mark the transaction as finished and send it to Sentry
```

Check out [the documentation](https://docs.sentry.io/platforms/android/performance/instrumentation/) to learn more about the API and automatic instrumentations.

### Next Steps

Using ProGuard/DexGuard or R8 to obfuscate your app? Check out [our docs on how to set it up](https://docs.sentry.io/platforms/android/proguard/).

Using Jetpack Compose? Try out our new [Jetpack Compose](https://docs.sentry.io/platforms/android/configuration/integrations/jetpack-compose/) integration. It automatically adds a breadcrumb and starts a transaction for each navigation or user interaction event.

[The documentation](https://docs.sentry.io/platforms/android/configuration/) has more information about the many configurations and API available in Sentry's SDK.

> Let us know if you have feedback through [GitHub issues](https://github.com/getsentry/sentry-java/issues/new?assignees=&labels=Platform%3A+Android%2CType%3A+Bug&template=bug_report_android.yml).
