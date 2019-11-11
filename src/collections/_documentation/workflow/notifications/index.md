---
title: Notifications
sidebar_order: 2
---

Notifications in Sentry can be routed to many supported integrations, but by default are aimed at email. Notifications fall into two categories:

## Alerts

Each time you create a new project, or a new issue occurs, Sentry creates a default alert rule. Alerts are generated based upon a project’s alert rules. You can customize alerts to the needs of an individual or team.

Alerts have a set of configuration and subscription options. By default, Sentry subscribes you to everything, but you can change this via account settings. You can configure various notifications from your [personal notifications settings](link to: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)). For more details, see the [full documentation on Alerts] (link to Alerts page).

## Workflow

Workflow relates to all activity involving user actions such as resolution, comments, and automatic regressions.

Workflow has a set of configuration and subscription options. By default, Sentry subscribes you to everything, but you can change this via your account settings. You can configure various notifications from your [personal notifications settings](link to: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)). For more details, see the [full documentation on Workflow] (link to Workflow page).

## Issue States

Sentry provides a few states for each issue, which significantly impacts how notifications work.

### Unresolved

- The default state when an issue is added to the system.

### Resolved

- An issue is marked as resolved when an individual resolves it by manually changing the state in the UI, submitting a fix, or when the project’s auto-resolve feature is configured. Team members are notified via email.

![](Screenshot_2019-11-08_15-335f4354-46ad-40f8-a995-b9e0b2d76baa.51.34.png)

- Resolved means the issue has stopped firing events. If another event occurs, the issue reverts to unresolved.

    ![](resolve_button-4f66f881-61ac-43d9-8265-351efacde774.png)

### Regressions

- When Sentry changes the state of an issue from resolved to unresolved. If a resolved issue begins experiencing more events, it will revert to unresolved. Regressions trigger a workflow alert.
- Keep in mind; regression emails look very similar to other Notification emails.

### Ignored

- Regardless of alert rules, new events in ignored issues will not send alerts. Also, by default, ignored events are hidden in your project’s issue stream. Search the issue stream for is:ignored to find them.

## Core Notifications

### Assigned

- A team member is assigned the issue, and they're notified via email, even if the issue is resolved.

    ![](assignee_button-8b8c2a2a-e940-4f98-a756-0feda33ac46f.png)

- Assignment auto subscribes you to workflow notifications.

    ![](workflow_notifications-33d91e41-c949-46e3-9991-2091208ad2ab.png)

### Unassigned

- A team member has not been assigned the issue.

## Integrations with Notifications

Legacy Integrations (via "Service" as any individual integration) that can send Notifications:

- [Campfire](link to Integration)
- [OpsGenie](link to integration)
- [PagerDuty](link to integration)
- [Pushover](link to integration)
- [Twilio](link to integration)
- [VictorOps](link to integration)
- [IRC](link to integration)
- [Slack](link to integration)

## Notification Management

You can configure various notifications from your [personal notifications](link: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)) settings.

### Unsubscribe

To opt-out of a specific issue’s notifications, click Unsubscribe at the bottom right of the issue’s page.

![](Unsubscribe-89c729a1-f10f-4f33-a8b2-bb9c59370401.png)

### Issue Owners

The Issue Owners page is located in Project Settings > Issue Owners.

If an issue owner is specified, the email notification will go to the issue owner. If no issue owner is specified, all project members are notified.

![](Untitled-4aac3a0d-0ef5-4c4e-b1c7-5d916f4cba30.png)

For more details, see full documentation on [Issue Owners] ([https://docs.sentry.io/workflow/issue-owners/](https://docs.sentry.io/workflow/issue-owners/)).
