---
name: Android
doc_link: https://docs.sentry.io/platforms/android/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

## Install

Add the [Sentry Android Gradle plugin](/platforms/android/configuration/gradle/) to your `app` module:

```groovy {filename:app/build.gradle}
plugins {
  id "com.android.application" // should be in the same module
  id "io.sentry.android.gradle" version "{{@inject packages.version('sentry.java.android.gradle-plugin', '3.9.0') }}"
}
```

The plugin will automatically add the Sentry Android SDK to your app.

## Configure

Configuration is done via the application `AndroidManifest.xml`. Under the hood Sentry uses a `ContentProvider` to initialize the SDK based on the values provided below. This way the SDK can capture important crashes and metrics right from the app start.

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

## Verify

This snippet contains an intentional error and can be used as a test to make sure that everything's working as expected. You can add it to your app's `MainActivity`.

```kotlin
val breakWorld = Button(this).apply {
  text = "Break the world"
  setOnClickListener {
    throw RuntimeException("Break the world")
  }
}

addContentView(breakWorld, ViewGroup.LayoutParams(
  ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
```

---

## Next Steps

- [Manual Configuration](/platforms/android/configuration/manual-init/#manual-initialization): Customize the SDK initialization behavior.
- [ProGuard/R8](/platforms/android/configuration/gradle/#proguardr8--dexguard): Deobfuscate and get readable stacktraces in your Sentry errors.
- [Jetpack Compose](/platforms/android/configuration/integrations/jetpack-compose/): Learn about our first class integration with Jetpack Compose.
- [Source Context](/platforms/android/enhance-errors/source-context/): See your source code as part of your stacktraces in Sentry.
