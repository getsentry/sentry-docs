---
title: Plugins
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
%}

-   [GitHub](https://github.com/getsentry/sentry-github)
-   [JIRA](https://github.com/getsentry/sentry-jira)
-   [Hipchat](https://github.com/getsentry/sentry-hipchat-ac)
-   [Slack](https://github.com/getsentry/sentry-slack)
-   [GitLab](https://github.com/getsentry/sentry-gitlab)
-   [Phabricator](https://github.com/getsentry/sentry-phabricator)
-   [Pivotal Tracker](https://github.com/getsentry/sentry-pivotal)
-   [Pushover](https://github.com/getsentry/sentry-pushover)
-   [Flowdock](https://github.com/getsentry/sentry-flowdock)
-   [Redmine](https://github.com/getsentry/sentry-redmine)
-   [BitBucket](https://github.com/getsentry/sentry-bitbucket)
-   [Trello](https://github.com/getsentry/sentry-trello)
-   [IRC](https://github.com/getsentry/sentry-irc)

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

Have an extension that should be listed here? Submit a [pull request](https://github.com/getsentry/sentry/edit/master/docs/plugins.rst) and we’ll get it added.
