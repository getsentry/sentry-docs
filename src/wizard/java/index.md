---
name: Java
doc_link: https://docs.sentry.io/platforms/java/
support_level: production
type: language
---

<Alert level="info">
    Sentry for Java is a collection of modules provided by Sentry; it supports Java 1.8 and above. At its core, Sentry for Java provides a raw client for sending events to Sentry. If you use <strong>Spring Boot</strong>, <strong>Spring</strong>,<strong> Logback</strong>, or <strong>Log4j2</strong>, we recommend visiting our <a href="https://docs.sentry.io/platforms/java/">Sentry Java</a> documentation for installation instructions.
</Alert>

## Install

Install the SDK via Gradle, Maven, or SBT:

For **Gradle**, add to your `build.gradle` file:

```groovy
// Make sure mavenCentral is there.
repositories {
    mavenCentral()
}

// Add Sentry's SDK as a dependency.
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

For **SBT**:

```scala
libraryDependencies += "io.sentry" % "sentry" % "{{@inject packages.version('sentry.java', '4.0.0') }}"
```

## Configure

Configure Sentry as soon as possible in your application's lifecycle:

```java
import io.sentry.Sentry;

Sentry.init(options -> {
  options.setDsn("___PUBLIC_DSN___");
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  options.setTracesSampleRate(1.0);
  // When first trying Sentry it's good to see what the SDK is doing:
  options.setDebug(true);
});
```

### Send First Event

Trigger your first event from your development environment by intentionally creating an error with the `Sentry#captureException` method, to test that everything is working:

```java
import java.lang.Exception;
import io.sentry.Sentry;

try {
  throw new Exception("This is a test.");
} catch (Exception e) {
  Sentry.captureException(e);
}
```

If you're new to Sentry, use the email alert to access your account and complete a product tour.

If you're an existing user and have disabled alerts, you won't receive this email.

### Measure performance

You can capture transactions using the SDK. For example:

```java
import io.sentry.ITransaction;
import io.sentry.Sentry;
import io.sentry.SpanStatus;

// A good name for the transaction is key, to help identify what this is about
ITransaction transaction = Sentry.startTransaction("processOrderBatch()", "task");
try {
  processOrderBatch();
} catch (Exception e) {
  transaction.setThrowable(e);
  transaction.setStatus(SpanStatus.INTERNAL_ERROR);
  throw e;
} finally {
  transaction.finish();
}
```

For more information about the API and automatic instrumentations included in the SDK, [visit the docs](https://docs.sentry.io/platforms/java/performance/).
