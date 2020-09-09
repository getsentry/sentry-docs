---
name: Logback
doc_link: https://docs.sentry.io/platforms/java/guides/logback/
support_level: production
type: framework
---

### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>{{ packages.version('sentry.java', '1.7.30') }}</version>
</dependency>
```

Using Gradle:

```groovy
implementation 'io.sentry:sentry-logback:{{ packages.version('sentry.java', '1.7.30') }}'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-logback" % "{{ packages.version('sentry.java', '1.7.30') }}"
```

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

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration page](/platforms/java/guides/logback/configuration/options/#setting-the-dsn) for ways you can do this.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
