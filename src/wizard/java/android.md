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
    implementation 'io.sentry:sentry-android:{version}'
}
```
