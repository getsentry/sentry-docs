---
title: Integrations
sidebar_order: 6
---

Sentry integrates seamlessly with your favorite apps and services.

### Global Integrations

These integrations are set up once per organization, and are then usable in all projects.

-   [_Azure DevOps_](/workflow/integrations/global-integrations/#azure-devops)
-   [_Bitbucket_](/workflow/integrations/global-integrations/#bitbucket)
-   [_Bitbucket Server_](/workflow/integrations/global-integrations/#bitbucket-server)
-   [_GitHub_](/workflow/integrations/global-integrations/#github)
-   [_GitHub Enterprise_](/workflow/integrations/global-integrations/#github-enterprise)
-   [_GitLab_](/workflow/integrations/global-integrations/#gitlab)
-   [_JIRA_](/workflow/integrations/global-integrations/#jira)
-   [_JIRA Server_](/workflow/integrations/global-integrations/#jira-server)
-   [_PagerDuty_](/workflow/integrations/global-integrations/#pagerduty)
-   [_Slack_](/workflow/integrations/global-integrations/#slack)

These integrations are maintained and supported by the companies that created them. See [integration platform](/workflow/integrations/integration-platform/).

-   [_Amixr_](/workflow/integrations/global-integrations/#amixr)
-   [_ClickUp_](/workflow/integrations/global-integrations/#clickup)
-   [_Clubhouse_](/workflow/integrations/global-integrations/#clubhouse)
-   [_Rookout_](/workflow/integrations/global-integrations/#rookout)
-   [_Split_](/workflow/integrations/global-integrations/#split)

### Per-Project Integrations

These integrations are set up once per project, and are only usable in projects in which they've been set up. 

{% include components/alert.html
  title="* Community Integrations"
  content="These integrations are [maintained and supported](https://forum.sentry.io) by the Sentry community."
  level="info"
%}

-   [_Amazon SQS_](/data-management/data-forwarding/)
-   [_Asana_](/workflow/integrations/legacy-integrations/#asana)
-   Campfire*
-   Flowdock
-   [_GitLab_](/workflow/integrations/global-integrations/#gitlab)
-   [_Heroku_](/workflow/integrations/legacy-integrations/#heroku)
-   [_HipChat_](/workflow/integrations/legacy-integrations/#hipchat)
-   Lighthouse*
-   OpsGenie
-   PagerDuty
-   Phabricator
-   Pivotal Tracker
-   Pushover
-   Redmine
-   [_Splunk_](/workflow/integrations/legacy-integrations/#splunk)
-   Taiga
-   Teamwork
-   Trello*
-   Twilio


### Integration Platform

Sentry’s [Integration Platform](/workflow/integrations/integration-platform/) provides a way for external services to interact with the Sentry SaaS service using the REST API and webhooks. Integrations utilizing this platform are first-class actors within Sentry, and you can build them for [public](/workflow/integrations/integration-platform/#public-integrations) as well as [internal](/workflow/integrations/integration-platform/#internal-integrations) use cases.
