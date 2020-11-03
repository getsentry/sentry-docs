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

```groovy {filename:build.gradle}
// Make sure jcenter or mavenCentral is there.
repositories {
    jcenter()
    // Or
    mavenCentral()
}

// Add Sentry's SDK as a dependency.
dependencies {
    implementation 'io.sentry:sentry:3.1.0'
}
```

```xml {tabTitle:Maven}{filename:pom.xml}
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>3.1.0</version>
</dependency>
```

```scala {tabTitle:SBT}
libraryDependencies += "io.sentry" % "sentry" % "3.1.0"
```

## Configure

Configure Sentry as soon as possible in your application's lifecycle:

```java
import io.sentry.Sentry;

Sentry.init(options -> {
  options.setDsn("___PUBLIC_DSN___");
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

To view and resolve the error, log in to <a href="https://sentry.io/">sentry.io</a> then open your project. Click the error's title to open a page with detailed information and mark it as resolved.
