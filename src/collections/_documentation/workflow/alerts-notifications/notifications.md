---
title: Other Notifications
sidebar_order: 2
---

Aside from Alerts, Sentry has other types of notifications, such as Workflow, Deploy, and Quota notifications. All these notifications are sent through email.

## Workflow

Workflow relates to activity involving user actions and state changes on issues and alerts. This includes things like resolution, assignment, comments, and regressions. 

By default, Sentry subscribes you to issues based on signals, such as: 

- Subscription to the issue or all workflow emails in the project
- Involvement in a commit related to the issue
- Commenting on or bookmarking the issue
- Mention of you or your team in the issue or assigned to the issue

### Issue States

An issue can be in one of the following three states:

1. Unresolved

    - The default state when an issue is added to the system.

2. Resolved
    - Resolve an issue to indicate that no more events are expected. If another event is seen in the issue, the issue will revert to unresolved. This is called a **regression**.
    
    - An issue is marked as resolved in one of three ways:
        
        1. When an individual resolves it by manually changing the state on the issue page UI
        2. Submitting a fix with the associated issue ID
        3. When the project’s auto-resolve feature is configured

    - Auto-resolve is located in **Project Settings > General Settings**. For more details about submitting a fix, see documentation on [resolving issues](/workflow/releases/#after-associating-commits).
    
        [{% asset notifications/auto-resolve.png alt="A slider to indicate whether the auto resolve is disabled or not." %}]({% asset notifications/auto-resolve.png @path %})

3. Ignored

    - Ignored issues suppress alerts for the issue, and by default, are hidden from your project’s issue stream. Search the issue stream for `is:ignored` to view them.
    
    - Keep in mind; **an ignored issue will still count towards your quota.**

Workflow emails are sent for issue state changes.

## Deploy

Deploy emails are sent to users who have committed to the release that was deployed. For more details, see [deploy documentation](/workflow/releases/#create-deploy).

[{% asset deploy-emails.png alt="An example of an email describing deployed features." %}]({% asset deploy-emails.png @path %})

## Quota

Sentry sends all owners of the organization emails when

- The event volume is approaching or has exceeded the quota
- On-demand is activated
- Spike protection is activated or deactivated

## **Notification Subscription**

You can configure your personal workflow and deploy notifications [in your account settings](https://sentry.io/settings/account/notifications/). You **cannot configure** quota notifications.

### **Workflow Notification Settings**

[{% asset notifications/workflow_notifications_subscription.png alt="Radio buttons with options for always, ony on issues I subscribe to, and never." %}]({% asset notifications/workflow_notifications_subscription.png @path %})

After selecting the appropriate alert setting, selectively change it by project in **User Settings > Account > Fine tune alerts by project**.

Each project has three options: Default, On, or Off. Selecting default uses your default preference from the previous step.

[{% asset notifications/fine_tune_workflow.png alt="A dropdown with the options to choose default, always, only on issues I subscribe to, and never." %}]({% asset notifications/fine_tune_workflow.png @path %})

**Unsubscribe**

To opt-out of workflow notifications for a specific issue, click "Unsubscribe" at the bottom right of the issue’s page.

[{% asset notifications/unsubscribe.png alt="An unsubscribe button to stop notifications." width="300" %}]({% asset notifications/unsubscribe.png @path %})

### Deploy Notifications

Deploy notification settings are located in **Setting > Account > Notifications**.

[{% asset notifications/deploy_notifications.png alt="An unsubscribe button to stop notifications." %}]({% asset notifications/deploy_notifications.png @path %})

## **FAQ**

- Does assigning a resolved issue trigger a notification email?
    - Yes, you do get an email as long as you have workflow notifications enabled for that project.
