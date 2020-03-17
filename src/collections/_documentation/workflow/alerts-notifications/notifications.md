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

    - Auto-resolve is located in **Project Settings > General Settings**. For more details about submitting a fix, see documentation on [resolving issues](https://docs.sentry.io/workflow/releases/#after-associating-commits).

        ![https://docs.sentry.io/assets/notifications/auto-resolve-4ff17e17a825d4e2f16293d1e3371666838dcf20630c2caa61fc3af609289db3.png](https://docs.sentry.io/assets/notifications/auto-resolve-4ff17e17a825d4e2f16293d1e3371666838dcf20630c2caa61fc3af609289db3.png)

3. Ignored

    - Ignored issues suppress alerts for the issue, and by default, are hidden from your project’s issue stream. Search the issue stream for `is:ignored` to view them.
    
    - Keep in mind; **an ignored issue will still count towards your quota.**

Workflow emails are sent for issue state changes.

### Other Workflow Notifications

- When you or your team is **Assigned or Unassigned** an issue
- When someone leaves a comment

## Deploy

Deploy emails are sent to users who have committed to the release that was deployed. See [LINK: deploy documentation] for more details

[ screenshot deploy-emails.png ]

## Quota

Sentry sends all owners of the organization emails when

- The event volume is approaching or has exceeded the quota
- On-demand is activated
- Spike protection is activated or deactivated

## **Notification Subscription**

You can configure your personal workflow and deploy notifications [here](https://sentry.io/settings/account/notifications/).

### **Workflow Notifications**

![https://docs.sentry.io/assets/notifications/workflow_notifications_subscription-1f12011dbcd124436fb79f20b858eb338789fc530e4fa561f0535101a9d57e82.png](https://docs.sentry.io/assets/notifications/workflow_notifications_subscription-1f12011dbcd124436fb79f20b858eb338789fc530e4fa561f0535101a9d57e82.png)

You can also click “Fine-tune workflow notifications by project” to configure this with more granularity. Selecting Default will use your preference from the last step for that project.

![https://docs.sentry.io/assets/notifications/fine_tune_workflow-302c0ab140d11a06981036b149e06ec6bec3aa979ac7b39966a59e2e56533025.png](https://docs.sentry.io/assets/notifications/fine_tune_workflow-302c0ab140d11a06981036b149e06ec6bec3aa979ac7b39966a59e2e56533025.png)

**Unsubscribe**

To opt-out of workflow notifications for a specific issue, click "Unsubscribe" at the bottom right of the issue’s page.

![https://docs.sentry.io/assets/notifications/unsubscribe-1fec0e1b843f1582b298596422ce6d15f239550945614de71943c9c083886e3a.png](https://docs.sentry.io/assets/notifications/unsubscribe-1fec0e1b843f1582b298596422ce6d15f239550945614de71943c9c083886e3a.png)

### Deploy Notifications

Deploy notification settings are located in **Setting > Account > Notifications**.

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Untitled%202.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Untitled%202.png)

## **FAQ**

- Does assigning a resolved issue trigger a notification email?
    - Yes, you do get an email as long as you have workflow notifications enabled for that project.
