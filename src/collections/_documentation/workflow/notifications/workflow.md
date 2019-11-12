---
title: 'Workflow'
sidebar_order: 2
---

Most activity within Sentry will generate a workflow notification. You can configure various notifications from your [personal notifications settings](link to: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)). 

By default, these notifications are sent to anyone who is a member of the project the issue occurs in. Still, each member may choose their participation state, as well as opt-in or opt-out of notifications for specific issues. See [Unsubscribe] (link to the bottom of page ) below for more details.

## Issue States

Sentry provides a few states for each issue, which significantly impacts how notifications work.

### Unresolved

- The default state when an issue is added to the system.

### Resolved

- An issue is marked as resolved when an individual resolves it by manually changing the state on the issue page UI, submitting a fix, or when the project’s auto-resolve feature is configured. Team members are notified via email. Auto-resolve is located in Project Settings > General Settings.

[{% asset notifications_index_pg/auto-resolve.png alt="Event settings sliding toggle for disabling auto resolve." %}]({% asset notifications_index_pg/auto-resolve.png @path %})

- Resolved means the issue has stopped firing events. If another event occurs, the issue reverts to unresolved.

    ![](resolve_button-4f66f881-61ac-43d9-8265-351efacde774.png)

### Regressions

- When Sentry changes the state of an issue from resolved to unresolved. If a resolved issue begins experiencing more events, it will revert to unresolved. Regressions trigger a workflow alert.
- Keep in mind; regression emails look very similar to other Notification emails.

## Core Notifications

### Assigned

- A team member is assigned the issue, and they're notified via email, even if the issue is resolved.

    ![](assignee_button-8b4a776c-5b31-4280-8b20-cc64661bf971.png)

- Assignment auto subscribes you to workflow notifications.

    ![](workflow_notifications-3f395da0-a7c3-49ac-a8ec-0de5ef18ebc2.png)

### Unassigned

- A team member has not been assigned the issue.

### Comments

- A team member adds a new comment to an issue's Comments thread.

## Digests

Sentry will automatically digest alerts sent by some services to avoid flooding your inbox with individual issue notifications. To control how frequently notifications are delivered, use the sliders.

- Minimum delivery interval
- Maximum delivery interval

![](Untitled-dfaf7516-1747-4cbc-a1a4-03eee10c9c04.png)

## Notification Management

You can configure various notifications from your [personal notifications](link: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)) settings.

### Workflow Notifications

These notifications are triggered based on issue activity.

![](Untitled-623782a4-57dd-449e-a91d-2ddb7b099819.png)

You can set these for all projects, or you can click “Fine-tune workflow notifications by project” to configure this with more granularity.

![](Untitled-07dd96df-34eb-4bb0-9733-b1ea184eac30.png)

### Default Project Alerts

If you have set any specific project alert to default, that means you've configured the notification to the Default Project Alert, which is a switch you can toggle on or off. This toggle switch controls all project alerts set to default. 

You can find the Default Project Alerts switch in User Settings > Account > Notifications > Fine tune alerts by project.

![](default_project_alerts-e36e4184-d9e5-42d7-9b5c-fded69222ae6.png)

### Per-Project Alerts

Your per-project alerts have the fine-tuning options of Default, On, or Off. 

![](specific_project_alert-7cd17334-1d3e-4c63-99eb-66bc005f4df4.png)

### Issue Owners

Issue Owners are located in Project Settings > Issue Owners.

If an issue owner is specified, the email notification will go to the issue owner. If no issue owner is specified, all project members are notified.

![](Untitled-4aac3a0d-0ef5-4c4e-b1c7-5d916f4cba30.png)

For more details, see full documentation on [Issue Owners] ([https://docs.sentry.io/workflow/issue-owners/](https://docs.sentry.io/workflow/issue-owners/)).

### Unsubscribe

To opt-out of a specific issue’s notifications, click Unsubscribe at the bottom right of the issue’s page.

![](Unsubscribe-0202991b-92a8-458a-9752-28b5f4102025.png)

## FAQ

- Does assigning a resolved issue trigger a notification email?
    - Yes, you do get an email as long as you have workflow notifications enabled for that project.
