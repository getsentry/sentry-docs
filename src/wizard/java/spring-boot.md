---
name: Spring Boot
doc_link: https://docs.sentry.io/platforms/java/guides/spring-boot/
support_level: production
type: framework
---

<Alert level="info">
Sentry's integration with <a href=https://spring.io/projects/spring-boot>Spring Boot</a> supports Spring Boot 2.1.0 and above to report unhandled exceptions as well as release and registration of beans. If you're on an older version, use <a href=https://docs.sentry.io/platforms/java/legacy/spring>our legacy integration</a>.
</Alert>

Install using either Maven or Gradle:

### Maven

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>{{ packages.version('sentry.java.spring-boot', '4.0.0') }}</version>
</dependency>
```

### Gradle

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry-spring-boot-starter:{{ packages.version('sentry.java.spring-boot', '4.0.0') }}'
```

Open up `src/main/application.properties` (or `src/main/application.yml`) and configure the DSN, and any other [_settings_](/platforms/java/configuration/#options) you need:

Modify `src/main/application.properties`:

```
sentry.dsn=___PUBLIC_DSN___
```

Or, modify `src/main/application.yml`:

```yaml
sentry:
  dsn: ___PUBLIC_DSN___
```

If you use Logback for logging you may also want to send error logs to Sentry. Add a dependency to the `sentry-logback` module using either Maven or Gradle. Sentry Spring Boot Starter will auto-configure `SentryAppender`.

### Maven

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>{{ packages.version('sentry.java.logback', '4.0.0') }}</version>
</dependency>
```

### Gradle

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry-logback:{{ packages.version('sentry.java.logback', '4.0.0') }}'
```

Then create an intentional error, so you can test that everything is working using either Java or Kotlin:

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
