---
name: Android
doc_link: https://docs.sentry.io/platforms/android/
support_level: production
type: framework
---

> Want to play with some new features? Try out our beta Auto-Installation feature documented below.
>  
> This feature is available in the Beta release of the [Sentry Android Gradle plugin](https://docs.sentry.io/platforms/android/gradle/); you must use version `3.1.0-beta.1`. Features in Beta are still a work-in-progress and may have bugs. We recognize the irony.
>
> If you don't want to use our Gradle plugin, please proceed with the manual installation steps below.
>
> Let us know if you have feedback through [GitHub issues](https://github.com/getsentry/sentry-android-gradle-plugin/issues/).

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your app works.

### Auto-Installation With the Sentry Android Gradle Plugin (Beta)

To install the plugin, please update your app's `build.gradle` file as follows:

```groovy
buildscript {
  repositories {
    mavenCentral()
  }
}
plugins {
  id "io.sentry.android.gradle" version "3.1.0-beta.1"
}
```

The plugin will automatically add the latest version of the Android SDK as a dependency.

### Manual Installation

To install the Android SDK, please update your build.gradle file as follows:

```groovy
// Make sure mavenCentral is there.
repositories {
    mavenCentral()
}

// Enable Java 1.8 source compatibility if you haven't yet.
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

// Add Sentry's SDK as a dependency.
dependencies {
    implementation 'io.sentry:sentry-android:{{ packages.version('sentry.java.android', '4.0.0') }}'
}
```

## Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

Add your DSN to the manifest file.

```xml {filename:AndroidManifest.xml}
<application>
    <meta-data android:name="io.sentry.dsn" android:value="___PUBLIC_DSN___" />
    <!-- Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
       We recommend adjusting this value in production. -->
    <meta-data android:name="io.sentry.traces.sample-rate" android:value="1.0" />
</application>
```

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

Using ProGuard or R8 to obfuscate your app? Check out [our docs on how to set it up](https://docs.sentry.io/platforms/android/proguard/).

[The documentation](https://docs.sentry.io/platforms/android/configuration/) has more information about the many configurations and API available in Sentry's SDK.
