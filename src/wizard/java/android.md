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
// ADD JCENTER REPOSITORY
repositories {
    jcenter()
}

// ADD COMPATIBILITY OPTIONS TO BE COMPATIBLE WITH JAVA 1.8
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
}

// ADD SENTRY ANDROID AS A DEPENDENCY
dependencies {
    // https://github.com/getsentry/sentry-android/releases
    implementation 'io.sentry:sentry-android:{{% packages.version('sentry.android', '{version}') }}'
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
        try {
            throw new Exception("This is a test.");
        } catch (Exception e) {
            Sentry.captureException(e);
        }
    }
}
```
