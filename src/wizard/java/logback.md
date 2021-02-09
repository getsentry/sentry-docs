---
name: Logback
doc_link: https://docs.sentry.io/platforms/java/guides/logback/
support_level: production
type: framework
---

<Alert level="info">
   The sentry-logback library provides Logback support for Sentry using an <a href=https://logback.qos.ch/apidocs/ch/qos/logback/core/Appender.html>Appender</a> that sends logged exceptions to Sentry.
</Alert>

Install Sentry's integration with Logback using either Maven or Gradle:

### Maven

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>{{ packages.version('sentry.java.logback', '4.0.0') }}</version>
</dependency>
```

### Gradle

```groovy
implementation 'io.sentry:sentry-logback:{{ packages.version('sentry.java.logback', '4.0.0') }}'
```

For other dependency managers see the [central Maven repository](https://search.maven.org/artifact/io.sentry/sentry-logback).

Configure Sentry as soon as possible in your application's lifecycle:

<Note>

The following example configures a ConsoleAppender that logs to standard out at the INFO level, and a SentryAppender that logs to the Sentry server at the ERROR level. This only an example of a non-Sentry appender set to a different logging threshold, similar to what you may already have in your project.

</Note>

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
        <options>
            <dsn>___PUBLIC_DSN___</dsn>
        </options>
    </appender>

    <!-- Enable the Console and Sentry appenders, Console is provided as an example
 of a non-Sentry logger that is set to a different logging threshold -->
    <root level="INFO">
        <appender-ref ref="Console" />
        <appender-ref ref="Sentry" />
    </root>
</configuration>
```

You'll also need to configure your DSN (client key) if it's not already in the `logback.xml` configuration. Learn more in our <a href=https://docs.sentry.io/platforms/java/guides/logback/#dsn-configuration/>our documentation for DSN configuration</a>.

Next, you'll need to set your log levels, as illustrated here. You can learn more about <a href=https://docs.sentry.io/platforms/java/guides/logback/#minimum-log-level/>configuring log levels</a> in our documentation.

```xml
<appender name="Sentry" class="io.sentry.logback.SentryAppender">
    <options>
        <dsn>___PUBLIC_DSN___</dsn>
    </options>
    <!-- Optionally change minimum Event level. Default for Events is ERROR -->
    <minimumEventLevel>WARN</minimumEventLevel>
    <!-- Optionally change minimum Breadcrumbs level. Default for Breadcrumbs is INFO -->
    <minimumBreadcrumbLevel>DEBUG</minimumBreadcrumbLevel>
</appender>
```

Last, create an intentional error, so you can test that everything is working:

### Java

```java {tabTitle: Java}
import java.lang.Exception;
import io.sentry.Sentry;

try {
  throw new Exception("This is a test.");
} catch (Exception e) {
  Sentry.captureException(e);
}
```

### Kotlin

```kotlin
import java.lang.Exception
import io.sentry.Sentry

try {
  throw Exception("This is a test.")
} catch (e: Exception) {
  Sentry.captureException(e)
}
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.  
