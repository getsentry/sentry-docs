---
name: Log4j 2.x
doc_link: https://docs.sentry.io/platforms/java/guides/log4j2/
support_level: production
type: framework
---

### Installation

```xml {tabTitle:Maven}
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j2</artifactId>
    <version>{{ packages.version('sentry.java', '3.0.0') }}</version>
</dependency>
```

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry-log4j2:{{ packages.version('sentry.java', '3.0.0') }}'
```

```scala {tabTitle: SBT}
libraryDependencies += "io.sentry" % "sentry-log4j2" % "{{ packages.version('sentry.java', '3.0.0') }}"
```

### Usage

The following example configures a `ConsoleAppender` that logs to standard out at the `INFO` level and a `SentryAppender` that logs to the Sentry server at the `ERROR` level. The `ConsoleAppender` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `log4j2.xml` format:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="warn" packages="org.apache.logging.log4j.core,io.sentry.log4j2">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
        <Sentry name="Sentry"
                dsn="___PUBLIC_DSN___" />
    </Appenders>
    <Loggers>
        <Root level="info">
            <AppenderRef ref="Sentry"/>
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

### DSN Configuration

Note that **you need to configure your DSN** (client key).

```xml
<Sentry name="Sentry"
        dsn="___PUBLIC_DSN___" />
```

If the DSN is not present in the `log4j2.xml` configuration, Sentry will attempt to read it from the system property `sentry.dsn`, environment variable `SENTRY_DSN` or the `dsn` property in `sentry.properties` file. [See the configuration page](/platforms/java/configuration/) for more details on external configuration.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
