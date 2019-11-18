---
title: 'Workflow'
sidebar_order: 2
---

Most activity within Sentry will generate a workflow notification. You can also configure various personal notifications from your [personal notifications settings](https://sentry.io/settings/account/notifications) and any specific project's settings in the Project Settings page.

By default, these notifications are sent to anyone who is a member of the project the issue occurs in. Still, each member may choose their participation state, as well as opt-in or opt-out of notifications for specific issues. See [Unsubscribe](#unsubscribe) below for more details.

## Issue States

Sentry provides a few states for each issue, which significantly impacts how notifications work.

### Unresolved

- The default state when an issue is added to the system.

### Resolved

- An issue is marked as resolved when an individual resolves it by manually changing the state on the issue page UI, submitting a fix, or when the project’s auto-resolve feature is configured. Team members are notified via email. Auto-resolve is located in **Project Settings > General Settings**.

[{% asset notifications/auto-resolve.png alt="Event settings sliding toggle for disabling auto resolve." %}]({% asset notifications/auto-resolve.png @path %})

- Resolved means the issue has stopped firing events. If another event occurs, the issue reverts to unresolved.

### Regressions

- When Sentry changes the state of an issue from resolved to unresolved. If a resolved issue begins experiencing more events, it will revert to unresolved. Regressions trigger a workflow alert.
- Keep in mind; regression emails look very similar to other Notification emails.

## Core Notifications

### Assigned

- A team member is assigned the issue, and they're notified via email, even if the issue is resolved.

- Assignment auto subscribes you to workflow notifications.

[{% asset notifications/workflow_notifications_subscription.png alt="Workflow notifications subscription buttons. Options include always, only on issues I subscribe to, and never." %}]({% asset notifications/workflow_notifications_subscription.png @path %})

### Unassigned

- A team member has not been assigned the issue.

### Comments

- A team member adds a new comment to an issue's Comments thread.

## Digests

Sentry will automatically digest alerts sent by some services to avoid flooding your inbox with individual issue notifications. To control how frequently notifications are delivered, use the sliders.

- Minimum delivery interval
- Maximum delivery interval

[{% asset notifications/digest_intervals.png alt="Intervals that manipulate timing of digests." %}]({% asset notifications/digest_intervals.png @path %})

## Notification Management

You can also configure various personal notifications from your [personal notifications settings](https://sentry.io/settings/account/notifications) and any specific project's settings in the Project Settings page.

### Workflow Notifications

These notifications are triggered based on issue activity. You can set these for all projects, or you can click “Fine-tune workflow notifications by project” to configure this with more granularity.

[{% asset notifications/fine_tune_workflow.png alt="Dropdown of options for workflow notifications. Options are Default, Always, Only on issues I subscribe to, and Never." %}]({% asset notifications/fine_tune_workflow.png @path %})

### Issue Owners

Issue Owners are located in **Project Settings > Issue Owners**.

If an issue owner is specified, the email notification will go to the issue owner. If no issue owner is specified, all project members are notified.

[{% asset notifications/issue_owners.png alt="Toggles for changing issue owner notifications." %}]({% asset notifications/issue_owners.png @path %})

For more details, see full documentation on [Issue Owners]({%- link _documentation/workflow/issue-owners.md -%}).

### Unsubscribe

To opt-out of a specific issue’s notifications, click Unsubscribe at the bottom right of the issue’s page.

[{% asset notifications/unsubscribe.png alt="Unsubscribe button for Notifications." %}]({% asset notifications/unsubscribe.png @path %})

## FAQ

- Does assigning a resolved issue trigger a notification email?
    - Yes, you do get an email as long as you have workflow notifications enabled for that project.
