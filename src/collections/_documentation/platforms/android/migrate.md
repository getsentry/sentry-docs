---
title: Migration
sidebar_order: 1
---

## Migrating from `sentry-android 1.x` to `sentry-android 2.0`

With Sentry Android, we've updated the API to be closer to the unified API [https://docs.sentry.io/development/sdk-dev/unified-api/](https://docs.sentry.io/development/sdk-dev/unified-api/). And now that the SDK isn't built on top of `sentry-java`, Sentry Android has more Android-specific features.

If you want to upgrade from the previous version of the SDK, please check the following sections of changes that may need updating in your code.

### Configuration

The file `sentry.properties` used by the previous version of the SDK has been discontinued. Configurations for the new SDK are in `AndroidManifest.xml` or directly in the code.

Example of the configuration in the Manifest:

```xml
<application>
<!-- The configuration must be inside of the application tag -->
<!-- Example of the Sentry DSN setting -->
    <meta-data android:name="io.sentry.dsn" android:value="___PUBLIC_DSN__" />
</application>
```

If you want to set the configuration manually in the code, you need to initialize the SDK with `SentryAndroid.init()`  (described in the Installation [LINK: to installation sect]) in the same file as `SentryAndroidOptions`, which holds configuration items.

### Installation

The new SDK can initialize automatically; all you need to do is provide the DSN in your Manifest file, as shown on the previous example in the [LINK: configuration] section.

**Manual Installation**

If you want to register any callback to filter and modify events and/or breadcrumbs, or if you want to provide the configuration values via code, you need to initialize the SDK using the `SentryAndroid.init()`.

To initialize the SDK manually:

- Disable the `auto-init` feature by providing the following line in the manifest:

        <meta-data android:name="io.sentry.auto-init" android:value="false" />

- Initialize the SDK directly in your application:

        SentryAndroid.init(context, options -> {
          options.setDsn("___PUBLIC_DSN___");    
        });

### Releases

Please note that the new SDK will send with each event a release version in a different format than the previous SDK.

If you are using the GitHub or GitLab integrations, you need to do one of the following:

- use the new format LINK: ([https://docs.sentry.io/platforms/android/#releases](https://docs.sentry.io/platforms/android/#releases))
- set the release in your `AndroidManifest.xml`
- change your code as described in the configuration section.

### API

**Set tag**

*Old*:

```java
Sentry.getContext().addTag("tagName", "tagValue");
```

*New*:

    Sentry.setTag("tagName", "tagValue");

**Capture custom exception**

*Old*:

```java
try {
    int x = 1 / 0;
} catch (Exception e) {
    Sentry.capture(e);
}
```

*New*:

```java
try {
    int x = 1 / 0;
} catch (Exception e) {
    Sentry.captureException(e);
}
```

**Capture a message**

*Old*:

```java
Sentry.capture("This is a test");
```

*New*:

```java
Sentry.captureMessage("This is a test"); // SentryLevel.INFO by default
Sentry.captureMessage("This is a test", SentryLevel.WARNING); // or specific level 
```

**Breadcrumbs**

*Old*:

```java
Sentry.getContext().recordBreadcrumb(
    new BreadcrumbBuilder().setMessage("User made an action").build()
);
```

*New*:

```java
Sentry.addBreadcrumb("User made an action");
```

**User**

*Old*:

```java
Sentry.getContext().setUser(
    new UserBuilder().setEmail("hello@sentry.io").build()
);
```

*New*:

```java
User user = new User();
user.setEmail("hello@sentry.io");
Sentry.setUser(user); 
```

**Set extra**

*Old*:

```java
Sentry.getContext().addExtra("extra", "thing");
```

*New*:

```java
Sentry.setExtra("extra", "thing");
```

### Multi-Dex support

If you are using multi-dex and our SDK we would recommend you to update your multi dex configuration

```groovy
release {
    multiDexKeepProguard file('multidex-config.pro')
}
```

and add to the [multidex-config.pro](http://multidex-config.pro) the following lines:

```
-keep class io.sentry.android.core.SentryAndroidOptions
-keep class io.sentry.android.ndk.SentryNdk
```
