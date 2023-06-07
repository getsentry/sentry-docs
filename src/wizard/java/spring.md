---
name: Spring
doc_link: https://https://docs.sentry.io/platforms/java/guides/spring/
support_level: production
type: framework
---

<Alert level="info">
    There are two variants of Sentry available for Spring. If you're using Spring 5, use `sentry-spring` ([GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-spring)). If you're using Spring 6, use `sentry-spring-jakarta` instead ([GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-spring-jakarta)).
</Alert>

<Alert level="info">
    Sentry's integration with Spring supports Spring Framework 5.1.2 and above to report unhandled exceptions and optional user information. If you're on an older version, use <a href=https://docs.sentry.io/platforms/java/guides/spring/legacy/>our legacy integration</a>.
</Alert>

## Install

Install Sentry's integration with Spring using either Maven or Gradle:

### Maven:

#### Spring 5

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring</artifactId>
    <version>{{@inject packages.version('sentry.java.spring', '4.0.0') }}</version>
</dependency>
```

#### Spring 6

```xml {tabTitle:Spring 6}{filename:pom.xml}
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-jakarta</artifactId>
    <version>{{@inject packages.version('sentry.java.spring.jakarta', '6.7.0') }}</version>
</dependency>
```

#### Source Context

To upload your source code to Sentry so it can be shown in stack traces, use our Maven plugin.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>io.sentry</groupId>
            <artifactId>sentry-maven-plugin</artifactId>
            <version>{{@inject packages.version('sentry.java.mavenplugin', '0.0.2') }}</version>
            <configuration>
                <!-- for showing output of sentry-cli -->
                <debugSentryCli>true</debugSentryCli>

                <!-- download the latest sentry-cli and provide path to it here -->
                <!-- download it here: https://github.com/getsentry/sentry-cli/releases -->
                <!-- minimum required version is 2.17.3 -->
                <sentryCliExecutablePath>/path/to/sentry-cli</sentryCliExecutablePath>

                <org>___ORG_SLUG___</org>

                <project>___PROJECT_SLUG___</project>

                <!-- in case you're self hosting, provide the URL here -->
                <!--<url>http://localhost:8000/</url>-->

                <!-- provide your auth token via SENTRY_AUTH_TOKEN environment variable -->
                <!-- you can find it in Sentry UI: Settings > Account > API > Auth Tokens -->
                <authToken>${env.SENTRY_AUTH_TOKEN}</authToken>
            </configuration>
            <executions>
                <execution>
                    <phase>install</phase>
                    <goals>
                        <goal>uploadSourceBundle</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
    ...
</build>
```

### Gradle:

#### Spring 5

```groovy
implementation 'io.sentry:sentry-spring:{{@inject packages.version('sentry.java.spring', '4.0.0') }}'
```

#### Spring 6

```groovy
implementation 'io.sentry:sentry-spring-jakarta:{{@inject packages.version('sentry.java.spring.jakarta', '6.7.0') }}'
```

#### Source Context

To upload your source code to Sentry so it can be shown in stack traces, use our Gradle plugin.

```groovy
buildscript {
    repositories {
        mavenCentral()
    }
}

plugins {
    id "io.sentry.jvm.gradle" version "{{@inject packages.version('sentry.java.android.gradle-plugin', '3.9.0') }}"
}

sentry {
    // Generates a JVM (Java, Kotlin, etc.) source bundle and uploads your source code to Sentry.
    // This enables source context, allowing you to see your source
    // code as part of your stack traces in Sentry.
    includeSourceContext = true

    org = "___ORG_SLUG___"
    projectName = "___PROJECT_SLUG___"
    authToken = "your-sentry-auth-token"
}
```

For other dependency managers see the [central Maven repository (Spring 5)](https://search.maven.org/artifact/io.sentry/sentry-spring) and [central Maven repository (Spring 6)](https://search.maven.org/artifact/io.sentry/sentry-spring-jakarta).

## Configure

Configure Sentry as soon as possible in your application's lifecycle:

<Note>

The `sentry-spring` and `sentry-spring-jakarta` libraries provide an `@EnableSentry` annotation that registers all required Spring beans. `@EnableSentry` can be placed on any class annotated with [@Configuration](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html) including the main entry class in Spring Boot applications annotated with [@SpringBootApplication](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/SpringBootApplication.html).

</Note>

### Java

#### Spring 5

```java
import io.sentry.spring.EnableSentry;

@EnableSentry(dsn = "___PUBLIC_DSN___")
@Configuration
class SentryConfiguration {
}
```

#### Spring 6

```java
import io.sentry.spring.jakarta.EnableSentry;

@EnableSentry(dsn = "___PUBLIC_DSN___")
@Configuration
class SentryConfiguration {
}
```

### Kotlin

#### Spring 5

```kotlin
import io.sentry.spring.EnableSentry
import org.springframework.core.Ordered

@EnableSentry(
  dsn = "___PUBLIC_DSN___",
  exceptionResolverOrder = Ordered.LOWEST_PRECEDENCE
)
```

#### Spring 6

```kotlin
import io.sentry.spring.jakarta.EnableSentry
import org.springframework.core.Ordered

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

### Measure Performance

Check out [the documentation](https://docs.sentry.io/platforms/java/guides/spring/performance/) to learn how to configure and use Sentry Performance Monitoring with Spring.
