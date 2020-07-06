---
title: Alerts
sidebar_order: 1
---

Sentry users with admin permissions or higher can create alerts. To confirm or set admin permissions, see **Project Settings > Alerts > New Alert**.

## For Errors

Sentry automatically groups individual error events into Issues based on stack trace and other factors. For more details about grouping, see the [full documentation on Grouping & Fingerprints](/data-management/event-grouping/index).

Sentry has two types of alerts you can use for errors:

[Issue Alerts](#issue-alerts)

: Notifies you when individual Sentry [Issues](/data-management/event-grouping/index) match your alerting criteria, such as an Issue happening more frequently than usual.

[Metric Alerts](#metric-alerts)

: Metric alerts can be used on error data to compute the number of events or the number of users affected by events in your project over a period of time. A metric is the value of an aggregate function like `count()` or `avg()` applied to your event data. You can filter events by attributes and tags, which is particularly useful for aggregating across events that aren't grouped into a single Issue. When this happens, metric alerts are the most useful form of an alert.

## For Performance Monitoring

[Metric Alerts](#metric-alerts) can be used on performance data, allowing you to set alerts on the following metrics:

- Latency: min, max, average, [percentile](/performance-monitoring/performance/metrics/#p75-threshold)
- [Apdex](/performance-monitoring/performance/metrics/#apdex)
- [Failure rate](/performance-monitoring/performance/metrics/#failure-rate)
- [Transaction volume](/performance-monitoring/performance/metrics/#frequency)

## Metric Alerts

As mentioned [above](#for-errors), a metric is the value of an aggregate function like `count()` or `avg()` applied to your event data. Typical uses of metric alerts include detecting a spike in the overall number of errors in a project, or a violation of a performance metric like latency, apdex, failure rate, and throughput.

### Alert Builder

A metric alert has, at most, two triggers. The first is a critical trigger, which is required. The second is a warning trigger, which is optional. Triggers are independent of one another; however, the warning (optional) must be reached before the critical (required) trigger.

Sentry evaluates triggers approximately every minute from the highest severity to lowest. Sentry creates an alert with the severity of the matched trigger (warning or critical). If an alert is already active, its status is updated. Admins can resolve alerts manually or automatically by setting the resolution threshold.

When an alert is created or changes status, the actions associated with the trigger are executed. The available actions are:

- Send an email (to a member or team). If sent to a member, the member's personal project alert opt-out settings are overridden.
- Send a Slack notification.

### Alert Stream

Access alerts via the **Alerts** sidebar item.

[{% asset notifications/alert-stream2.png alt="Alert stream illustrates alert duration, trends, severity, time duration and percentage of users affected." %}]({% asset notifications/alert-stream2.png @path %})

### Alert Details

In this page, you can view a single instance of alert from its creation to its resolution, or the current time if the alert is still active.

[{% asset notifications/alert_details.png alt="Alert details illustrates a graph showing errors." %}]({% asset notifications/alert_details.png @path %})

The "subscribe" button subscribes you to workflow notifications for the alert, including status changes and comments.

## Issue Alerts

Issue alerts apply only to errors, and fire whenever any issue in the project matches the specified criteria, such as a resolved issue re-appearing or an issue affecting many users.

### **Conditions**

Conditions are evaluated for an issue alert **each time** the issue receives a new event, subject to [rate limits](/workflow/alerts-notifications/alerts/#rate-limit).

{% capture __alert_content -%}
**Each condition is evaluated independently of other conditions**. For example, the following alert will never fire:

[{% asset notifications/alert-conditions2.png alt="The alert condition in this example shows the conditions are conflicting with each other." %}]({% asset notifications/alert-conditions2.png @path %})

In the example, the alert will not fire because an event cannot satisfy both of these conditions simultaneously:

- Sentry detects/creates a new issue
- The issue has happened 10 times

{%- endcapture -%}
{%- include components/alert.html
    content=__alert_content
%}

**Available Conditions**

- Sentry detects/creates a new issue
- An issue changes state from `resolved` to `unresolved`
- An issue changes state from `ignored` to `unresolved`
- An issue has happened more than {value} times in {interval}
    - value: a positive integer
    - interval: one minute, one hour, one day, one week, or 30 days
- An issue has been seen by more than {value} users in {interval}
    - value: a positive integer
    - interval: one minute, one hour, one day, one week, or 30 days
- Sentry detects a new event
- Sentry detects a new event with tags matching {key} {match} {value}
    - key: any tag
    - match: equals, does not equal, starts with, ends with, contains, does not contain, is set, or is not set
    - value: any key’s value
- Sentry detects a new event with {attribute} {match} {value}
    - attribute: `message`, `platform`, `environment`, `type`, `exception.type`, `exception.value`, `user.id`, `user.email`, `user.username`, `user.ip_address`, `http.method`, `http.url`, `stacktrace.code`, `stacktrace.module`, or `stacktrace.filename`
    - match: equals, does not equal, starts with, ends with, contains, does not contain, is set, or is not set
    - value: any attribute’s value
    - When viewing an event, if an attribute is unclear or missing, you can view its JSON payload to determine its value.
- Sentry detects a new event with level {match} {level}
    - match: equal to, less than or equal to, greater than or equal to
    - level: fatal, error, warning, info, debug, or sample

### Actions

The following actions are available:

- Send an email
    - Send email to either [Issue Owners](/workflow/issue-owners), Team, or [Member](/accounts/membership/#member)
- Send a notification to all legacy integrations
    - [Legacy integrations](/workflow/integrations/legacy-integrations), also known as Plugins, are configured per project 
- Send a notification via an integration
    - This includes:
        - Legacy integrations
        - Integrations built using the [Integration platform](/workflow/integrations/integration-platform/index) (includes published integrations, internal integrations, unpublished integrations)
    -  If no legacy integrations or integrations built using the integration platform are enabled, this option is hidden.
- Send a notification to a global integration, which includes
    - [PagerDuty](/workflow/integrations/global-integrations/#pagerduty)
    - [Slack](/workflow/integrations/global-integrations/#slack)

[{% asset notifications/alert-actions2.png alt="The alert condition in this example shows the conditions are conflicting with each other." %}]({% asset notifications/alert-actions2.png @path %})

For more details, see [Legacy Integrations](/workflow/integrations/legacy-integrations) (via “Service” as any individual integration) that can send Notifications.

By default, [issue owners](/workflow/alerts-notifications/alerts/#issue-owners) receive alert emails. If an issue owner is not configured or not found, the email will either not send or send to all project members as defined in **Project Settings > Issue Owners**.

[{% asset notifications/issue_owners.png alt="Issue owners can be toggled on or off." %}]({% asset notifications/issue_owners.png @path %})

### Rate Limit

The rate limit determines how frequently an issue alerts. After an issue fires an alert, Sentry won't check the conditions and won't execute the actions for that issue until the rate limit period passes. The limit is set to perform the action according to one of these intervals:

- minutes: 5, 10, 30, 60
- hours: 3, 12, 24
- one week or 30 days

For example, if an issue violates alert conditions multiple times in a 30-min period, but your frequency threshold is 30 minutes, you’ll only get one alert.

[{% asset notifications/alert_frequency.png alt="A dropdown that adjusts the frequency of an alert." %}]({% asset notifications/alert_frequency.png @path %})

### Environment
Environment control allows you to specify which environment qualifies for your issue alert.

- All Environments
- Any one of your defined (and not hidden) environments

[{% asset notifications/alert_environment.png alt="A dropdown allowing you to choose an environment to attach to an alert." %}]({% asset notifications/alert_environment.png @path %})

If you select "All Environments", Sentry checks individually for each environment, rather than combined events across environments.

### Digests

The digests feature works only for **issue alert emails** and limits alerts across projects. This project-level setting allows you to batch issue alerts to limit the total number of emails you receive for that project. Use the sliders to control the frequency.

[{% asset notifications/alert_digest.png alt="A sliding adjustment scale for the frequency of alert emails." %}]({% asset notifications/alert_digest.png @path %})

## Alert Listing

This is a listing of all your project's alerts.

[{% asset notifications/alert-listing.png alt="Alert rules are divided by projects, their conditions/triggers, and actions(s)." %}]({% asset notifications/alert-listing.png @path %})

## Alert Subscription

### Issue Owners

By default, issue owners receive alert emails. If an issue owner is not configured or not found, the email will either not send or send to all project members as defined in **Project Settings > Issue Owners**.

[{% asset notifications/issue_owners2.png alt="A toggle indicating if all users are issue owners or not." %}]({% asset notifications/issue_owners2.png @path %})

### Ignore

When an issue is set to ignore, Sentry mutes the alerts for that issue. You can also ignore an issue until certain conditions are met —- for example, "ignore for 30 minutes." Keep in mind; **an ignored issue will still count towards your quota**.

### Personal Alert Settings

Review your personal alert settings in **User Settings > Account > Notifications**.

Use the "default project alerts" setting to set your default preference across all projects — subscribed or unsubscribed.

Note that this setting does not affect alerts you've configured to send to your email explicitly.

[{% asset notifications/default_project_alerts.png alt="A toggle for turning on or off all project alerts." width="300" %}]({% asset notifications/default_project_alerts.png @path %})

After selecting the appropriate alert setting, selectively change it by project in **User Settings > Account > Fine tune alerts by project**.

Each project has three options: Default, On, or Off. Selecting default uses your default preference from the previous step.

[{% asset notifications/specific_project_alert.png alt="Dropdown indicating a choice between default, on, or off." width="300" %}]({% asset notifications/specific_project_alert.png @path %})

## **FAQs**

- Can I copy an alert rule to another project?
    - This feature will be available in a future release.
- Can I set different default alert rules?
    - This feature will be available in a future release.
- Are there issue-level filters other than environment?
    - No, all filters are event-based. For example, configurations don't exist for alerting only if an issue is X days old, or assigned to Y, or alerted-on-before, etc.
- What is the difference between Delete, Delete & Discard, and Ignore?
    - Delete - Deleting an issue deletes all data associated with it, and creates a new issue if an event with the same fingerprint happens again. Alerts and workflow notifications for this new issue behave just like notifications for any new issue.
    - Delete & Discard - when you delete and discard an issue, all notifications for the issue will stop
    - Ignore - While an issue is ignored, all alerts for that issue are muted. You can also ignore an issue until certain conditions are met — for example, "ignore for 30 minutes." Keep in mind; **an ignored issue will still count towards your quota.**