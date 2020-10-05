---
name: Logback
doc_link: https://docs.sentry.io/platforms/java/guides/logback/
support_level: production
type: framework
---

### Installation

```xml {tabTitle:Maven}
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>{{ packages.version('sentry.java', '3.0.0') }}</version>
</dependency>
```

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry-logback:{{ packages.version('sentry.java', '3.0.0') }}'
```

```scala {tabTitle: SBT}
libraryDependencies += "io.sentry" % "sentry-logback" % "{{ packages.version('sentry.java', '1.7.30') }}"
```

### Usage

The following example configures a `ConsoleAppender` that logs to standard out at the `INFO` level and a `SentryAppender` that logs to the Sentry server at the `ERROR` level. The `ConsoleAppender` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

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

### DSN Configuration

Note that **you need to configure your DSN** (client key).

```xml
<appender name="Sentry" class="io.sentry.logback.SentryAppender">
    <options>
        <dsn>___PUBLIC_DSN___</dsn>
    </options>
</appender>
```

If the DSN is not present in the `logback.xml` configuration, Sentry will attempt to read it from the system property `sentry.dsn`, environment variable `SENTRY_DSN` or the `dsn` property in `sentry.properties` file. [See the configuration page](/platforms/java/configuration/) for more details on external configuration.

See the [provided examples in the `Java` SDK repository](https://github.com/getsentry/sentry-java/tree/main/sentry-samples) for examples to send your first event to Sentry.
