---
title: Alerts
sidebar_order: 1
---

Alerts can be created by users with admin permission or higher from **Project Settings > Alerts > New Alert**.

There are two types of alerts: Issue Alerts and Metric Alerts. 

## Metric Alerts

Metric alerts allow you to filter and set thresholds on all errors across a project. They can be used for high-level monitoring of patterns, or fine-grained monitoring of individual events. Metric alerts help express lightweight service-level objectives (SLOs) such as users affected by signup-page errors, or volume of database errors.

### Alert Builder

[ builder image ]

A metric alert can have at most two triggers. The first one is a (required) critical trigger, and the second one is an (optional) warning trigger. Triggers are independent with one constraint: the warning trigger must be reached before the critical one.

Triggers are evaluated roughly every minute from the highest severity to lowest. If there's a match, an alert is created with that status. Or, if an alert exists, its status is updated. A metric alert can be resolved manually, or automatically by setting resolution thresholds on it.

When an alert is created or changes status, the actions associated with the trigger are executed. The available actions are:

- Send an email (to a member or team). If sent to a member, the member's personal project alert opt-out settings are overridden.
- Send a Slack notification

### Alert Stream

Alerts can be accessed via the **Alerts** sidebar item.

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Untitled.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Untitled.png)

### Alert Details

This page shows you details about **one instance** of an alert. For example, from the time it started to the time it was resolved (or the current time if it's active).

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/03_Alert_Details.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/03_Alert_Details.png)

The "subscribe" button subscribes you to workflow notifications for the alert, which include status changes and comments.

## Issue Alerts

Issue alerts fire whenever any issue in the project matches the specified criteria, such as a resolved issue re-appearing or an issue affecting many users.

### **Conditions**

Conditions are evaluated for an issue **each time the issue receives a new event**.

**Each condition is evaluated independently of other conditions**. For example, the following alert will never fire:

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-26_21.52.38.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-26_21.52.38.png)

This is because an event can't cause both of the following conditions to be satisfied simultaneously: 

- A new issue is created
- The issue has happened 10 times

**Available Conditions**

- A new issue is created / An issue is first seen
- An issue changes state from `resolved` to `unresolved`
- An issue changes state from `ignored` to `unresolved`
- An issue has happened more than {value} times in {interval}
    - value: a positive integer
    - interval: one minute, one hour, one day, one week, or 30 days
- An issue has been seen by more than {value} users in {interval}
    - value: a positive integer
    - interval: one minute, one hour, one day, one week, or 30 days
- A new event is seen
- A new event is seen with tags matching {key} {match} {value}
    - key: any tag [LINK: tags]
    - match: equals, does not equal, starts with, ends with, contains, does not contain, is set, or is not set
    - value: any key’s value
- A new event is seen with {attribute} {match} {value}
    - attribute: `message`, `platform`, `environment`, `type`, `exception.type`, `exception.value`, `user.id`, `user.email`, `user.username`, `user.ip_address`, `http.method`, `http.url`, `stacktrace.code`, `stacktrace.module`, or `stacktrace.filename`
    - match: equals, does not equal, starts with, ends with, contains, does not contain, is set, or is not set
    - value: any attribute’s value
- A new event is seen with level {match} {level}
    - match: equal to, less than or equal to, greater than or equal to
    - level: fatal, error, warning, info, debug, or sample

### **Actions**

The following actions are available:

- Send a notification to all legacy integrations
    - Legacy integrations [LINK: legacy integrations], also known as Plugins, are configured per project. Legacy integrations currently include email.
- Send a notification to a single legacy integration (service)
    - "service" is the same as legacy integration
- Send a notification to a global integration, which includes
    - [PagerDuty](https://docs.sentry.io/workflow/integrations/global-integrations/#pagerduty)
    - [Slack](https://docs.sentry.io/workflow/integrations/global-integrations/#slack)
    - Custom integrations built using the [Integration Platform](https://docs.sentry.io/workflow/integrations/integration-platform/)

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-25_15.28.01.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-25_15.28.01.png)

- Legacy Integrations (via “Service” as any individual integration) that can send Notifications:

    [ ALERT BOX: **Community Integrations** 

    These integrations are [maintained and supported](https://forum.sentry.io/) by the Sentry community. ]

    - Campfire*
    - IRC
    - OpsGenie
    - Pushover
    - Twilio
    - VictorOps
    - [Webhooks](https://docs.sentry.io/webhook-plugin/)

By default, **alert emails** are sent to [LINK: issue owners]. If issue owners isn't configured, or an owner isn't found, the email will do one of two things:

- not send
- send to all project members depending on the fall-through setting under **Project Settings > Issue Owners**.

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-26_22.03.07.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-26_22.03.07.png)

**Rate Limit**

This control allows you to limit the number of times actions are executed for each issue.

- Perform these actions at most once every {interval} for an issue
    - interval: 5 minutes, 10 minutes, 30 minutes, 60 minutes, 3 hours, 12 hours, 24 hours, one week, or 30 days

For example, if an issue violates alert conditions multiple times in a 30-min period, but your frequency threshold is 30 minutes, you’ll only get one alert.

![https://docs.sentry.io/assets/notifications/alert_frequency-40d4d353342465f52d23147ed2fb32986e1a502c889cfb5579723cd161b53a62.png](https://docs.sentry.io/assets/notifications/alert_frequency-40d4d353342465f52d23147ed2fb32986e1a502c889cfb5579723cd161b53a62.png)

### **Environment**

- All Environments
- Any one of your defined (and not hidden) environments

![https://docs.sentry.io/assets/notifications/alert_environment-e6e58d46f0a5773deb78f740f1f14ab37f236699161492dc20023d6586504529.png](https://docs.sentry.io/assets/notifications/alert_environment-e6e58d46f0a5773deb78f740f1f14ab37f236699161492dc20023d6586504529.png)

If "All Environments" is selected, the alert conditions are checked individually for each environment, not for the combined events from all environments.

### **Digests**

The digests feature works only for **issue alert emails**. This project-level setting allows you to batch and deliver issue alert emails for a project. Use the sliders to control the frequency.

![https://docs.sentry.io/assets/notifications/alert_digest-e0a488f304173985c095f8ef763a0d0f68d34336a00e114625cbb339d7e6f486.png](https://docs.sentry.io/assets/notifications/alert_digest-e0a488f304173985c095f8ef763a0d0f68d34336a00e114625cbb339d7e6f486.png)

## Alert Listing

This is a listing of all your project's alerts.

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Untitled%201.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Untitled%201.png)

## Alert Subscription

### Issue Owners

By default, **alert emails** are sent to [LINK: issue owners]. If issue owners isn't configured, or an owner isn't found, the email will do one of two things:

- not send
- send to all project members depending on the fall-through setting under **Project Settings > Issue Owners**.

![DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-26_22.03.07.png](DON%20T%20add%20content%20to%20this%20Draft%20Alerts%20Notificatio/Screenshot_2020-02-26_22.03.07.png)

### Ignore

While an issue is ignored, all alerts for that issue are muted. You can also ignore an issue until certain conditions are met — for example, "ignore for 30 minutes." Keep in mind; **an ignored issue will still count towards your quota**.

Finally, you can configure your personal alert notifications settings [here](https://sentry.io/settings/account/notifications/).

### Personal Alert Settings

You can find your personal alert settings in **User Settings > Account > Notifications**.

Use the "default project alerts" setting to set your default preference across all projects — subscribed or unsubscribed.

![https://docs.sentry.io/assets/notifications/default_project_alerts-132a6776016d0827f14548f4e970adbcb273174f42c9aacfce2260e7c5434dfc.png](https://docs.sentry.io/assets/notifications/default_project_alerts-132a6776016d0827f14548f4e970adbcb273174f42c9aacfce2260e7c5434dfc.png)

After making a selection, you can also selectively change it per project by going to **User Settings > Account > Notifications > Fine tune alerts by project**.

Each project has three options: Default, On, or Off. Selecting default uses your default preference from the previous step.

![https://docs.sentry.io/assets/notifications/specific_project_alert-8b39db12d437131adf61d367d1a7161bb6b7c5a99d2ead1c6e339aac98dc9e46.png](https://docs.sentry.io/assets/notifications/specific_project_alert-8b39db12d437131adf61d367d1a7161bb6b7c5a99d2ead1c6e339aac98dc9e46.png)

## **FAQs**

- Can I copy an alert rule to another project?
    - Unfortunately, this is not an option.
- Can I set different default alert rules?
    - Unfortunately, this is currently not an option. However, this feature is coming soon.
- Are there issue-level filters other than environment?
    - No, all filters are event-based. For example, there aren’t configurations for alerting only if an issue is X days old, or assigned to Y, or alerted-on-before, etc.
- What is the difference between Delete, Delete & Discard, and Ignore?
    - Delete - Deleting an issue deletes all data associated with it, and creates a new issue if an event with the same fingerprint happens again. Workflow notifications for this new issue behave just like notifications for any new issue.
    - [Delete & Discard](https://docs.sentry.io/accounts/quotas/#filter-by-issue) - when you delete and discard an issue, all notifications for the issue will stop
    - Ignore - While an issue is ignored, all alerts for that issue are muted. You can also ignore an issue until certain conditions are met — for example, "ignore for 30 minutes." Keep in mind; **an ignored issue will still count towards your quota.**