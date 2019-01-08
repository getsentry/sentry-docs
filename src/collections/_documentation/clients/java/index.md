---
title: Java
sidebar_order: 6
sidebar_relocation: platforms
---

Sentry for Java is a collection of modules provided by Sentry. To begin, we **highly recommend** you use one of the library or framework integrations listed under Installation. Otherwise, [manual usage]({%- link _documentation/clients/java/usage.md -%}) is another option. 

{% capture __alert_content -%}
The old `raven` library is no longer maintained. We recommended you [migrate]({%- link _documentation/clients/java/migration.md -%}) to `sentry`. [Check out the migration guide]({%- link _documentation/clients/java/migration.md -%}) for more information. If you are still using `Raven` you can [find the old documentation here](https://github.com/getsentry/sentry-java/blob/raven-java-8.x/docs/modules/raven.rst).
{%-endcapture-%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

## Getting Started
Getting started with Sentry is a three step process:

1.  [Sign up for an account](https://sentry.io/signup/)
2.  [Install your SDK](#install)
2.  [Configure it](#configure)

Once you've configured one of the integrations below, you can _also_ use Sentry's [static API]({%- link _documentation/clients/java/usage.md -%}) in order to do things like record breadcrumbs, set the current user, or manually send events.

-   [Android]({%- link _documentation/clients/java/modules/android.md -%})
-   [Google App Engine]({%- link _documentation/clients/java/modules/appengine.md -%})
-   [java.util.logging]({%- link _documentation/clients/java/modules/jul.md -%})
-   [Log4j 1.x]({%- link _documentation/clients/java/modules/log4j.md -%})
-   [Log4j 2.x]({%- link _documentation/clients/java/modules/log4j2.md -%})
-   [Logback]({%- link _documentation/clients/java/modules/logback.md -%})
-   [Spring]({%- link _documentation/clients/java/modules/spring.md -%})

 
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
