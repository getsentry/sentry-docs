---
name: Kotlin
doc_link: https://docs.sentry.io/platforms/kotlin/
support_level: production
type: language
---

<Alert level="info">
Sentry supports Kotlin for both JVM and Android. This wizard guides you through set up in the JVM scenario.

If you're interested in <strong>Android</strong>, head over to the <a href="https://docs.sentry.io/platforms/android/">Getting Started</a> for that SDK instead. At its core, Sentry for Java provides a raw client for sending events to Sentry. If you use <strong>Spring Boot</strong>, <strong>Spring</strong>, <strong>Logback</strong>, <strong>JUL</strong>, or <strong>Log4j2</strong>, head over to our <a href="https://docs.sentry.io/platforms/java/">Getting Started for Sentry Java</a>.
</Alert>

## Install

Install the SDK via Gradle or Maven:

For **Gradle**, add to your `build.gradle` file:

```groovy
// Make sure mavenCentral is there.
repositories {
    mavenCentral()
}

dependencies {
    implementation 'io.sentry:sentry:{{@inject packages.version('sentry.java', '4.0.0') }}'
}
```

For **Maven**, add to your `pom.xml` file:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>{{@inject packages.version('sentry.java', '4.0.0') }}</version>
</dependency>
```

## Configure

Configure Sentry as soon as possible in your application's lifecycle:

```kotlin
import io.sentry.Sentry

Sentry.init { options ->
  options.dsn = "___PUBLIC_DSN___"
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  options.tracesSampleRate = 1.0
  // When first trying Sentry it's good to see what the SDK is doing:
  options.isDebug = true
}
```

### Send First Event

Trigger your first event from your development environment by intentionally creating an error with the `Sentry#captureException` method, to test that everything is working:

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

You can capture transactions using the SDK. For example:

```kotlin
import io.sentry.Sentry
import io.sentry.SpanStatus

// A good name for the transaction is key, to help identify what this is about
val transaction = Sentry.startTransaction("processOrderBatch()", "task")
try {
  processOrderBatch()
} catch (e: Exception) {
  transaction.throwable = e
  transaction.status = SpanStatus.INTERNAL_ERROR
  throw e
} finally {
  transaction.finish();
}
```

For more information about the API and automatic instrumentations included in the SDK, [visit the docs](https://docs.sentry.io/platforms/java/performance/).
