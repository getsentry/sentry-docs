---
title: Integrations
sidebar_order: 6
---

Sentry integrates seamlessly with your favorite apps and services.

### Global Integrations

These integrations are set up once per organization, and are then usable in all projects.

-   [_Amixr_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#amixr)
-   [_Azure DevOps_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#azure-devops)
-   [_Bitbucket_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#bitbucket)
-   [_ClickUp_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#clickup)
-   [_Clubhouse_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#clubhouse)
-   [_GitHub_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#github)
-   [_GitHub Enterprise_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#github-enterprise)
-   [_GitLab_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#gitlab)
-   [_JIRA_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#jira)
-   [_JIRA Server_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#jira-server)
-   [_Rookout_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#rookout)
-   [_Slack_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#slack)
-   [_Split_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#split)


### Per-Project Integrations

These integrations are set up once per project, and are only usable in projects in which they've been set up. 

{% include components/alert.html
  title="* Community Integrations"
  content="These integrations are [maintained and supported](https://forum.sentry.io) by the Sentry community."
  level="info"
%}

-   [_Amazon SQS_]({%- link _documentation/data-management/data-forwarding.md -%})
-   [_Asana_]({%- link _documentation/workflow/integrations/legacy-integrations.md -%}#asana)
-   Campfire*
-   Flowdock
-   [_GitLab_]({%- link _documentation/workflow/integrations/global-integrations.md -%}#gitlab)
-   [_Heroku_]({%- link _documentation/workflow/integrations/legacy-integrations.md -%}#heroku)
-   [_HipChat_]({%- link _documentation/workflow/integrations/legacy-integrations.md -%}#hipchat)
-   Lighthouse*
-   OpsGenie
-   PagerDuty
-   Phabricator
-   Pivotal Tracker
-   Pushover
-   Redmine
-   [_Splunk_]({%- link _documentation/workflow/integrations/legacy-integrations.md -%}#splunk)
-   Taiga
-   Teamwork
-   Trello*
-   Twilio


### Integration Platform

Sentry’s [Integration Platform]({%- link _documentation/workflow/integrations/integration-platform/index.md -%}) provides a way for external services to interact with the Sentry SaaS service using the REST API and webhooks. Integrations utilizing this platform are first-class actors within Sentry, and you can build them for [public]({%- link _documentation/workflow/integrations/integration-platform/index.md -%}#public-integrations) as well as [internal]({%- link _documentation/workflow/integrations/integration-platform/index.md -%}#internal-integrations) use cases.
