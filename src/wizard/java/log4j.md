---
name: Log4j 1.x
doc_link: https://docs.sentry.io/platforms/java/guides/log4j/
support_level: production
type: framework
---

### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-log4j</artifactId>
    <version>{{ packages.version('sentry.java', '1.7.30') }}</version>
</dependency>
```

Using Gradle:

```groovy
compile 'io.sentry:sentry-log4j:{{ packages.version('sentry.java', '1.7.30') }}'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-log4j" % "{{ packages.version('sentry.java', '1.7.30') }}"
```

### Usage

The following examples configure a `ConsoleAppender` that logs to standard out at the `INFO` level and a `SentryAppender` that logs to the Sentry server at the `WARN` level. The `ConsoleAppender` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `log4j.properties` format:

```ini
# Enable the Console and Sentry appenders
log4j.rootLogger=INFO, Console, Sentry

# Configure the Console appender
log4j.appender.Console=org.apache.log4j.ConsoleAppender
log4j.appender.Console.layout=org.apache.log4j.PatternLayout
log4j.appender.Console.layout.ConversionPattern=%d{HH:mm:ss.SSS} [%t] %-5p: %m%n

# Configure the Sentry appender, overriding the logging threshold to the WARN level
log4j.appender.Sentry=io.sentry.log4j.SentryAppender
log4j.appender.Sentry.threshold=WARN
```

Alternatively, using the `log4j.xml` format:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
<log4j:configuration debug="true"
    xmlns:log4j='http://jakarta.apache.org/log4j/'>

    <!-- Configure the Console appender -->
    <appender name="Console" class="org.apache.log4j.ConsoleAppender">
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern"
                   value="%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n" />
        </layout>
    </appender>

    <!-- Configure the Sentry appender, overriding the logging threshold to the WARN level -->
    <appender name="Sentry" class="io.sentry.log4j.SentryAppender">
        <!-- Override the Sentry handler log level to WARN -->
        <filter class="org.apache.log4j.varia.LevelRangeFilter">
            <param name="levelMin" value="WARN" />
        </filter>
    </appender>

    <!-- Enable the Console and Sentry appenders, Console is provided as an example
 of a non-Sentry logger that is set to a different logging threshold -->
    <root level="INFO">
        <appender-ref ref="Console" />
        <appender-ref ref="Sentry" />
    </root>
</log4j:configuration>
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration options page](/platforms/java/guides/log4j/configuration/options/) for ways you can do this.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
