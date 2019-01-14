---
title: Android
sidebar_order: 6
---

## Features

The Sentry Android SDK is built on top of the main Java SDK and supports all of the same features, [configuration options]({%- link _documentation/clients/java/config.md -%}), and more. Adding version `1.7.16` of the Android SDK to a sample application that doesn’t even use Proguard only increased the release `.apk` size by approximately 200KB.

Events will be [buffered to disk]({%- link _documentation/clients/java/config.md -%}#buffering-events-to-disk) (in the application’s cache directory) by default. This allows events to be sent at a later time if the device does not have connectivity when an event is created. This can be disabled by [setting the option]({%- link _documentation/clients/java/config.md -%}#configuration) `buffer.enabled` to `false`.

An `UncaughtExceptionHandler` is configured so that crash events will be stored to disk and sent the next time the application is run.

The `AndroidEventBuilderHelper` is enabled by default, which will automatically enrich events with data about the current state of the device, such as memory usage, storage usage, display resolution, connectivity, battery level, model, Android version, whether the device is rooted or not, etc.

<!-- WIZARD -->
## Installation

Using Gradle (Android Studio) in your `app/build.gradle` add:

```groovy
compile 'io.sentry:sentry-android:1.7.16'

// this dependency is not required if you are already using your own
// slf4j implementation
compile 'org.slf4j:slf4j-nop:1.7.25'
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-android%7C1.7.16%7Cjar).
<!-- ENDWIZARD -->

## Initialization

Your application must have permission to access the internet in order to send events to the Sentry server. In your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Then initialize the Sentry client in your application’s main `onCreate` method:

```java
import io.sentry.Sentry;
import io.sentry.android.AndroidSentryClientFactory;

public class MainActivity extends Activity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Context ctx = this.getApplicationContext();

        // Use the Sentry DSN (client key) from the Project Settings page on Sentry
        String sentryDsn = "https://publicKey:secretKey@host:port/1?options";
        Sentry.init(sentryDsn, new AndroidSentryClientFactory(ctx));

        // Alternatively, if you configured your DSN in a `sentry.properties`
        // file (see the configuration documentation).
        Sentry.init(new AndroidSentryClientFactory(ctx));
    }
}
```

You can optionally configure other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration) for ways you can do this.

<!-- WIZARD -->
## Usage

Now you can use `Sentry` to capture events anywhere in your application:

```java
import io.sentry.context.Context;
import io.sentry.event.BreadcrumbBuilder;
import io.sentry.event.UserBuilder;

public class MyClass {
    /**
      * An example method that throws an exception.
      */
    void unsafeMethod() {
        throw new UnsupportedOperationException("You shouldn't call this!");
    }

    /**
      * Note that the ``Sentry.init`` method must be called before the static API
      * is used, otherwise a ``NullPointerException`` will be thrown.
      */
    void logWithStaticAPI() {
        /*
         Record a breadcrumb in the current context which will be sent
         with the next event(s). By default the last 100 breadcrumbs are kept.
         */
        Sentry.getContext().recordBreadcrumb(
            new BreadcrumbBuilder().setMessage("User made an action").build()
        );

        // Set the user in the current context.
        Sentry.getContext().setUser(
            new UserBuilder().setEmail("hello@sentry.io").build()
        );

        /*
         This sends a simple event to Sentry using the statically stored instance
         that was created in the ``main`` method.
         */
        Sentry.capture("This is a test");

        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry using the statically stored instance
            // that was created in the ``main`` method.
            Sentry.capture(e);
        }
    }
}
```
<!-- ENDWIZARD -->

## ProGuard

In order to use ProGuard with Sentry you will need to upload the proguard mapping files to Sentry by using our Gradle integration (recommended) or manually by using [_sentry-cli_]({%- link _documentation/cli/dif/proguard.md -%})

Note that Sentry currently only supports ProGuard minification, and not the experimental R8 Shrinker. Ensure R8 is disabled by adding the following to your `gradle.properties` file:

```gradle
android.enableR8=false
```

### Gradle Integration

Using Gradle (Android Studio) in your `app/build.gradle` add:

```groovy
apply plugin: 'io.sentry.android.gradle'
```

And declare a dependency in your toplevel `build.gradle`:

```groovy
buildscript {
    dependencies {
        classpath 'io.sentry:sentry-android-gradle-plugin:1.7.16'
    }
}
```

The plugin will then automatically generate appropriate ProGuard mapping files and upload them when you run `gradle assembleRelease`. The credentials for the upload step are loaded via environment variables _or_ from a `sentry.properties` file in your project root. Please note the `sentry.properties` in your project root that configures `sentry-cli` is *different* than the one you include in your application resources to configure the Sentry SDK at runtime (as seen in the [configuration documentation]({%- link _documentation/clients/java/config.md -%})).

For more information [see the sentry-cli documentation]({%- link _documentation/cli/configuration.md -%}#configuration-values). At the very minimum you will need something like this:

```gradle
defaults.project=___PROJECT_NAME___
defaults.org=___ORG_NAME___
auth.token=YOUR_AUTH_TOKEN
```

You can find your authentication token [on the Sentry API page](https://sentry.io/api/). For more information about the available configuration options see _/cli/configuration_.

#### Gradle Configuration

Additionally we expose a few configuration values directly in Gradle:

```groovy
sentry {
    // Disables or enables the automatic configuration of proguard
    // for Sentry.  This injects a default config for proguard so
    // you don't need to do it manually.
    autoProguardConfig true

    // Enables or disables the automatic upload of mapping files
    // during a build.  If you disable this you'll need to manually
    // upload the mapping files with sentry-cli when you do a release.
    autoUpload true
}
```

### Manual Integration

If you choose not to use the Gradle integration, you may handle the processing and upload steps manually. However, it is highly recommended that you use the Gradle integration if at all possible.

First, you need to add the following to your ProGuard rules file:

```gradle
-keepattributes LineNumberTable,SourceFile
-dontwarn org.slf4j.**
-dontwarn javax.**
-keep class io.sentry.event.Event { *; }
```

#### ProGuard UUIDs

After ProGuard files are generated you will need to embed the UUIDs of the ProGuard mapping files in a properties file named `sentry-debug-meta.properties` in the assets folder. The Java SDK will look for the UUIDs there to link events to the correct mapping files on the server side.

{% capture __alert_content -%}
Sentry calculates UUIDs for proguard files. For more information about how this works see [UUID Format]({%- link _documentation/cli/dif/proguard.md -%}#proguard-uuids).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

`sentry-cli` can write the `sentry-debug-meta.properties` file for you:

```bash
sentry-cli upload-proguard \
    --android-manifest app/build/intermediates/manifests/full/release/AndroidManifest.xml \
    --write-properties app/build/intermediates/assets/release/sentry-debug-meta.properties \
    --no-upload \
    app/build/outputs/mapping/release/mapping.txt
```

Note that this file needs to be in your APK, so this needs to be run before the APK is packaged. You can do that by creating a gradle task that runs before the dex packaging.

You can for example add a gradle task after the proguard step and before the dex one which executes `sentry-cli` to validate and process the mapping files and to write the UUIDs into the properties file:

```groovy
gradle.projectsEvaluated {
    android.applicationVariants.each { variant ->
        def variantName = variant.name.capitalize();
        def proguardTask = project.tasks.findByName(
            "transformClassesAndResourcesWithProguardFor${variantName}")
        def dexTask = project.tasks.findByName(
            "transformClassesWithDexFor${variantName}")
        def task = project.tasks.create(
                name: "processSentryProguardFor${variantName}",
                type: Exec) {
            workingDir project.rootDir
            commandLine *[
                "sentry-cli",
                "upload-proguard",
                "--write-properties",
                "${project.rootDir.toPath()}/app/build/intermediates/assets" +
                    "/${variant.dirName}/sentry-debug-meta.properties",
                variant.getMappingFile(),
                "--no-upload"
            ]
        }
        dexTask.dependsOn task
        task.dependsOn proguardTask
    }
}
```

Alternatively you can generate a UUID upfront yourself and then force Sentry to honor that UUID after upload. However this is strongly discouraged!

#### Uploading ProGuard Files

Finally, you need manually upload ProGuard files with `sentry-cli` as follows:

```bash
sentry-cli upload-proguard \
    --android-manifest app/build/intermediates/manifests/full/release/AndroidManifest.xml \
    app/build/outputs/mapping/release/mapping.txt
```
