---
name: Spring
doc_link: https://https://docs.sentry.io/platforms/java/guides/spring/
support_level: production
type: framework
---

<Alert level="info">
    Sentry's integration with Spring supports Spring Framework 5.1.2 and above to report unhandled exceptions and optional user information. If you're on an older version, use <a href=https://docs.sentry.io/platforms/java/guides/spring/legacy/>our legacy integration</a>.
</Alert>

Install Sentry's integration with Spring using either Maven or Gradle:

### Maven:

```
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring</artifactId>
    <version>{{ packages.version('sentry.java', '3.2.0') }}</version>
</dependency>
```

### Gradle:

```
implementation 'io.sentry:sentry-spring:{{ packages.version('sentry.java', '3.2.0') }}'
```

For other dependency managers see the [central Maven repository](https://search.maven.org/artifact/io.sentry/sentry-spring).

Configure Sentry as soon as possible in your application's lifecycle:

<Note>

The `sentry-spring` library provides `@EnableSentry` annotation that registers all required Spring beans. `@EnableSentry` can be placed on any class annotated with [@Configuration](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html) including the main entry class in Spring Boot applications annotated with [@SpringBootApplication](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/SpringBootApplication.html).

</Note>

### Java

```
import io.sentry.spring.EnableSentry;
// NOTE: Replace the test DSN below with YOUR OWN DSN to see the events from this app in your Sentry
// project/dashboard
@EnableSentry(dsn = "___PUBLIC_DSN___")
@Configuration
class SentryConfiguration {
}
```

### Kotlin

```
import io.sentry.spring.EnableSentry
import org.springframework.core.Ordered
// NOTE: Replace the test DSN below with YOUR OWN DSN to see the events from this app in your Sentry
// project/dashboard
@EnableSentry(
  dsn = "___PUBLIC_DSN___",
  exceptionResolverOrder = Ordered.LOWEST_PRECEDENCE
)
```

Last, create an intentional error, so you can test that everything is working:

### Java

```java {tabTitle: Java}
import java.lang.Exception;
import io.sentry.Sentry;

try {
    throw new Exception("This is a test.");
} catch (Exception e) {
    Sentry.captureException(e);
}
```

### Kotlin

```
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
