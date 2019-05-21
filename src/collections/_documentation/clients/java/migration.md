---
title: 'Migration from Raven Java'
sidebar_order: 10
---

The old `raven-java` library has been overhauled and renamed to `sentry-java`. The focus of the new release was to improve APIs, make the underlying client completely independent of logging integrations, and to rename (from `raven-*`) for clarity.

What follows is a small guide explaining the major changes.

## New Artifacts

`Before (raven-java)`

: Artifact named `raven` (and others: `raven-*`) under the `com.getsentry.raven` group. Final minor release was version `8.0.x`.

`Now (sentry-java)`

: Artifact named `sentry` (and others: `sentry-*`) under the `io.sentry` group. Started over with version `1.0.0` (but please use the latest version!).

## New Packages

`Before (raven-java)`

: Package root was `com.getsentry.raven`.

  For example, the `logback` appender used to be referenced in configuration by using `com.getsentry.raven.logback.SentryAppender`.

`Now (sentry-java)`

: Package root is `io.sentry`.

  For example, the `logback` appender is now referenced in configuration by using `io.sentry.logback.SentryAppender`.

## Logging Integration Configuration

`Before (raven-java)`

: Most (or all) configuration would be done inside of the logging appender itself. For example:

  ```xml
  <appender name="Sentry" class="com.getsentry.raven.logback.SentryAppender">
      <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
          <level>WARN</level>
      </filter>
      <dsn>https://host:port/1?options</dsn>
      <release>1.0.0</release>
  </appender>
  ```

`Now (sentry-java)`

: While setting up the `SentryAppender` itself is still required for logging integrations, **configuration** of Sentry is no longer done in the same place.

  This is because appenders are initialized only when the first message (at or above the threshold) is sent to them, which means Sentry has no idea how to initialize and configure itself until the first event is sent. This may seem OK, but it prevented users from being able to do things before an error was sent, such as: record breadcrumbs, set the current user, and more.

  For this reason, all configuration is now done “outside” of the logging integration itself. You may configure Sentry using a properties file (default: `sentry.properties`) if you preferred the old style, [more information can be found on the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration).

  For example:

  ```xml
  <!-- logback.xml -->
  <appender name="Sentry" class="io.sentry.logback.SentryAppender">
      <filter class="ch.qos.logback.classic.filter.ThresholdFilter">
          <level>WARN</level>
      </filter>
  </appender>
  ```

  ```properties
  # sentry.properties
  dsn=https://host:port/1?options
  release=1.0.0
  ```

  ```java
  // you can now record breadcrumbs *before* the first event is even sent
  Sentry.getContext().recordBreadcrumb(
      new BreadcrumbBuilder().setMessage("Made a call to the database.").build()
  );
  ```

## Raven Class Changes

`Before (raven-java)`

: The `Raven` class was both the core client class and also had the ability to statically store a client and send events without keeping track of the instance yourself.

`Now (sentry-java)`

: The core client class is now called `SentryClient` and there is now separate `Sentry` class that you may use to handle initializing Sentry statically and sending events.

  For example:

  ```java
  // The static SentryClient can be lazily initialized from anywhere in your application.
  // Your DSN needs to be provided somehow, check the configuration documentation!
  Sentry.capture("Hello, world!")
  ```

## Configuration via DSN

`Before (raven-java)`

: Options were prefixed with `raven.`, for example: `raven.async`.

`Now (sentry-java)`

: Options are no longer prefixed, for example: `async`.

## Configuration via Java System Properties

`Before (raven-java)`

: Only certain options could be set, and only in the logging integrations. For example: `sentry.release` was allowed but `sentry.async` did nothing.

`Now (sentry-java)`

: All options can be configured via Java System Properties, for example: `sentry.async=false` is respected.

## Configuration via Environment Variables

`Before (raven-java)`

: Only certain options could be set, and only in the logging integrations. For example: `SENTRY_RELEASE` was allowed but `SENTRY_ASYNC` did nothing.

`Now (sentry-java)`

: All options can be configured via Environment Variables, for example: `SENTRY_ASYNC=false` is respected.

## Classes Renamed

`Before (raven-java)`

: Many classes contained the word `Raven`. For example `RavenServletRequestListener`.

`Now (sentry-java)`

: All instances of `Raven` have been renamed `Sentry`. For example `SentryServletRequestListener`.

  In addition, as noted above, the underlying client class `Raven` became `SentryClient`, and so `RavenFactory` also became `SentryClientFactory` and `DefaultRavenFactory` became `DefaultSentryClientFactory`.

## Custom Factories

`Before (raven-java)`

: To do customization users would typically create a `DefaultRavenFactory` subclass and register it in one of multiple (painful) ways.

`Now (sentry-java)`

: To do customization users subclass `DefaultSentryClientFactory` and then call out that class with the `factory` option, like `factory=my.company.MySentryClientFactory`. [See the configuration page]({%- link _documentation/clients/java/config.md -%}#configuration) for more information.

## Android

`Before (raven-java)`

: There used to be a `Raven` wrapper called `com.getsentry.raven.android.Raven` that was a second class interface for interacting with Sentry on Android.

`Now (sentry-java)`

: Android users now use the same `Sentry` and `SentryClient` classes as everyone, they just need to initialize it with their application context and the `AndroidSentryClientFactory`. For an example, [see the Android documentation]({%- link _documentation/clients/java/integrations.md -%}).
