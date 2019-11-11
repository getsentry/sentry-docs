---
title: 'Alerts'
sidebar_order: 1
---

Each time you create a new project, or a new issue occurs, Sentry creates a default alert rule. Alerts are generated based upon a project’s alert rules. By default, all project members receive alert notifications via email, and all integrations specified in [actions](link to Actions section) receive alert notifications.

Alerts can also be configured per-project and are based on the rules defined for that project. To modify the rules visit your Project Settings > Alerts > Rules > "New Alert Rules" or "Edit Rule. In Rules, you’ll see a list of all active rules and can add alert rules or modify existing rules.

You can also configure various notifications from your [personal notifications settings](link to: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)). 

## **Conditions**

Rules provide several conditions that you’re able to configure. These are relatively self-explanatory and range from simple state changes to more complex filters on attributes. Every time an event is received, Sentry evaluates the alert conditions.

For example, at Sentry, we send a notification every single time an error happens, and the affected user’s email address ends with `@sentry.io`.

![](Untitled-93bab517-3a98-449e-b61b-2cef5e7a0957.png)

### List of Conditions

- An event is seen
- An issue is first seen
- An issue changes state from resolved to unresolved
- An issue changes state from ignored to unresolved
- An event's tags match {key} {match} {value}
    - key: any tag
    - match: equals, does not equal, starts with, ends with, contains, does not contain, is set, or is not set
    - value: any key's value
- An issue is seen more than {value} times in {interval}
    - value: a positive integer
    - interval: one minute, one hour, one day, one week, or 30 days
- An issue is seen by more than {value} users in {interval}
    - value: a positive integer
    - interval: one minute, one hour, one day, one week, or 30 days
- An event's {attribute} value {match} {value}
    - attribute: message, platform, environment, type, exception.type, exception.value, user.id, user.email, user.username, user.ip_address, http.method, http.url, stacktrace.code, stacktrace.module, or stacktrace.filename
    - match: equals, does not equal, starts with, ends with, contains, does not contain, is set, or is not set
    - value: any attribute's value
- An event's level is {match} {level}
    - match: equal to, less than or equal to, greater than or equal to
    - level: fatal, error, warning, info, debug, or sample

## Actions

Actions are located in Project Settings > Alerts > Rules > "New Alert Rules" or "Edit Rule.

![](Untitled-09e4d068-799a-46e4-8672-0918531bec21.png)

An example use-case might be that you want a specific kind of error to send via Slack, but you want everything to send via Mail.

### Action Types

Currently, there are three types of actions you can take:

- Send a notification (for all legacy integrations)
    - Per-Project Integrations are considered to be legacy integrations
- Send a notification via {service}
    - service is one of mail and any configured per-project integration
- Send a notification to the {workspace} Slack workspace to {channel} and show tags {tags} in notification
    - to clarify this relates to the global Slack integration, *not* the per-project legacy integration

![](Untitled-f2a54bb8-40ca-4060-93ab-793bbaf9578c.png)

An example use-case might be that you want a specific kind of error to send via Slack, but you want everything to send via Mail.

### Frequency

- Perform these actions at most once every {interval} for an issue
    - interval: 5 minutes, 10 minutes, 30 minutes, 60 minutes, 3 hours, 12 hours, 24 hours, one week, or 30 days
    - Frequency configuration can get complicated. For example, if an issue changes state from resolved to unresolved, and then this issue is resolved, unresolved, and resolved again within 5 minutes, but your frequency threshold is 30 minutes, you'll only get one notification

![](Untitled-765e2083-e4cf-4875-b070-25e726e51853.png)

## Environment

- All Environments
- any one of your defined (and not hidden) environments

![](Untitled-1ebaacbb-49a5-43fc-bad1-9b1fc3e234f5.png)

## Digests

Sentry will automatically digest alerts sent by some services to avoid flooding your inbox with individual issue notifications. To control how frequently notifications are delivered, use the sliders.

- Minimum delivery interval
- Maximum delivery interval

![](Untitled-dfaf7516-1747-4cbc-a1a4-03eee10c9c04.png)

## Notification Management

You can configure various notifications from your [personal notifications](link: [https://sentry.io/settings/account/notifications/](https://sentry.io/settings/account/notifications/)) settings.

### Default Project Alerts

If you have set any specific project alert to default, that means you've configured the notification to the Default Project Alert, which is a switch you can toggle on or off. This toggle switch controls all project alerts set to default. 

You can find the Default Project Alerts switch in User Settings > Account > Notifications > Fine tune alerts by project.

![](default_project_alerts-78e9bd4d-a652-4d05-a2cb-1a84e44b5d60.png)

### Per-Project Alerts

Your per-project alerts have the fine-tuning options of Default, On, or Off. 

![](specific_project_alert-0fde9e7a-93b0-4d00-9ce5-2a5492b3904f.png)

## Issue Owners

The Issue Owners page is located in Project Settings > Issue Owners.

If an issue owner is specified, the email notification will go to the issue owner. If no issue owner is specified, all project members are notified.

![](Untitled-4aac3a0d-0ef5-4c4e-b1c7-5d916f4cba30.png)

For more details, see full documentation on [Issue Owners] ([https://docs.sentry.io/workflow/issue-owners/](https://docs.sentry.io/workflow/issue-owners/)).

## FAQs

- Can I copy an alert rule to another project?
    - Unfortunately, this is not an option.
- Can I set different default alert rules?
    - Unfortunately, this is not an option.
- Are there issue-level filters?
    - No, all filters are event-based. For example, there aren't configurations for alerting only if an issue is X days old, or assigned to Y, or alerted-on-before, etc.
- What is the difference between Delete, Delete & Discard, and Ignore
    - delete - when you delete an issue with notifications, notifications will continue if the issue is triggered again
    - delete & discard - when you delete and discard, all notifications will stop
    - ignore - while an issue is ignored, all notifications will stop. If it becomes unignored, notifications will continue. For example, if you have chosen "ignore for 30 minutes," you won't be notified for 30 minutes. Keep in mind; an ignored issue will still count towards your quota.
    