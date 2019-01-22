---
title: Spring
sidebar_order: 12
---

The `sentry-spring` library provides [Spring](https://spring.io/) support for Sentry via a [HandlerExceptionResolver](https://docs.spring.io/spring/docs/4.3.9.RELEASE/javadoc-api/org/springframework/web/servlet/HandlerExceptionResolver.html) that sends exceptions to Sentry. Once this integration is configured you can _also_ use Sentry’s static API, [as shown on the usage page]({%- link _documentation/clients/java/usage.md -%}#usage-example), in order to do things like record breadcrumbs, set the current user, or manually send events.

The source can be found [on GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-spring).

## Important Note About Logging Integrations

**Note** that you should **not** configure `sentry-spring` alongside a Sentry logging integration (such as `sentry-logback`), or you will most likely double-report exceptions.

A Sentry logging integration is more general and will capture errors (and possibly warnings, depending on your configuration) that occur inside _or outside_ of a Spring controller. In most scenarios, using one of the logging integrations instead of `sentry-spring` is preferred.

## Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring</artifactId>
    <version>1.7.16</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-spring:1.7.16'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-spring" % "1.7.16"
```

For other dependency managers see the [central Maven repository](https://search.maven.org/#artifactdetails%7Cio.sentry%7Csentry-spring%7C1.7.16%7Cjar).

## Usage

The `sentry-spring` library provides two classes that can be enabled by registering them as Beans in your Spring application.

### Recording Exceptions

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

### Spring Boot HTTP Data

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
