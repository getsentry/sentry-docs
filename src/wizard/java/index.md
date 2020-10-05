---
name: Java
doc_link: https://docs.sentry.io/platforms/java/
support_level: production
type: language
---

## Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry</artifactId>
    <version>{{ packages.version('sentry.java', '3.0.0') }}</version>
</dependency>
```

Using Gradle:

```groovy
implementation 'io.sentry:sentry:{{ packages.version('sentry.java', '3.0.0') }}'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry" % "{{ packages.version('sentry.java', '3.0.0') }}"
```

## Capture an Error

To report an event manually you need to initialize a `Sentry` class. It is recommended that you use the static API via the `Sentry` class, but you can also construct and manage your own `IHub` instance. An example of each style is shown below:

```java
import io.sentry.HubAdapter;
import io.sentry.IHub;
import io.sentry.Sentry;
import io.sentry.protocol.User;

public class MyClass {
  private static IHub hub;

  public static void main(String... args) {
    Sentry.init(options -> {
      options.setDsn("___PUBLIC_DSN___");
    });

    /*
     It is possible to go around the static Sentry API, which means
     you are responsible for making the IHub instance available
     to your code.
     */
    hub = HubAdapter.getInstance();

    MyClass myClass = new MyClass();
    myClass.logWithStaticAPI();
    myClass.logWithInstanceAPI();
  }

  /**
   * An example method that throws an exception.
   */
  void unsafeMethod() {
    throw new UnsupportedOperationException("You shouldn't call this!");
  }

  /**
   * Examples using the (recommended) static API.
   */
  void logWithStaticAPI() {
    // Note that all fields set on the scope are optional. Scope data is copied onto
    // all future events in the current scope (until the scope is cleared).

    // Record a breadcrumb in the current scope. By default the last 100 breadcrumbs are kept.
    Sentry.addBreadcrumb("User made an action");

    // Set the user in the current scope.
    Sentry.configureScope(scope -> {
      User user = new User();
      user.setEmail("hello@sentry.io");
      scope.setUser(user);
    });

    // Add extra data to future events in this scope.
    Sentry.configureScope(scope -> {
      scope.setExtra("extra", "thing");
    });

    // Add an additional tag to future events in this scope.
    Sentry.configureScope(scope -> {
      scope.setTag("tagName", "tagValue");
    });

    /*
     This sends a simple event to Sentry using the statically stored instance
     that was created in the ``main`` method.
     */
    Sentry.captureMessage("This is a test");

    try {
      unsafeMethod();
    } catch (Exception e) {
      // This sends an exception event to Sentry using the statically stored instance
      // that was created in the ``main`` method.
      Sentry.captureException(e);
    }
  }

  /**
   * Examples that use the SentryClient instance directly.
   */
  void logWithInstanceAPI() {

    // Record a breadcrumb in the current scope. By default the last 100 breadcrumbs are kept.
    hub.addBreadcrumb("User made an action");

    // Set the user in the current scope.
    hub.configureScope(scope -> {
      User user = new User();
      user.setEmail("hello@sentry.io");
      scope.setUser(user);
    });

    // This sends a simple event to Sentry.
    hub.captureMessage("This is a test");

    try {
      unsafeMethod();
    } catch (Exception e) {
      // This sends an exception event to Sentry.
      hub.captureException(e);
    }
  }
}
```

See the [provided examples in the `Java` SDK repository](https://github.com/getsentry/sentry-java/tree/main/sentry-samples) for examples to send your first event to Sentry.
