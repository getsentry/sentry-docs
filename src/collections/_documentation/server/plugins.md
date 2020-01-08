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
-   Heroku
-   Pagerduty
-   Phabricator
-   Pivotal
-   Pushover
-   Redmine
-   Segment
-   Sessionstack
-   Splunk
-   Trello
-   Victorops

Most of the official plugins can be found in the [official sentry plugins repository](https://github.com/getsentry/sentry-plugins).

## Deprecated plugins

The following plugins are deprecated and have been replaced with Sentry's built in [Global Integrations]({%- link _documentation/workflow/integrations/index.md -%}).

* Bitbucket
* Clubhouse
* GitHub
* GitLab
* Jira
* Slack
* Visual Studio Team Services

## 3rd Party Plugins {#rd-party-plugins}

The following plugins are available and were created by members of the Sentry community. Please note that many of these plugins have not been maintained and may not work with the latest versions of Sentry.

-   [sentry-campfire](https://github.com/mkhattab/sentry-campfire)
-   [sentry-flowdock](https://github.com/glasslion/sentry-flowdock)
-   [sentry-fogbugz](https://github.com/glasslion/sentry-fogbugz)
-   [sentry-groveio](https://github.com/mattrobenolt/sentry-groveio)
-   [sentry-irc](https://github.com/getsentry/sentry-irc)
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

## Setup

Many of these plugins require configuration to work. The instructions on how to configure your environment for these plugins are below.

### Asana

You'll have to create an application in Asana to get a client ID and secret. Use the following for the redirect URL:

    <URL_TO_SENTRY>/account/settings/social/associate/complete/asana/

Ensure you've configured Asana auth in Sentry:

    ASANA_CLIENT_ID = 'Asana Client ID'
    ASANA_CLIENT_SECRET = 'Asana Client Secret'
