---
title: Per-Project Integrations
sidebar_order: 1
---

These integrations are set up once per project, and are only usable in projects in which they've been set up.

{% include components/alert.html
  title="Community Integrations"
  content="These integrations are [maintained and supported](https://forum.sentry.io) by the Sentry community. Documentation is available for a few community created integrations such as Asana, Heroku, Hipchat, and Splunk. Other community created integrations are available for installation in Sentry and will receive documentation in due time."
  level="info"
%}

## Issue Management

Issue tracking allows you to create issues from within Sentry, and link Sentry issues to existing supported integration Issues.

Once you’ve navigated to a specific issue, you’ll find the **Linked Issues** section on the right hand panel. Here, you’ll be able to create or link issues. 

### Asana

#### Asana Issue Creation from Sentry

Create or link issues in Asana based on Sentry events.

1. Go to the project settings page in Sentry that you’d like to link with Asana
2. Click All Integrations, find the Asana integration in the list, and click configure
3. Click Enable Plugin
4. Link your Asana account and select an organization or workspace
5. The option to create or link Asana issues will be displayed from your Sentry issue pagess

### More Integrations

-   Lighthouse*
-   Phabricator
-   Pivotal Tracker
-   Redmine
-   Taiga
-   Teamwork
-   Trello*

## Issue Notifications

Alert notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. You will need to configure a project’s [**Alert Rules**]({%- link _documentation/workflow/notifications/alerts.md -%}) to properly route notifications to a specific integration.

### Hipchat

Get HipChat notifications for Sentry issues.

1. Go to the project settings page in Sentry that you’d like to link with HipChat
2. Click All Integrations, find the HipChat integration in the list, and click configure
3. Click Enable Plugin
4. Click the Enable Integration link OR add the integration through the HipChat Marketplace
5. Log in to HipChat and specify which HipChat room you would like to send Sentry issues to
6. Follow the Sentry configuration flow and select the organizations and projects you would like notifications for
7. Sentry issues will appear in your HipChat room as they occur depending on the alert rules you have specified in your project settings

### More Integrations

-   Campfire*
-   Flowdock
-   OpsGenie
-   PagerDuty
-   Pushover
-   Twilio

## Additional Integrations

-   [_Amazon SQS_]({%- link _documentation/data-management/data-forwarding.md -%})
-   [_Heroku_]({%- link _documentation/workflow/integrations/legacy-integrations/heroku.md -%})
-   [_Splunk_]({%- link _documentation/workflow/integrations/legacy-integrations/splunk.md -%})

### Amazon SQS

This is commonly useful in places where you may want to do deeper analysis on exceptions, or empower other teams, such as a Business Intelligence function.

Configuring Data Forwarding is done by visiting **[Project] » Settings » Data Forwarding** and filling in the required information for the given integration.

Integration with Amazon SQS makes it quick and easy to pipe exceptions back into your own systems.

The payload for Amazon is identical is our standard API event payload, and will evolve over time. For more details on the format of this data, see our [API documentation]({%- link _documentation/api/events/get-project-event-details.md -%}).

### Heroku

### Splunk