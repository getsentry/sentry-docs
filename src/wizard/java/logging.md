---
name: java.util.logging
doc_link: https://docs.sentry.io/platforms/java/guides/logging/
support_level: production
type: framework
---

### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>{{ packages.version('sentry.java', '1.7.30') }}</version>
</dependency>
```

Using Gradle:

```groovy
implementation 'io.sentry:sentry:{{ packages.version('sentry.java', '1.7.30') }}'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry" % "{{ packages.version('sentry.java', '1.7.30') }}"
```

### Usage

The following example configures a `ConsoleHandler` that logs to standard out at the `INFO` level and a `SentryHandler` that logs to the Sentry server at the `WARN` level. The `ConsoleHandler` is only provided as an example of a non-Sentry appender that is set to a different logging threshold, like one you may already have in your project.

Example configuration using the `logging.properties` format:

```ini
# Enable the Console and Sentry handlers
handlers=java.util.logging.ConsoleHandler,io.sentry.jul.SentryHandler

# Set the default log level to INFO
.level=INFO

# Override the Sentry handler log level to WARNING
io.sentry.jul.SentryHandler.level=WARNING
```

When starting your application, add the `java.util.logging.config.file` to the system properties, with the full path to the `logging.properties` as its value:

```bash
java -Djava.util.logging.config.file=/path/to/app.properties MyClass
```

Next, **you’ll need to configure your DSN** (client key) and optionally other values such as `environment` and `release`. [See the configuration options page](/platforms/java/guides/logging/configuration/options/) for ways you can do this.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
