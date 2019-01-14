---
title: Per-Project Integrations
sidebar_order: 1
---

These integrations are set up once per project, and are only usable in projects in which they've been set up.

{% include components/alert.html
  title="* Community Integrations"
  content="These integrations are [maintained and supported](https://forum.sentry.io) by the Sentry community."
  level="info"
%}

#### Issue Management

Issue tracking allows you to create issues from within Sentry, and link Sentry issues to existing supported integration Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link issues. 

-   [_Asana_]({%- link _documentation/workflow/integrations/legacy-integrations/asana.md -%})
-   Lighthouse*
-   Phabricator
-   Pivotal Tracker
-   Redmine
-   Taiga
-   Teamwork
-   Trello*

#### Issue Notifications

Alert notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. You will need to configure a project’s [**Alert Rules**](%- link -%) to properly route notifications to a specific integration.

-   Campfire*
-   Flowdock
-   [_HipChat_]({%- link _documentation/workflow/integrations/legacy-integrations/hipchat.md -%})
-   OpsGenie
-   PagerDuty
-   Pushover
-   Twilio

#### Additional Integrations

-   [_Amazon SQS_]({%- link _documentation/data-management/data-forwarding.md -%})
-   [_Heroku_]({%- link _documentation/workflow/integrations/legacy-integrations/heroku.md -%})
-   [_Splunk_]({%- link _documentation/workflow/integrations/legacy-integrations/splunk.md -%})