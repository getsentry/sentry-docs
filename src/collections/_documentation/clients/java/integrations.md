---
title: Integrations
sidebar_order: 2
---

The Sentry Java SDK comes with support for some frameworks and libraries so that you don’t have to capture and send errors manually.

## Android

### Features

The Sentry Android SDK is built on top of the main Java SDK and supports all of the same features, [configuration options]({%- link _documentation/clients/java/config.md -%}), and more. Adding version `1.7.30` of the Android SDK to a sample application that doesn’t even use Proguard only increased the release `.apk` size by approximately 200KB.

Events will be [buffered to disk]({%- link _documentation/clients/java/config.md -%}#buffering-events-to-disk) (in the application’s cache directory) by default. This allows events to be sent at a later time if the device does not have connectivity when an event is created. This can be disabled by [setting the option]({%- link _documentation/clients/java/config.md -%}#configuration) `buffer.enabled` to `false`.

An `UncaughtExceptionHandler` is configured so that crash events will be stored to disk and sent the next time the application is run.

The `AndroidEventBuilderHelper` is enabled by default, which will automatically enrich events with data about the current state of the device, such as memory usage, storage usage, display resolution, connectivity, battery level, model, Android version, whether the device is rooted or not, etc.

`Application Not Responding` (or ANR) can also be automatically detected and reported to Sentry.
For that, you must configure the SDK with the option `anr.enable=true`
By default the UI thread needs to be blocked for at least 5 seconds for an event to be raised. If you wish to change this value, you can do that via the option `anr.timeoutIntervalMs`. For example, to detect if the UI thread is blocked for longer than 3 seconds, set it to: `anr.timeoutIntervalMs=3000`.

<!-- WIZARD android -->
### Installation

Using Gradle (Android Studio) in your `app/build.gradle` add:

```groovy
implementation 'io.sentry:sentry-android:1.7.30'

// this dependency is not required if you are already using your own
// slf4j implementation
implementation 'org.slf4j:slf4j-nop:1.7.25'
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-android%7C1.7.30%7Cjar).
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### Initialization

Your application must have permission to access the internet in order to send events to the Sentry server. In your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

Then initialize the Sentry client in your application’s main `onCreate` method:

```java
import io.sentry.Sentry;
import io.sentry.android.AndroidSentryClientFactory;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Sentry.init("___PUBLIC_DSN___", new AndroidSentryClientFactory(this));
    }
}
```

Alternatively, if you configured your DSN in a `sentry.properties` file (see the configuration documentation):

```java
import io.sentry.Sentry;
import io.sentry.android.AndroidSentryClientFactory;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Sentry.init(new AndroidSentryClientFactory(this));
    }
}
```

You can optionally configure other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration) for ways you can do this.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- WIZARD android -->
### Usage

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
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### ProGuard

To use ProGuard with Sentry, you will need to upload the ProGuard mapping files to Sentry by using our Gradle integration (recommended) or manually by using [_sentry-cli_]({%- link _documentation/cli/dif.md -%}#proguard-mapping-upload)

#### Gradle Integration

Using Gradle (Android Studio) in your `app/build.gradle` add:

```groovy
apply plugin: 'io.sentry.android.gradle'
```

And declare a dependency in your toplevel `build.gradle`:

```groovy
buildscript {
    dependencies {
        classpath 'io.sentry:sentry-android-gradle-plugin:1.7.30'
    }
}
```

The plugin will then automatically generate appropriate ProGuard mapping files and upload them when you run `gradle assembleRelease`. The credentials for the upload step are loaded via environment variables _or_ from a `sentry.properties` file in your project root. The `sentry.properties` in your project root that configures `sentry-cli` is **different** than the one you include in your application resources to configure the Sentry SDK at runtime (as seen in the [configuration documentation]({%- link _documentation/clients/java/config.md -%})).

For more information [see the sentry-cli documentation]({%- link _documentation/cli/configuration.md -%}#configuration-values). At the very minimum you will need something like this:

```gradle
defaults.project=___PROJECT_NAME___
defaults.org=___ORG_NAME___
auth.token=YOUR_AUTH_TOKEN
```

You can find your authentication token [on the Sentry API page](https://sentry.io/api/). For more information about the available configuration options see _/cli/configuration_.

##### Gradle Configuration

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

#### Manual Integration

If you choose not to use the Gradle integration, you may handle the processing and upload steps manually. However, it is highly recommended that you use the Gradle integration if at all possible.

First, you need to add the following to your ProGuard rules file:

```gradle
-keepattributes LineNumberTable,SourceFile
-dontwarn org.slf4j.**
-dontwarn javax.**
-keep class io.sentry.event.Event { *; }
-keep class * extends java.lang.Exception
```

##### ProGuard UUIDs

After ProGuard files are generated you will need to embed the UUIDs of the ProGuard mapping files in a properties file named `sentry-debug-meta.properties` in the assets folder. The Java SDK will look for the UUIDs there to link events to the correct mapping files on the server side.

**Sentry calculates UUIDs for ProGuard files.** For more information about how this works, see [ProGuard UUIDs]({%- link _documentation/workflow/debug-files.md -%}#proguard-uuids).

`sentry-cli` can write the `sentry-debug-meta.properties` file for you:

```bash
sentry-cli upload-proguard \
    --android-manifest app/build/intermediates/manifests/full/release/AndroidManifest.xml \
    --write-properties app/build/intermediates/assets/release/sentry-debug-meta.properties \
    --no-upload \
    app/build/outputs/mapping/release/mapping.txt
```

This file needs to be in your APK, so **this needs to be run before the APK is packaged**. You can do that by creating a gradle task that runs before the dex packaging.

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

##### Uploading ProGuard Files

Finally, you need manually upload ProGuard files with `sentry-cli` as follows:

```bash
sentry-cli upload-proguard \
    --android-manifest app/build/intermediates/manifests/full/release/AndroidManifest.xml \
    app/build/outputs/mapping/release/mapping.txt
```

## Google App Engine


The `sentry-appengine` library provides [Google App Engine](https://cloud.google.com/appengine/) support for Sentry via the [Task Queue API](https://cloud.google.com/appengine/docs/java/taskqueue/).

The source can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-appengine).

<!-- WIZARD appengine -->
### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-appengine</artifactId>
    <version>1.7.30</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-appengine:1.7.30'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-appengine" % "1.7.30"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-appengine%7C1.7.30%7Cjar).

### Usage

This module provides a new `SentryClientFactory` implementation which replaces the default async system with a Google App Engine compatible one. You’ll need to configure Sentry to use the `io.sentry.appengine.AppEngineSentryClientFactory` as its factory.

The queue size and thread options will not be used as they are specific to the default Java threading system.
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### Queue Name

By default, the default task queue will be used, but it’s possible to specify which one will be used with the `sentry.async.gae.queuename` option:

```
http://public:private@host:port/1?async.gae.queuename=MyQueueName
```

### Connection Name

As the queued tasks are sent across different instances of the application, it’s important to be able to identify which connection should be used when processing the event. To do so, the GAE module will identify each connection based on an identifier either automatically generated or user defined. To manually set the connection identifier (only used internally) use the option `sentry.async.gae.connectionid`:

```
http://public:private@host:port/1?async.gae.connectionid=MyConnection
```

## java.util.logging

The `sentry` library provides a [java.util.logging Handler](http://docs.oracle.com/javase/7/docs/api/java/util/logging/Handler.html) that sends logged exceptions to Sentry. Once this integration is configured you can _also_ use Sentry’s static API, [as shown on the usage page]({%- link _documentation/clients/java/usage.md -%}#usage-example), in order to do things like record breadcrumbs, set the current user, or manually send events.

The source for `sentry` can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry).

{% capture __alert_content -%}
The old `raven` library is no longer maintained. It is highly recommended that you [migrate]({%- link _documentation/clients/java/migration.md -%}) to `sentry` (which this documentation covers). [Check out the migration guide]({%- link _documentation/clients/java/migration.md -%}) for more information. If you are still using `raven`, you can [find the old documentation here](https://github.com/getsentry/sentry-java/blob/raven-java-8.x/docs/modules/raven.rst).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

<!-- WIZARD logging -->
### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>1.7.30</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry:1.7.30'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry" % "1.7.30"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry%7C1.7.30%7Cjar).

### Usage

The following example configures a `ConsoleHandler` that logs to standard out at the `INFO` level and a `SentryHandler` that logs to the Sentry server at the `WARN` level. The `ConsoleHandler` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `logging.properties` format:

```ini
# Enable the Console and Sentry handlers
handlers=java.util.logging.ConsoleHandler,io.sentry.jul.SentryHandler

# Set the default log level to INFO
.level=INFO

# Override the Sentry handler log level to WARNING
io.sentry.jul.SentryHandler.level=WARNING
```

When starting your application, add the `java.util.logging.config.file` to the system properties, with the full path to the `logging.properties` as its value:

```bash
$ java -Djava.util.logging.config.file=/path/to/app.properties MyClass
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration) for ways you can do this.
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### In Practice

```java
import java.util.logging.Level;
import java.util.logging.Logger;

public class MyClass {
    private static final Logger logger = Logger.getLogger(MyClass.class.getName());

    void logSimpleMessage() {
        // This sends a simple event to Sentry
        logger.error(Level.INFO, "This is a test");
    }

    void logWithBreadcrumbs() {
        // Record a breadcrumb that will be sent with the next event(s),
        // by default the last 100 breadcrumbs are kept.
        Sentry.record(
            new BreadcrumbBuilder().setMessage("User made an action").build()
        );

        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logException() {
        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry
            logger.error(Level.SEVERE, "Exception caught", e);
        }
    }

    void unsafeMethod() {
        throw new UnsupportedOperationException("You shouldn't call this!");
    }
}
```

## Log4j 1.x

The `sentry-log4j` library provides [Log4j 1.x](https://logging.apache.org/log4j/1.2/) support for Sentry via an [Appender](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/Appender.html) that sends logged exceptions to Sentry. Once this integration is configured you can _also_ use Sentry’s static API, [as shown on the usage page]({%- link _documentation/clients/java/usage.md -%}#usage-example), in order to do things like record breadcrumbs, set the current user, or manually send events.

The source can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-log4j).

{% capture __alert_content -%}
The old `raven-log4j` library is no longer maintained. It is highly recommended that you [migrate]({%- link _documentation/clients/java/migration.md -%}) to `sentry-log4j` (which this documentation covers). [Check out the migration guide]({%- link _documentation/clients/java/migration.md -%}) for more information. If you are still using `raven-log4j`, you can [find the old documentation here](https://github.com/getsentry/sentry-java/blob/raven-java-8.x/docs/modules/log4j.rst).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

<!-- WIZARD log4j -->
### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j</artifactId>
    <version>1.7.30</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-log4j:1.7.30'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-log4j" % "1.7.30"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-log4j%7C1.7.30%7Cjar).

### Usage

The following examples configure a `ConsoleAppender` that logs to standard out at the `INFO` level and a `SentryAppender` that logs to the Sentry server at the `WARN` level. The `ConsoleAppender` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `log4j.properties` format:

```ini
# Enable the Console and Sentry appenders
log4j.rootLogger=INFO, Console, Sentry

# Configure the Console appender
log4j.appender.Console=org.apache.log4j.ConsoleAppender
log4j.appender.Console.layout=org.apache.log4j.PatternLayout
log4j.appender.Console.layout.ConversionPattern=%d{HH:mm:ss.SSS} [%t] %-5p: %m%n

# Configure the Sentry appender, overriding the logging threshold to the WARN level
log4j.appender.Sentry=io.sentry.log4j.SentryAppender
log4j.appender.Sentry.threshold=WARN
```

Alternatively, using the `log4j.xml` format:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration debug="true"
    xmlns:log4j='http://jakarta.apache.org/log4j/'>

    <!-- Configure the Console appender -->
    <appender name="Console" class="org.apache.log4j.ConsoleAppender">
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern"
                   value="%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n" />
        </layout>
    </appender>

    <!-- Configure the Sentry appender, overriding the logging threshold to the WARN level -->
    <appender name="Sentry" class="io.sentry.log4j.SentryAppender">
        <!-- Override the Sentry handler log level to WARN -->
        <filter class="org.apache.log4j.varia.LevelRangeFilter">
            <param name="levelMin" value="WARN" />
        </filter>
    </appender>

    <!-- Enable the Console and Sentry appenders, Console is provided as an example
 of a non-Sentry logger that is set to a different logging threshold -->
    <root level="INFO">
        <appender-ref ref="Console" />
        <appender-ref ref="Sentry" />
    </root>
</log4j:configuration>
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration) for ways you can do this.
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### Additional Data

It’s possible to add extra data to events thanks to [the MDC](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/MDC.html) and [the NDC](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/NDC.html) systems provided by Log4j 1.x.

#### Mapped Tags

By default all MDC parameters are stored under the “Additional Data” tab in Sentry. By specifying the `mdctags` option in your configuration you can choose which MDC keys to send as tags instead, which allows them to be used as filters within the Sentry UI.

```java
void logWithExtras() {
    // MDC extras
    MDC.put("Environment", "Development");
    MDC.put("OS", "Linux");

    // This sends an event where the Environment and OS MDC values are set as additional data
    logger.error("This is a test");
}
```

### In Practice

```java
import org.apache.log4j.Logger;
import org.apache.log4j.MDC;
import org.apache.log4j.NDC;

public class MyClass {
    private static final Logger logger = Logger.getLogger(MyClass.class);

    void logSimpleMessage() {
        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logWithBreadcrumbs() {
        // Record a breadcrumb that will be sent with the next event(s),
        // by default the last 100 breadcrumbs are kept.
        Sentry.record(
            new BreadcrumbBuilder().setMessage("User made an action").build()
        );

        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logWithExtras() {
        // MDC extras
        MDC.put("extra_key", "extra_value");
        // NDC extras are sent under 'log4J-NDC'
        NDC.push("Extra_details");
        // This sends an event with extra data to Sentry
        logger.error("This is a test");
    }

    void logException() {
        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry
            logger.error("Exception caught", e);
        }
    }

    void unsafeMethod() {
        throw new UnsupportedOperationException("You shouldn't call this!");
    }
}
```

### Asynchronous Logging

Sentry uses asynchronous communication by default, and so it is unnecessary to use an [AsyncAppender](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/AsyncAppender.html).

## Log4j 2.x

The `sentry-log4j2` library provides [Log4j 2.x](https://logging.apache.org/log4j/2.x/) support for Sentry via an [Appender](https://logging.apache.org/log4j/2.x/log4j-core/apidocs/org/apache/logging/log4j/core/Appender.html) that sends logged exceptions to Sentry. Once this integration is configured you can _also_ use Sentry’s static API, [as shown on the usage page]({%- link _documentation/clients/java/usage.md -%}#usage-example), in order to do things like record breadcrumbs, set the current user, or manually send events.

The source can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-log4j2).

{% capture __alert_content -%}
The old `raven-log4j2` library is no longer maintained. It is highly recommended that you [migrate]({%- link _documentation/clients/java/migration.md -%}) to `sentry-log4j2` (which this documentation covers). [Check out the migration guide]({%- link _documentation/clients/java/migration.md -%}) for more information. If you are still using `raven-log4j2`, you can [find the old documentation here](https://github.com/getsentry/sentry-java/blob/raven-java-8.x/docs/modules/log4j2.rst).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

<!-- WIZARD log4j2 -->
### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j2</artifactId>
    <version>1.7.30</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-log4j2:1.7.30'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-log4j2" % "1.7.30"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-log4j2%7C1.7.30%7Cjar).

### Usage

The following example configures a `ConsoleAppender` that logs to standard out at the `INFO` level and a `SentryAppender` that logs to the Sentry server at the `WARN` level. The `ConsoleAppender` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `log4j2.xml` format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration status="warn" packages="org.apache.logging.log4j.core,io.sentry.log4j2">
    <appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />
        </Console>

        <Sentry name="Sentry" />
    </appenders>

    <loggers>
        <root level="INFO">
            <appender-ref ref="Console" />
            <!-- Note that the Sentry logging threshold is overridden to the WARN level -->
            <appender-ref ref="Sentry" level="WARN" />
        </root>
    </loggers>
</configuration>
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration) for ways you can do this.
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### Additional Data

It’s possible to add extra data to events thanks to [the marker system](https://logging.apache.org/log4j/2.x/manual/markers.html) provided by Log4j 2.x.

#### Mapped Tags

By default all MDC parameters are stored under the “Additional Data” tab in Sentry. By specifying the `mdctags` option in your configuration you can choose which MDC keys to send as tags instead, which allows them to be used as filters within the Sentry UI.

```java
void logWithExtras() {
    // ThreadContext ("MDC") extras
    ThreadContext.put("Environment", "Development");
    ThreadContext.put("OS", "Linux");

    // This sends an event where the Environment and OS MDC values are set as additional data
    logger.error("This is a test");
}
```

### In Practice

```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.Marker;
import org.apache.logging.log4j.MarkerManager;

public class MyClass {
    private static final Logger logger = LogManager.getLogger(MyClass.class);
    private static final Marker MARKER = MarkerManager.getMarker("myMarker");

    void logSimpleMessage() {
        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logWithBreadcrumbs() {
        // Record a breadcrumb that will be sent with the next event(s),
        // by default the last 100 breadcrumbs are kept.
        Sentry.record(
            new BreadcrumbBuilder().setMessage("User made an action").build()
        );

        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logWithTag() {
        // This sends an event with a tag named 'log4j2-Marker' to Sentry
        logger.error(MARKER, "This is a test");
    }

    void logWithExtras() {
        // MDC extras
        ThreadContext.put("extra_key", "extra_value");
        // NDC extras are sent under 'log4j2-NDC'
        ThreadContext.push("Extra_details");
        // This sends an event with extra data to Sentry
        logger.error("This is a test");
    }

    void logException() {
        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry
            logger.error("Exception caught", e);
        }
    }

    void unsafeMethod() {
        throw new UnsupportedOperationException("You shouldn't call this!");
    }
}
```

## Logback

The `sentry-logback` library provides [Logback](http://logback.qos.ch/) support for Sentry via an [Appender](http://logback.qos.ch/apidocs/ch/qos/logback/core/Appender.html) that sends logged exceptions to Sentry. Once this integration is configured you can _also_ use Sentry’s static API, [as shown on the usage page]({%- link _documentation/clients/java/usage.md -%}#usage-example), in order to do things like record breadcrumbs, set the current user, or manually send events.

The source can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-logback).

{% capture __alert_content -%}
The old `raven-logback` library is no longer maintained. It is highly recommended that you [migrate]({%- link _documentation/clients/java/migration.md -%}) to `sentry-logback` (which this documentation covers). [Check out the migration guide]({%- link _documentation/clients/java/migration.md -%}) for more information. If you are still using `raven-logback` you can [find the old documentation here](https://github.com/getsentry/sentry-java/blob/raven-java-8.x/docs/modules/logback.rst).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

<!-- WIZARD logback -->
### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>1.7.30</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-logback:1.7.30'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-logback" % "1.7.30"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-logback%7C1.7.30%7Cjar).

### Usage

The following example configures a `ConsoleAppender` that logs to standard out at the `INFO` level and a `SentryAppender` that logs to the Sentry server at the `WARN` level. The `ConsoleAppender` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `logback.xml` format:

```xml
<configuration>
    <!-- Configure the Console appender -->
    <appender name="Console" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Configure the Sentry appender, overriding the logging threshold to the WARN level -->
    <appender name="Sentry" class="io.sentry.logback.SentryAppender">
        <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
            <level>WARN</level>
        </filter>
        <!-- Optionally add an encoder -->
        <encoder>
           <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <!-- Enable the Console and Sentry appenders, Console is provided as an example
 of a non-Sentry logger that is set to a different logging threshold -->
    <root level="INFO">
        <appender-ref ref="Console" />
        <appender-ref ref="Sentry" />
    </root>
</configuration>
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#setting-the-dsn) for ways you can do this.
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
<!-- ENDWIZARD -->

### Additional Data

It’s possible to add extra data to events thanks to [the MDC system provided by Logback](http://logback.qos.ch/manual/mdc.html).

#### Mapped Tags

By default all MDC parameters are stored under the “Additional Data” tab in Sentry. By specifying the `mdctags` option in your configuration you can choose which MDC keys to send as tags instead, which allows them to be used as filters within the Sentry UI.

```java
void logWithExtras() {
    // MDC extras
    MDC.put("Environment", "Development");
    MDC.put("OS", "Linux");

    // This sends an event where the Environment and OS MDC values are set as additional data
    logger.error("This is a test");
}
```

#### Global Tags

Sometimes it's useful to add tags and extra data to all log events.  
You can add tags and extras to logs globally (not thread-bound) by adding entries to the LoggerContext.  
Tags are distinguished by the existing mdcTags configuration property detailed above.

```java
  LoggerContext context = (LoggerContext)LoggerFactory.getILoggerFactory();
  context.putProperty("global", "value");
```

Global log entries can also be added via third-party encoders  
(*whether such entries can be distinguished as tags or entries, however, is encoder implementation-specific*).
The `net.logstash.logback.encoder.LoggingEventCompositeJsonEncoder` for example has a `customFields` option:

```java
  <encoder class="net.logstash.logback.encoder.LogstashEncoder">
    <customFields>{"appname":"myWebservice","roles":["customerorder","auth"]}</customFields>
  </encoder>
```

In the event of naming clashes, the more specific MDC tags will take precedence.

### In Practice

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.slf4j.MarkerFactory;

public class MyClass {
    private static final Logger logger = LoggerFactory.getLogger(MyClass.class);
    private static final Marker MARKER = MarkerFactory.getMarker("myMarker");

    void logSimpleMessage() {
        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logWithBreadcrumbs() {
        // Record a breadcrumb that will be sent with the next event(s),
        // by default the last 100 breadcrumbs are kept.
        Sentry.record(
            new BreadcrumbBuilder().setMessage("User made an action").build()
        );

        // This sends a simple event to Sentry
        logger.error("This is a test");
    }

    void logWithTag() {
        // This sends an event with a tag named 'logback-Marker' to Sentry
        logger.error(MARKER, "This is a test");
    }

    void logWithExtras() {
        // MDC extras
        MDC.put("extra_key", "extra_value");
        // This sends an event with extra data to Sentry
        logger.error("This is a test");
    }
    
    void logWithGlobalTag() {
       LoggerContext context = (LoggerContext)LoggerFactory.getILoggerFactory();
       // This adds a tag named 'logback-Marker' to every subsequent Sentry event
       context.putProperty(MARKER, "This is a test");
       
        // This sends an event to Sentry, and a tag named 'logback-Marker' will be added.
        logger.info("This is a test");
    }
    
    void addGlobalExtras() {
       LoggerContext context = (LoggerContext)LoggerFactory.getILoggerFactory();
       // This adds extra data to every subsequent Sentry event
       context.putProperty("extra_key", "extra_value");
       
       // This sends an event to Sentry, and extra data ("extra_key", "extra_value") will be added.
        logger.info("This is a test");
    }

    void logException() {
        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry
            logger.error("Exception caught", e);
        }
    }

    void unsafeMethod() {
        throw new UnsupportedOperationException("You shouldn't call this!");
    }
}
```

## Spring

The `sentry-spring` library provides [Spring](https://spring.io/) support for Sentry via a [HandlerExceptionResolver](https://docs.spring.io/spring/docs/4.3.9.RELEASE/javadoc-api/org/springframework/web/servlet/HandlerExceptionResolver.html) that sends exceptions to Sentry. Once this integration is configured you can _also_ use Sentry’s static API, [as shown on the usage page]({%- link _documentation/clients/java/usage.md -%}#usage-example), in order to do things like record breadcrumbs, set the current user, or manually send events.

The source can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-spring).

{% capture __alert_content -%}
You should **not** configure `sentry-spring` alongside a Sentry logging integration (such as `sentry-logback`), or you will most likely double-report exceptions.

A Sentry logging integration is more general and will capture errors (and possibly warnings, depending on your configuration) that occur inside _or outside_ of a Spring controller. In most scenarios, using one of the logging integrations instead of `sentry-spring` is preferred.

{%- endcapture -%}
{%- include components/alert.html
    title="Important Note About Logging Integrations"
    content=__alert_content
    level="warning"
%}

### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring</artifactId>
    <version>1.7.30</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-spring:1.7.30'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-spring" % "1.7.30"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-spring%7C1.7.30%7Cjar).

### Usage

The `sentry-spring` library provides two classes that can be enabled by registering them as Beans in your Spring application.

#### Recording Exceptions

In order to record all exceptions thrown by your controllers, you can register `io.sentry.spring.SentryExceptionResolver` as a Bean in your application. Once registered, all exceptions will be sent to Sentry and then passed on to the default exception handlers.

Configuration via `web.xml`:

```xml
<bean class="io.sentry.spring.SentryExceptionResolver"/>
```

Or via a configuration class:

```java
@Bean
public HandlerExceptionResolver sentryExceptionResolver() {
    return new io.sentry.spring.SentryExceptionResolver();
}
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#setting-the-dsn) for ways you can do this.

#### Spring Boot HTTP Data

Spring Boot doesn’t automatically load any `javax.servlet.ServletContainerInitializer`, which means the Sentry SDK doesn’t have an opportunity to hook into the request cycle to collect information about the HTTP request. In order to add HTTP request data to your Sentry events in Spring Boot, you need to register the `io.sentry.spring.SentryServletContextInitializer` class as a Bean in your application.

Configuration via `web.xml`:

```xml
<bean class="io.sentry.spring.SentryServletContextInitializer"/>
```

Or via a configuration class:

```java
@Bean
public ServletContextInitializer sentryServletContextInitializer() {
    return new io.sentry.spring.SentryServletContextInitializer();
}
```

After that, your Sentry events should contain information such as HTTP request headers.
