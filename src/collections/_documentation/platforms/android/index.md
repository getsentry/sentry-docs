---
title: Android
---

<!-- WIZARD android -->
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
    implementation 'io.sentry:sentry-android:{version}'
}
```
<!-- ENDWIZARD -->

{% capture __alert_content -%}
For the minimal required API level, see [Requirements](#requirements).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="info"
%}

### Connecting the SDK to Sentry

After you’ve completed setting up a project in Sentry, Sentry will give you a value which we call a DSN or Data Source Name. It looks a lot like a standard URL, but it’s just a representation of the configuration required by the Sentry SDKs. It consists of a few pieces, including the protocol, public key, the server address, and the project identifier.

Add your DSN to the manifest file.

```xml
<application>
    <meta-data android:name="io.sentry.dsn" android:value="https://key@sentry.io/123" />
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

Then, you can see the error in your dashboard:

[{% asset android/android_error.png alt="Example of a caught exception in the Sentry dashboard" %}]({% asset android/android_error.png @path %})

If you prefer learning with examples, you can download our [sample application](https://github.com/getsentry/sentry-android/tree/master/sentry-sample).

## Manual Initialization

Initialize the SDK manually when you need to provide additional configuration to the SDK that cannot be specified in the manifest.

To initialize the SDK manually, disable the auto initialization. You can do so by adding the following line into your manifest:

```xml
<application>
    <meta-data android:name="io.sentry.auto-init" android:value="false" />
</application>
```

The next step is to initialize the SDK directly in your code.

The SDK can catch errors and crashes only after you've initialized it. So, we recommend calling `SentryAndroid.init` in the instance of the Application class right after the application is created. 

Configuration options will be loaded from the manifest so that you don't need to have the static properties in your code. In the `init` method, you can provide a callback that will modify the configuration and also register new options.

```java
public class SentryApplication extends Application {
    public void onCreate() {
        super.onCreate();
        /**
            * Manual Initialization of the Sentry Android SDK
            * @Context - Instance of the Android Context
            * @Options - Call back function that you need to provide to be able to modify the options.
            * The call back function is provided with the options loaded from the manifest.
            *
            */
        SentryAndroid.init(this, options -> {
            // Add a callback that will be used before the event is sent to Sentry.
            // With this callback, you can modify the event or, when returning null, also discard the event.
            options.setBeforeSend((event, hint) -> {
                if (SentryLevel.DEBUG.equals(event.getLevel()))
                    return null;
                else
                    return event;
            });
        });
    }
}
```

For more details about the available configurations, see [Configuration options](#configuration-options).

## Capturing Errors

### Crash Reporting

Your application will crash whenever a thrown exception goes uncaught. The Sentry SDK catches the exception right before the crash and builds a crash report that will persist to the disk. The SDK will try to send the report right after the crash, but since the environment may be unstable at the crash time, the report is guaranteed to send once the application is started again.

If there is a fatal error in your native code, the process is similar. The crash report might send before the app crashes, but will for sure send on restart.

The NDK is not only catching the unhandled exceptions but is also set as a signal handler to be able to react to the signals from OS. When the application is about to crash, an error report is created and saved to disk. The SDK will try to send the report right after the crash, but since the environment may be unstable at the crash time, the report is guaranteed to send once the application is started again.

### Capturing Errors manually

Insight into the health of your application doesn't require crashes. You can report exceptions and messages manually using our API.

```java
public class DemoClass {
    /**
    * An example method that throws an exception.
    */
    public void unsafeMethod() {
        throw new RuntimeException();
    }

    /**
    * An Example of how to report an error and how to enrich the error context.
    */
    public void logWithStaticAPI() {
        /*
        Record a breadcrumb in the current context, which will be sent
        with the next event(s). By default, the last 100 breadcrumbs are kept.
        */
        Sentry.addBreadcrumb("User made an action.");

        // Set the user in the current context.
        User user = new User();
        user.setEmail("hello@sentry.io");
        Sentry.setUser(user);

        /*
        This sends a simple event to Sentry, with a simple String message.
        */
        Sentry.captureMessage("This is a test");

        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an error report to the  Sentry
            Sentry.captureException(e);
        }
    }
}
```

## ProGuard

To use ProGuard with Sentry, upload the ProGuard mapping files by using our Gradle integration (**recommended**) or manually by using [sentry-cli]({%- link _documentation/cli/dif.md -%}#proguard-mapping-upload).

### Gradle Integration

Using Gradle (Android Studio) in your `app/build.gradle` add:

```groovy
apply plugin: 'io.sentry.android.gradle'
```

And declare a dependency in your top-level `build.gradle`:

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
    
    dependencies {
        classpath 'io.sentry:sentry-android-gradle-plugin:1.7.31'
    }
}
```

The plugin will automatically generate appropriate ProGuard mapping files and upload them when you run `gradle assemble{BuildVariant}`. For example, `assembleRelease` — Release is the default, but the plugin works for others if you have enabled ProGuard/R8. The credentials for the upload step are loaded via environment variables.

For more information, see the [full sentry-cli documentation]({%- link _documentation/cli/configuration.md -%}#configuration-values).

At the very minimum you will need something like this:

```bash
defaults.project=your-project
defaults.org=your-org
auth.token=YOUR_AUTH_TOKEN
```

You can find your authentication token [on the Sentry API page](https://sentry.io/api/). For more information about the available configuration options, see the [full sentry-cli documentation]({%- link _documentation/cli/configuration.md -%}#configuration-values).

### Gradle Configuration

Additionally, we expose a few configuration values directly in Gradle:

```groovy
sentry {
    // Disables or enables the automatic configuration of ProGuard
    // for Sentry.  This injects a default config for ProGuard so
    // you don't need to do it manually.
    autoProguardConfig true

    // Enables or disables the automatic upload of mapping files
    // during a build.  If you disable this, you'll need to manually
    // upload the mapping files with sentry-cli when you do a release.
    autoUpload true

    // Disables or enables the automatic configuration of Native Symbols
    // for Sentry. This executes sentry-cli automatically so
    // you don't need to do it manually.
    // Default is disabled.
    uploadNativeSymbols false

    // Does or doesn't include the source code of native code for Sentry.
    // This executes sentry-cli with the --include-sources param. automatically so
    // you don't need to do it manually.
    // Default is disabled.
    includeNativeSources false
}
```

And that's it! Now when you build your app, the plugin will upload the ProGuard/R8 mappings,
source bundle, and native symbols, as you configured them to Sentry.

## Releases

The Sentry Android SDK automatically attaches a release version to every event.

Once Sentry receives an event with the updated release version, a new release object will be available on the releases page in-app. For more details about formatting your releases, see [Release Version Format](#release-version-format).

With the releases you can:

- Build queries and reports in the [Discover]({%- link _documentation/workflow/discover2/index.md -%}) page to correlate bugs with releases
- Filter events and issues by the release version directly in the tag search on the Issues and Events pages
- Check what new issues were introduced with the new release

With the releases and a [GitHub]({%- link _documentation/workflow/integrations/global-integrations.md -%}#github)/[GitLab]({%- link _documentation/workflow/integrations/global-integrations.md -%}#gitlab) integration, you can:

- Determine the issues and regressions introduced in a new release
- Receive suggestions about which commit caused an issue and who is likely responsible
- Resolve issues by including the issue number in your commit message
- Receive email notifications when your code deploys

Even though releases are automatically created as events come in, to take advantage of the *suspected commits* feature, you need to create the release in Sentry as part of your build process.

Sentry offers a command-line tool to aid with this task. After configuring your SDK, setting up releases is a 2-step process (recommended for the use of suspect commits):

1. [Create Release and Associate Commits](https://docs.sentry.io/workflow/releases/#create-release)
2. [Tell Sentry When You Deploy a Release](https://docs.sentry.io/workflow/releases/#create-deploy)

For more information, see [Releases Are Better With Commits](https://blog.sentry.io/2017/05/01/release-commits.html).

### Release Version Format

The default format of the release version that is sent with each event from the SDK is:

```
packageName@versionName+versionCode
```

Please note that if you're using multiple flavors in your application, the release version will be different for each flavor, and different release objects will be created in-app for each flavor.

If you want to change the release name, you can do it in the `AndroidManifest.xml` or directly in the code. 

The release version can be any random string, but we recommend using a similar format to the default. The default involves having the text identifier of your app connected with the version string using "@" and the last optional suffix dedicated to build or an additional identifier. With this format, the Sentry UI will display a more comprehensive release name. For example, company.demo.app@1.1.1 instead of 1.1.0.

To change the release version in the `AndroidManifest.xml`:

```xml
<application>
    <meta-data android:name="io.sentry.release" android:value="io.example@1.1.0" />
</application>
```

Or, you can set the release version in your code during the manual initialization of the SDK as described in [Manual Initialization](#manual-initialization).

```java
SentryAndroid.init(this, options -> {
    options.setRelease("io.example@1.1.0");
});
```

## Context

Sentry supports additional context with events. Often this context is shared among any issue captured in its lifecycle, and includes the following components:

**Structured Contexts**

**User** - Information about the current actor.

**Tags** - Key/value pairs which generate breakdown charts and search filters.

**Level** - An event’s severity.

**Fingerprint** - A value used for grouping events into issues.

**Unstructured Extra Data** - Arbitrary unstructured data that the Sentry SDK stores with an event sample.

### Context Size Limits

Sentry will try its best to accommodate the data you send it, but large context payloads will be trimmed or may be truncated entirely. For more details, see the [data handling SDK documentation]({%- link _documentation/development/sdk-dev/data-handling.md -%}).

### Capturing the User

Sending users to Sentry will unlock many features, primarily the ability to drill down into the number of users affecting an issue, as well as to get a broader sense of the quality of the application.

```java
User user = new User();
user.setUsername("username");
Sentry.setUser(user);
```

Users consist of a few critical pieces of information which are used to construct a unique identity in Sentry. Each of these is optional, but one **must** be present for the Sentry SDK to capture the user:

**`id` -** Your internal identifier for the user.

**`username` -** The user’s username. Generally used as a better label than the internal ID.

**`email` -** An alternative, or addition, to a username. Sentry is aware of email addresses and can show things like Gravatars, unlock messaging capabilities, and more.

**`ipAddress` -** The IP address of the user. If the user is unauthenticated, providing the IP address will suggest that this is unique to that IP. If available, we will attempt to pull this from the HTTP request data.

Additionally, you can provide arbitrary key/value pairs beyond the reserved names, and the Sentry SDK will store those with the user.

### Tagging Events

Tags are key/value pairs assigned to events that can be used for breaking down issues or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

```java
Sentry.setTag("tagKey", "tagValue");
```

For more information, see [Tagging Events]({%- link _documentation/enriching-error-data/context.md -%}#tagging-events) in Context.

### Setting the Level

You can set the severity of an event to one of five values: `fatal`, `error`, `warning`, `info`, and `debug`.
`error` is the default, `fatal` is the most severe, and `debug` is the least severe.

```java
Sentry.setLevel(SentryLevel.WARNING);
```

### Setting the Fingerprint

Sentry uses a fingerprint to decide how to group errors into issues.

For some very advanced use cases, you can override the Sentry default grouping using the `fingerprint` attribute. In supported SDKs, this attribute can be passed with the event information and should be a list of strings.

For code samples, see [Grouping & Fingerprints]({%- link _documentation/data-management/event-grouping/index.md -%}#use-cases).

For more information, see [Aggregate Errors with Custom Fingerprints](https://blog.sentry.io/2018/01/18/setting-up-custom-fingerprints).

### Default Context for Android

To make your life easier, the Android SDK automatically enriches the context with additional information about the device, about the system, and about the release version of your application.

Default Android context should help you correlate the errors with the specific device types, releases, etc. so that you can find the root cause of the problem faster.

Used SDK 

- name
- version

Operating system 

- name
- version
- kernel version
- whether the application was rooted

Package info

- Start time of the application
- Bundle name
- bundle id
- version
- build

Memory size 

- Total available memory on the device
- Free memory at the moment
- Whether the memory was low

Storage

- total storage size
- free storage size
- total external storage size
- free external storage size

Device Info

- Manufacturer
- Brand
- Model
- Model ID
- Architecture

Battery Level

- Whether the Device is being charged at the moment
- Whether the phone was online during the error/crash

Screen info

- orientation of the screen
- screen density
- hight pixels
- width pixels
- resolution

Emulator indicator

- Whether the device is an emulator

## Advanced Usage

### Requirements

For the use of the SDK with the NDK, the minimal required API level is 16. 

If you want to use the SDK without the NDK, you can: 

- disable the NDK as described in the configuration section
- or use sentry-android-core that doesn't contain the NDK and can be used separately. The minimal required API level for this SDK is 14.

To add the sentry-android-core library, you need to provide the following dependency in your build.gradle file.

```groovy
// ADD COMPATIBILITY OPTIONS TO BE COMPATIBLE WITH JAVA 1.8
compileOptions {
    sourceCompatibility = JavaVersion.VERSION_1_8
    targetCompatibility = JavaVersion.VERSION_1_8
}

// ADD SENTRY ANDROID AS A DEPENDENCY
dependencies {
    implementation 'io.sentry:sentry-android-core:{version}'
}
```

If you want to use the SDK with the NDK, but you still want to support the devices on the API level lower than 16, you can update your manifest as follows:

```xml
<manifest>
    <!-- Merging strategy for the imported manifests -->
    <uses-sdk
        tools:overrideLibrary="io.sentry.android" />
</manifest>
```

With these changes:
- SDK will be enabled on all devices with API level ≥ 14
- SDK with NDK will be enabled on all devices with API level ≥ 16

### Breadcrumbs

You can manually add breadcrumbs on other events or disable breadcrumbs.

```java
Breadcrumb breadcrumb = new Breadcrumb();
breadcrumb.setMessage("Https Call to Sentry");
breadcrumb.setData("url", "https://sentry.io");

Sentry.addBreadcrumb(breadcrumb);
```

For more information, see:

- [Full documentation on Breadcrumbs](https://docs.sentry.io/enriching-error-data/breadcrumbs/)
- [Debug Issues Faster with Breadcrumbs](https://blog.sentry.io/2016/05/04/breadcrumbs).

### Configuration options

**NDK Integration**

The NDK integration is packed with the SDK and enabled out by default with each start of the SDK.

Alternatively, you can disable the NDK integration by adding the following line into your manifest.

```xml
<application>
    <meta-data android:name="io.sentry.ndk.enable" android:value="false" />
</application>
```

**Application Not Responding (ANR)** 

Whenever the main UI thread of the application is blocked for more than four seconds, the SDK will report the problem to the server.  (Sentry does not report the ANR if the application is in debug mode.)

If you do not want to monitor the ANR, please add the following line into your manifest.

```xml
<application>
    <meta-data android:name="io.sentry.anr.enable" android:value="false" />
</application>
```

If you want to specify how long the thread should be blocked before the ANR is reported, provide the duration in the attribute `io.sentry.anr.timeout-interval-mills` in your manifest.

```xml
<application>
    <meta-data android:name="io.sentry.anr.timeout-interval-mills" android:value="2000" />
</application>
```

**“In Application” Stack Frames**

Sentry differentiates stack frames that are directly related to your application (“in application”) from stack frames that come from other packages such as the standard library, frameworks, or other dependencies. The application package is automatically marked as inApp. The difference is visible in the Sentry web interface, where only the “in application” frames are displayed by default.

You can configure which package prefixes belong in your application and which don't.

```java
// This can be set only during the initialization of the SDK.
SentryAndroid.init(this, options -> {
        // set all sub packages of java. as packages that do not belong to your application
        options.addInAppExclude("java.");

        // set all sub packages of io.sentry as packages that belong to your application
        options.addInAppInclude("io.sentry");

    });
```

**Filter and modify Events**

Sentry exposes a `beforeSend` callback, which can be used to filter out information or add additional context to the event object.

The callback can be registered during the initialization of the SDK. 

```java
SentryAndroid.init(this, options -> {

        // Add a callback that will be used before the event is sent to Sentry.
        // With this callback, you can modify the event or, when returning null, also discard the event.
        options.setBeforeSend((event, hint) -> {
            String environment = event.getEnvironment();
            if (environment == null || environment.equals("TEST"))
                return null;
            else
                return event;
        });
    });
```

**Filter and modify Breadcrumbs**

If you want to have control over what breadcrumbs are attached to your data, you can register a hook that is called with each new breadcrumb that's created.

That allows the user to decide whether and how a breadcrumb should be sent.

## Integrating the NDK

To use the Android NDK in your native code, include the Sentry NDK libraries into your project so that the compiler can link the libraries during the build.

To do so, use the AndroidNativeBundle Gradle plugin that copies the native libraries from the Sentry NDK into the location that can provide links via the CmakeLists.txt configuration file.

First, we need to declare the dependency in the project build.gradle file:

```groovy
buildscript {
    repositories {
        jcenter()
    }
    
    dependencies {
        // Add the line below, the plugin that copies the binaries
        classpath 'com.ydq.android.gradle.build.tool:nativeBundle:1.0.4'
    }
}
```

Once the dependency is declared, we can use it in the application build.gradle:

```groovy
apply plugin: 'com.ydq.android.gradle.native-aar.import'
```

The last step is to update the CmakeLists.txt configuration to link the Sentry NDK libraries:

```
# include paths generated by androidNativeBundle
include (${ANDROID_GRADLE_NATIVE_BUNDLE_PLUGIN_MK})
# change native-lib to your native lib's name
target_link_libraries(native-lib ${ANDROID_GRADLE_NATIVE_MODULES})
```

Now you can use the Sentry NDK API just by including the sentry.h in your code:

```c
#include <jni.h>
#include <android/log.h>
#include <sentry.h>

#define TAG "sentry-android-demo"
extern "C" JNIEXPORT jstring JNICALL

Java_io_sentry_demo_NativeDemo_crash(JNIEnv *env, jclass cls) {
    __android_log_print(ANDROID_LOG_WARN, "", "Capture a message.");
    sentry_value_t event = sentry_value_new_message_event(
            /*   level */ SENTRY_LEVEL_INFO,
            /*  logger */ "custom",
            /* message */ "Sample message!"
    );
    sentry_capture_event(event);
}
```

To symbolicate the stack trace from native code, we need to have access to the debug symbols of your application. Please check the full documentation on [uploading files]({%- link _documentation/workflow/debug-files.md -%}#uploading-files) to learn more about the upload of the debug symbols.

Example of uploading all your .so files:

```bash
sentry-cli login
sentry-cli upload-dif -o {YOUR ORGANISATION} -p {PROJECT} build/intermediates/merged_native_libs/{buildVariant}
```
