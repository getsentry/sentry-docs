---
title: Notifications
sidebar_order: 2
---

Notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. Notifications fall into two categories: Alerts and Workflow.

## Alerts

Each time you create a new project, Sentry creates a default alert rule. Alerts are generated based upon a project’s alert rules. You can customize alerts to the needs of an individual or team.

Alerts have a set of configuration and subscription options. By default, Sentry subscribes you to everything, but you can change this via account settings. You can also configure various personal notifications from your [personal notifications settings](https://sentry.io/settings/account/notifications) and any specific project's settings in the Project Settings page. For more details, see the [full documentation on Alerts]({%- link _documentation/workflow/notifications/alerts.md -%}).

## Workflow

Workflow relates to all activity involving user actions such as resolution, comments, and automatic regressions.

Workflow has a set of configuration and subscription options. By default, Sentry subscribes you to everything, but you can change this via your account settings. You can also configure various notifications from the [workflow notifications settings](https://sentry.io/settings/account/notifications/workflow/) and any specific project's settings in the Project Settings page. For more details, see the [full documentation on Workflow]({%- link _documentation/workflow/notifications/workflow.md -%}).

## Issue States

Sentry provides a few states for each issue, which significantly impacts how notifications work. Workflow notifications are _all_ sent via email.

### Unresolved

- The default state when an issue is added to the system.

### Resolved

- An issue is marked as resolved when an individual resolves it by manually changing the state on the issue page UI, submitting a fix, or when the project’s auto-resolve feature is configured. Team members are notified via email. Auto-resolve is located in **Project Settings > General Settings**. For more details about submitting a fix, see documentation on [resolving issues]({%- link _documentation/workflow/releases.md -%}#after-associating-commits).

[{% asset notifications/auto-resolve.png alt="Event settings sliding toggle for disabling auto resolve." %}]({% asset notifications/auto-resolve.png @path %})

- Resolved means the issue has stopped firing events. If another event occurs, the issue reverts to unresolved.

### Regressions

- When Sentry changes the state of an issue from resolved to unresolved. If a resolved issue begins experiencing more events, it will revert to unresolved. Regressions trigger a workflow alert.
- Keep in mind; regression emails look very similar to other Notification emails.

### Ignored

- Regardless of alert rules, new events in ignored issues will not send alerts. Also, by default, ignored events are hidden in your project’s issue stream. Search the issue stream for `is:ignored` to find them.

## Core Notifications

### Assigned

- A team member is assigned the issue, and they're notified via email, even if the issue is resolved.

- Assignment auto subscribes you to workflow notifications.

[{% asset notifications/workflow_notifications_subscription.png alt="Workflow notifications subscription buttons. Options include always, only on issues I subscribe to, and never." %}]({% asset notifications/workflow_notifications_subscription.png @path %})

### Unassigned

- A team member has not been assigned the issue.

## Integrations with Notifications

Legacy Integrations (via "Service" as any individual integration) that can send Notifications:

{% include components/alert.html
  title="* Community Integrations"
  content="These integrations are [maintained and supported](https://forum.sentry.io) by the Sentry community."
  level="info"
%}

- Campfire*
- IRC
- OpsGenie
- PagerDuty
- Pushover
- [Slack]({%- link _documentation/workflow/integrations/global-integrations.md -%}#slack)
- Twilio
- VictorOps

## Notification Management

You can also configure various personal notifications from your [personal notifications settings](https://sentry.io/settings/account/notifications) and any specific project's settings in the [project alerts page](https://sentry.io/settings/account/notifications/alerts/).

### Issue Owners

The Issue Owners page is located in **Project Settings > Issue Owners**.

If an issue owner is specified, the email notification will go to the issue owner. If no issue owner is specified, all project members are notified.

[{% asset notifications/issue_owners.png alt="Toggles for changing issue owner notifications." %}]({% asset notifications/issue_owners.png @path %})

For more details, see full documentation on [Issue Owners]({%- link _documentation/workflow/issue-owners.md -%}).

### Unsubscribe

To opt-out of a specific issue’s notifications, click Unsubscribe at the bottom right of the issue’s page.

[{% asset notifications/unsubscribe.png alt="Unsubscribe button for Notifications." %}]({% asset notifications/unsubscribe.png @path %})
