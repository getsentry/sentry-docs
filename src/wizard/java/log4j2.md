---
name: Log4j 2.x
doc_link: https://docs.sentry.io/clients/java/modules/log4j2/
support_level: production
type: framework
---
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

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page](/clients/java/config/#configuration) for ways you can do this.
<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
