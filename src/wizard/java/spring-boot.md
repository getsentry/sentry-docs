---
name: Spring Boot
doc_link: https://docs.sentry.io/platforms/java/guides/spring-boot/
support_level: production
type: framework
---

### Installation

```xml {tabTitle:Maven}
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>{{ packages.version('sentry.java', '3.0.0') }}</version>
</dependency>
```

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry-spring-boot-starter:{{ packages.version('sentry.java', '3.0.0') }}'
```

### Usage

The `sentry-spring-boot-starter` must be provided with a `sentry.dsn` property via `application.properties` or `application.yml`:

```properties {tabTitle:application.properties}
sentry.dsn=___PUBLIC_DSN___
```

```yaml {tabTitle:application.yml}
sentry:
  dsn: ___PUBLIC_DSN___
```

See the [provided examples in the `Java` SDK repository](https://github.com/getsentry/sentry-java/tree/main/sentry-samples) for examples to send your first event to Sentry.
