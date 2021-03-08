---
name: Android
doc_link: https://docs.sentry.io/platforms/android/
support_level: production
type: framework
---

## Integrating the SDK

Sentry captures data by using an SDK within your application’s runtime. These are platform-specific and allow Sentry to have a deep understanding of how your app works.

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

### Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

Add your DSN to the manifest file.

```xml
<application>
    <meta-data android:name="io.sentry.dsn" android:value="___PUBLIC_DSN___" />
</application>
```

### Verifying Your Setup

Great! Now that you’ve completed setting up the SDK, maybe you want to quickly test out how Sentry works. Start by capturing an exception:

```java
public class MyActivity extends AppCompatActivity {
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Sentry.captureMessage("testing SDK setup");
  }
}
```

```kotlin
class MyActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    Sentry.captureMessage("testing SDK setup")
  }
}
```

### Next steps

Using ProGuard or R8 to obfuscate your app? Check out [our docs on how to set it up](https://docs.sentry.io/platforms/android/proguard/).

[The documentation](https://docs.sentry.io/platforms/android/configuration/) has more information about the many configurations and API available in Sentry's SDK.
