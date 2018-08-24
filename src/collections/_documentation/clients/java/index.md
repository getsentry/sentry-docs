---
title: Java
sidebar_order: 6
---

Sentry for Java is the official Java SDK for Sentry. At its core it provides a raw client for sending events to Sentry, but it is highly recommended that you use one of the included library or framework integrations listed below if at all possible.

**Note:** The old `raven` library is no longer maintained. It is highly recommended that you [migrate]({%- link _documentation/clients/java/migration.md -%}) to `sentry` (which this documentation covers). [Check out the migration guide]({%- link _documentation/clients/java/migration.md -%}) for more information. If you are still using `raven` you can [find the old documentation here](https://github.com/getsentry/sentry-java/blob/raven-java-8.x/docs/modules/raven.rst).

-   [Configuration]({%- link _documentation/clients/java/config.md -%})
-   [Context & Breadcrumbs]({%- link _documentation/clients/java/context.md -%})
-   [Manual Usage]({%- link _documentation/clients/java/usage.md -%})
-   [Agent (Beta)]({%- link _documentation/clients/java/agent.md -%})
-   [Migration from Raven Java]({%- link _documentation/clients/java/migration.md -%})
-   [Integrations]({%- link _documentation/clients/java/modules/index.md -%})
    -   [Android]({%- link _documentation/clients/java/modules/android.md -%})
    -   [Google App Engine]({%- link _documentation/clients/java/modules/appengine.md -%})
    -   [java.util.logging]({%- link _documentation/clients/java/modules/jul.md -%})
    -   [Log4j 1.x]({%- link _documentation/clients/java/modules/log4j.md -%})
    -   [Log4j 2.x]({%- link _documentation/clients/java/modules/log4j2.md -%})
    -   [Logback]({%- link _documentation/clients/java/modules/logback.md -%})
    -   [Spring]({%- link _documentation/clients/java/modules/spring.md -%})

Resources:

-   [Documentation]({%- link _documentation/clients/java/index.md -%})
-   [Examples](https://github.com/getsentry/examples)
-   [Bug Tracker](http://github.com/getsentry/sentry-java/issues)
-   [Code](http://github.com/getsentry/sentry-java)
-   [Mailing List](https://groups.google.com/group/getsentry)
-   [IRC](irc://irc.freenode.net/sentry) (irc.freenode.net, #sentry)
-   [Travis CI](http://travis-ci.org/getsentry/sentry-java)
