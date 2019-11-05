---
title: Plugins
sidebar_order: 18
---

There are several interfaces currently available to extend Sentry. These are a work in progress and the API is not frozen.

## Bundled Plugins

Sentry includes several plugins by default. Builtin plugins are controlled via the `INSTALLED_APPS` Django setting:

```python
INSTALLED_APPS = [
  ...
  'sentry.plugins.sentry_mail',
  'sentry.plugins.sentry_urls',
  'sentry.plugins.sentry_useragents',
]
```

`sentry.plugins.sentry_urls`

: Enables auto tagging of urls based on the Http interface contents.

`sentry.plugins.sentry_mail`

: Enables email notifications when new events or regressions happen.

`sentry.plugins.sentry_useragents`

: Enables auto tagging of browsers and operating systems based on the `User-Agent` header in the HTTP interface.

  {% version_added 4.5.0. %}

## Official Plugins

The following plugins are fully supported and maintained by the Sentry team.

{% capture __alert_content -%}
All official plugins are tested against the latest version of Sentry, and compatibility with older versions is not guaranteed.
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="warning"
%}

-   Amazon SQS
-   Asana
-   Clubhouse
-   Heroku
-   Pagerduty
-   Phabricator
-   Pivotal
-   Pushover
-   Segment
-   Sessionstack
-   Splunk
-   Victorops
-   [Flowdock](https://github.com/getsentry/sentry-flowdock)
-   [IRC](https://github.com/getsentry/sentry-irc)
-   [Redmine](https://github.com/getsentry/sentry-redmine)
-   [Trello](https://github.com/getsentry/sentry-trello)

Most of the official plugins can be found in the [official sentry plugins repository](https://github.com/getsentry/sentry-plugins).

## Deprecated plugins

The following plugins are deprecated and have been replaced with Sentry's built in [Global Integrations]({%- link _documentation/workflow/integrations/index.md -%}).

* Slack
* GitHub
* GitLab
* Bitbucket
* Visual Studio Team Services
* Jira

## 3rd Party Plugins {#rd-party-plugins}

The following plugins are available and maintained by members of the Sentry community:

-   [sentry-campfire](https://github.com/mkhattab/sentry-campfire)
-   [sentry-fogbugz](https://github.com/glasslion/sentry-fogbugz)
-   [sentry-groveio](https://github.com/mattrobenolt/sentry-groveio)
-   [sentry-irccat](https://github.com/russss/sentry-irccat)
-   [sentry-lighthouse](https://github.com/gthb/sentry-lighthouse)
-   [sentry-msteams](https://github.com/Neko-Design/sentry-msteams)
-   [sentry-notifico](https://github.com/lukegb/sentry-notifico)
-   [sentry-searchbutton](https://github.com/timmyomahony/sentry-searchbutton)
-   [sentry-sprintly](https://github.com/mattrobenolt/sentry-sprintly)
-   [sentry-statsd](https://github.com/dreadatour/sentry-statsd)
-   [sentry-teamwork](https://github.com/getsentry/sentry-teamwork)
-   [sentry-telegram](https://github.com/butorov/sentry-telegram)
-   [sentry-top](https://github.com/getsentry/sentry-top)
-   [sentry-unfuddle](https://github.com/rkeilty/sentry-unfuddle)
-   [sentry-vsts](https://github.com/boylec/sentry-vsts)
-   [sentry-ldap-auth](https://github.com/Banno/getsentry-ldap-auth)
-   [sentry-whatsapp](https://github.com/ecarreras/sentry-whatsapp)
-   [sentry-xmpp](https://github.com/chroto/sentry-xmpp)
-   [sentry-youtrack](https://github.com/bogdal/sentry-youtrack)
-   [sentry-zabbix](https://github.com/m0n5t3r/sentry-zabbix)
-   [sentry-zendesk](https://github.com/ESSS/sentry-zendesk)
