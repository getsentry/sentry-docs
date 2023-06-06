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

### Gradle

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

To upload your source code to Sentry and show it in stacktraces, use our Gradle plugin.

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
    // Generates a source bundle and uploads your source code to Sentry.
    // This enables source context, allowing you to see your source
    // code as part of your stack traces in Sentry.
    includeSourceContext = true

    org = "___ORG_SLUG___"
    projectName = "___PROJECT_SLUG___"
    authToken = "your-sentry-auth-token"
}
```

### Maven

For **Maven**, add to your `pom.xml` file:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>{{@inject packages.version('sentry.java', '4.0.0') }}</version>
</dependency>
```

To upload your source code to Sentry and show it in stacktraces, use our Maven plugin.

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

### SBT

For **SBT**:

```scala
libraryDependencies += "io.sentry" % "sentry" % "{{@inject packages.version('sentry.java', '4.0.0') }}"
```

To upload your source code to Sentry and show it in stacktraces, please refer to [Manually Uploading Source Context](https://docs.sentry.io/platforms/java/source-context).

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
