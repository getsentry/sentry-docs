---
name: Google App Engine
doc_link: https://docs.sentry.io/platforms/java/guides/google-app-engine/
support_level: production
type: framework
---

### Installation

Using Maven:

```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-appengine</artifactId>
    <version>{{ packages.version('sentry.java', '1.7.30') }}</version>
</dependency>
```

Using Gradle:

```groovy
implementation 'io.sentry:sentry-appengine:{{ packages.version('sentry.java', '1.7.30') }}'
```

Using SBT:

```scala
libraryDependencies += "io.sentry" % "sentry-appengine" % "{{ packages.version('sentry.java', '1.7.30') }}"
```

### Usage

This module provides a new `SentryClientFactory` implementation which replaces the default async system with a Google App Engine compatible one. You’ll need to configure Sentry to use the `io.sentry.appengine.AppEngineSentryClientFactory` as its factory.

The queue size and thread options will not be used as they are specific to the default Java threading system.

<!-- TODO-ADD-VERIFICATION-EXAMPLE -->
