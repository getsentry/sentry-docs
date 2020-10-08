---
name: Spring Boot
doc_link: https://docs.sentry.io/platforms/java/guides/spring-boot/
support_level: production
type: framework
---

In Spring Boot, all uncaught exceptions will be automatically reported.

### Install

Install the SDK via Maven or Gradle:

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

### Configure

Open up `src/main/application.properties` (or `src/main/application.yml`) and configure the DSN, and any other [_settings_](/platforms/java/configuration/#options) you need:

```properties {tabTitle:application.properties}
sentry.dsn=___PUBLIC_DSN___
```

```yaml {tabTitle:application.yml}
sentry:
  dsn: ___PUBLIC_DSN___
```

### Configure Logback

If you use Logback for logging you may also want to send error logs to Sentry.

Add a dependency to `sentry-logback` module and Sentry Spring Boot Starter will auto-configure `SentryAppender`:

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

### Send First Event

You can trigger your first event from your development environment by raising an exception somewhere within your application. An example of this would be a controller throwing an exception on HTTP request:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
  private static final Logger LOGGER = LoggerFactory.getLogger(HelloController.class);

  @GetMapping("/")
  void hello() {
    LOGGER.error("Event triggered by Logback integration");
    throw new IllegalArgumentException("Event triggered by Spring integration");
  }
}
```

Once you've verified the library is initialized properly and sent a test event, consider visiting our [complete Spring Boot docs](https://docs.sentry.io/platforms/java/guides/spring-boot/).
