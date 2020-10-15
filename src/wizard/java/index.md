---
name: Java
doc_link: https://docs.sentry.io/platforms/java/
support_level: production
type: language
---

<Alert level="info">
    If you use <strong>Spring Boot</strong>, <strong>Logback</strong> or <strong>Log4j2</strong>, we recommend using a dedicated integration. Please visit <a href="https://docs.sentry.io/platforms/java/">Sentry Java</a> documentation for installation instructions.
</Alert>

## Install

Install the SDK via Maven or Gradle:

```xml {tabTitle:Maven}
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>{{ packages.version('sentry.java', '3.1.0') }}</version>
</dependency>
```

```groovy {tabTitle:Gradle}
implementation 'io.sentry:sentry:{{ packages.version('sentry.java', '3.1.0') }}'
```

## Configure

Initialize Sentry class with an `init` method, configure the DSN and any other [_settings_](/platforms/java/configuration/#options) you need:

```java
import io.sentry.Sentry;

public class MyClass {

  public static void main(String... args) {
    Sentry.init(options -> {
      options.setDsn("___PUBLIC_DSN___");
    });
  }
}
```

### Send First Event

You can trigger your first event from your development environment by raising an exception somewhere within your application and sending it with `Sentry#captureException` method:

```java
try {
  System.out.println(1/0);
} catch (Exception e) {
  Sentry.captureException(e);
}
```

Once you've verified the library is initialized properly and sent a test event, consider visiting our [complete Java docs](https://docs.sentry.io/platforms/java/).
