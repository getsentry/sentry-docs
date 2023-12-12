---
name: Spring Boot
doc_link: https://docs.sentry.io/platforms/java/guides/spring-boot/
support_level: production
type: framework
---

<!-- * * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * *
*                          UPDATES WILL NO LONGER BE REFLECTED IN SENTRY                            *
*                                                                                                   *
* We've successfully migrated all "getting started/wizard" documents to the main Sentry repository, *
* where you can find them in the folder named "gettingStartedDocs" ->                               *
* https://github.com/getsentry/sentry/tree/master/static/app/gettingStartedDocs.                    *
*                                                                                                   *
* Find more details about the project in the concluded Epic ->                                      *
* https://github.com/getsentry/sentry/issues/48144                                                  *
*                                                                                                   *
* This document is planned to be removed in the future. However, it has not been removed yet,       *
* primarily because self-hosted users depend on it to access instructions for setting up their      *
* platform. We need to come up with a solution before removing these docs.                          *
* * * * * * * * * * * *  * * * * * * * ATTENTION * * * * * * * * * * * * * * * * * * * * * * * * * -->

<Alert level="info">
There are two variants of Sentry available for Spring Boot. If you're using Spring Boot 2, use `sentry-spring-boot-starter` ([GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-spring-boot-starter)). If you're using Spring Boot 3, use `sentry-spring-boot-starter-jakarta` instead ([GitHub](https://github.com/getsentry/sentry-java/tree/master/sentry-spring-boot-starter-jakarta)).
</Alert>

<Alert level="info">
Sentry's integration with <a href=https://spring.io/projects/spring-boot>Spring Boot</a> supports Spring Boot 2.1.0 and above to report unhandled exceptions as well as release and registration of beans. If you're on an older version, use <a href=https://docs.sentry.io/platforms/java/legacy/spring>our legacy integration</a>.
</Alert>

## Install

Install using either Maven or Gradle:

### Maven

#### Spring Boot 2

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>{{@inject packages.version('sentry.java.spring-boot', '4.0.0') }}</version>
</dependency>
```

#### Spring Boot 3

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter-jakarta</artifactId>
    <version>{{@inject packages.version('sentry.java.spring-boot.jakarta', '6.7.0') }}</version>
</dependency>
```

### Gradle

#### Spring Boot 2

```groovy
implementation 'io.sentry:sentry-spring-boot-starter:{{@inject packages.version('sentry.java.spring-boot', '4.0.0') }}'
```

#### Spring Boot 3

```groovy
implementation 'io.sentry:sentry-spring-boot-starter-jakarta:{{@inject packages.version('sentry.java.spring-boot.jakarta', '6.7.0') }}'
```

## Configure

Open up `src/main/application.properties` (or `src/main/application.yml`) and configure the DSN, and any other [_settings_](/platforms/java/configuration/#options) you need:

Modify `src/main/application.properties`:

```properties
sentry.dsn=___PUBLIC_DSN___
# Set traces-sample-rate to 1.0 to capture 100% of transactions for performance monitoring.
# We recommend adjusting this value in production.
sentry.traces-sample-rate=1.0
```

Or, modify `src/main/application.yml`:

```yaml
sentry:
  dsn: ___PUBLIC_DSN___
  # Set traces-sample-rate to 1.0 to capture 100% of transactions for performance monitoring.
  # We recommend adjusting this value in production.
  traces-sample-rate: 1.0
```

If you use Logback for logging you may also want to send error logs to Sentry. Add a dependency to the `sentry-logback` module using either Maven or Gradle. Sentry Spring Boot Starter will auto-configure `SentryAppender`.

### Maven

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-logback</artifactId>
    <version>{{@inject packages.version('sentry.java.logback', '4.0.0') }}</version>
</dependency>
```

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
                    <phase>generate-resources</phase>
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

### Gradle

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry-logback:{{@inject packages.version('sentry.java.logback', '4.0.0') }}'
```

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

### Send First Event

Then create an intentional error, so you can test that everything is working using either Java or Kotlin:

#### Java

```java
import java.lang.Exception;
import io.sentry.Sentry;

try {
  throw new Exception("This is a test.");
} catch (Exception e) {
  Sentry.captureException(e);
}
```

#### Kotlin

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

Each incoming Spring MVC HTTP request is automatically turned into a transaction. To create spans around bean method executions, annotate bean method with `@SentrySpan` annotation:

#### Java

##### Spring Boot 2

```java
import org.springframework.stereotype.Component;
import io.sentry.spring.tracing.SentrySpan;

@Component
class PersonService {

  @SentrySpan
  Person findById(Long id) {
    ...
  }
}
```

##### Spring Boot 3

```java
import org.springframework.stereotype.Component;
import io.sentry.spring.jakarta.tracing.SentrySpan;

@Component
class PersonService {

  @SentrySpan
  Person findById(Long id) {
    ...
  }
}
```

#### Kotlin

##### Spring Boot 2

```kotlin
import org.springframework.stereotype.Component
import io.sentry.spring.tracing.SentrySpan

@Component
class PersonService {

  @SentrySpan(operation = "task")
  fun findById(id: Long): Person {
    ...
  }
}
```

##### Spring Boot 3

```kotlin
import org.springframework.stereotype.Component
import io.sentry.spring.jakarta.tracing.SentrySpan

@Component
class PersonService {

  @SentrySpan(operation = "task")
  fun findById(id: Long): Person {
    ...
  }
}
```

Check out [the documentation](https://docs.sentry.io/platforms/java/guides/spring-boot/performance/instrumentation/) to learn more about the API and integrated instrumentations.
