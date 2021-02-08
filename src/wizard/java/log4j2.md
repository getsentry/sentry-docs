---
name: Log4j 2.x
doc_link: https://docs.sentry.io/platforms/java/guides/log4j2/
support_level: production
type: framework
---

<Alert level="info">
The sentry-log4j2 library provides <a href=https://logging.apache.org/log4j/2.x//>Log4j 2.x</a> support for Sentry via an <a href=https://logging.apache.org/log4j/2.x/log4j-core/apidocs/org/apache/logging/log4j/core/Appender.html/>Appender</a> that sends logged exceptions to Sentry.
</Alert>

Install Sentry's integration with Log4j 2.x using either Maven or Gradle:

### Maven

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j2</artifactId>
    <version>{{ packages.version('sentry.java.log4j2', '4.0.0') }}</version>
</dependency>
```

### Gradle

```groovy
implementation 'io.sentry:sentry-log4j2:{{ packages.version('sentry.java.log4j2', '4.0.0') }}'
```

Configure Sentry as soon as possible in your application's lifecycle:

<Note>

The following example using the log4j2.xml format to configure a ConsoleAppender that logs to standard out at the INFO level, and a SentryAppender that logs to the Sentry server at the ERROR level.

</Note>

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="warn" packages="org.apache.logging.log4j.core,io.sentry.log4j2">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
        <Sentry name="Sentry"
                dsn=___PUBLIC_DSN___/>
    </Appenders>
    <Loggers>
        <Root level="info">
            <AppenderRef ref="Sentry"/>
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

You'll also need to configure your DSN (client key) if it's not already in the `log4j2.xml` configuration. Learn more in <a href=https://docs.sentry.io/platforms/java/guides/log4j2/#minimum-log-level/>our documentation for DSN configuration</a>.

Next, set your log levels. You can learn more about <a href=https://docs.sentry.io/platforms/java/guides/log4j2/#minimum-log-level/>configuring log levels</a> in our documentation.

```xml
<!-- Setting minimumBreadcrumbLevel modifies the default minimum level to add breadcrumbs from INFO to DEBUG  -->
<!-- Setting minimumEventLevel the default minimum level to capture an event from ERROR to WARN  -->
<Sentry name="Sentry"
        dsn="https://3d91f10f1d184515b3d434bdc0d906a4@o19635.ingest.sentry.io/7130"
        minimumBreadcrumbLevel="DEBUG"
        minimumEventLevel="WARN"
/>
```


Last, create an intentional error, so you can test that everything is working:

### Java

```java
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
