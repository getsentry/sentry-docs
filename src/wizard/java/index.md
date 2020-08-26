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
    <version>{{ packages.version('sentry.java', '1.7.30') }}</version>
</dependency>
```

Using Gradle:

```groovy
implementation 'io.sentry:sentry:{{ packages.version('sentry.java', '1.7.30') }}'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry" % "{{ packages.version('sentry.java', '1.7.30') }}"
```

## Capture an Error

To report an event manually you need to initialize a `SentryClient`. It is recommended that you use the static API via the `Sentry` class, but you can also construct and manage your own `SentryClient` instance. An example of each style is shown below:

```java
import io.sentry.context.Context;
import io.sentry.event.BreadcrumbBuilder;
import io.sentry.event.UserBuilder;

public class MyClass {
    private static SentryClient sentry;

    public static void main(String... args) {
        /*
         It is recommended that you use the DSN detection system, which
         will check the environment variable "SENTRY_DSN", the Java
         System Property "sentry.dsn", or the "sentry.properties" file
         in your classpath. This makes it easier to provide and adjust
         your DSN without needing to change your code. See the configuration
         page for more information.

         For example, using an environment variable

         export SENTRY_DSN="___PUBLIC_DSN___"
         */
        Sentry.init();

        // You can also manually provide the DSN to the ``init`` method.
        // Sentry.init("___PUBLIC_DSN___");

        /*
         It is possible to go around the static ``Sentry`` API, which means
         you are responsible for making the SentryClient instance available
         to your code.
         */
        sentry = SentryClientFactory.sentryClient();

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
        // Note that all fields set on the context are optional. Context data is copied onto
        // all future events in the current context (until the context is cleared).

        // Record a breadcrumb in the current context. By default the last 100 breadcrumbs are kept.
        Sentry.getContext().recordBreadcrumb(
            new BreadcrumbBuilder().setMessage("User made an action").build()
        );

        // Set the user in the current context.
        Sentry.getContext().setUser(
            new UserBuilder().setEmail("hello@sentry.io").build()
        );

        // Add extra data to future events in this context.
        Sentry.getContext().addExtra("extra", "thing");

        // Add an additional tag to future events in this context.
        Sentry.getContext().addTag("tagName", "tagValue");

        /*
         This sends a simple event to Sentry using the statically stored instance
         that was created in the ``main`` method.
         */
        Sentry.capture("This is a test");

        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry using the statically stored instance
            // that was created in the ``main`` method.
            Sentry.capture(e);
        }
    }

    /**
      * Examples that use the SentryClient instance directly.
      */
    void logWithInstanceAPI() {
        // Retrieve the current context.
        Context context = sentry.getContext();

        // Record a breadcrumb in the current context. By default the last 100 breadcrumbs are kept.
        context.recordBreadcrumb(new BreadcrumbBuilder().setMessage("User made an action").build());

        // Set the user in the current context.
        context.setUser(new UserBuilder().setEmail("hello@sentry.io").build());

        // This sends a simple event to Sentry.
        sentry.sendMessage("This is a test");

        try {
            unsafeMethod();
        } catch (Exception e) {
            // This sends an exception event to Sentry.
            sentry.sendException(e);
        }
    }
}
```
