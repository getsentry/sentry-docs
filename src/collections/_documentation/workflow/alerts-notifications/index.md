---
title: Alerts & Notifications
sidebar_order: 0
---

Sentry notifications are broadly categorized into alerts and non-alert notifications. Alerts can be sent to many supported [integrations]({%- link _documentation/workflow/integrations/index.md -%}#webhook-alerts). Non-alert notifications only go to email.

## Alerts

Issue Alerts warn you about problematic _individual Sentry Issues_. An issue alert fires once for every _issue_ that matches its conditions.

Metric Alerts allow you to filter, aggregate, and set thresholds across _all events in your project_, regardless of the Sentry Issue.

### Metric Alerts

{% capture __alert_content -%}
Metric Alerts are currently in beta and available for [Team and Business plans](https://sentry.io/pricing/). For more information about access to Metric Alerts, feel free to reach out at [alerting-feedback@sentry.io](mailto:alerting-feedback@sentry.io).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Use Metric Alerts to:
- Alert on service-level metrics. Is my service affecting more than X users?
- Alert on events across issues. How many errors on the signup page?
- Alert when a metric goes below a threshold. For example, when the number of active users has drastically dropped.
- Create alerts more quickly and intuitively, using a visual interface that allows you to explore and refine.

For more details, see the [full documentation on Metric Alerts]({%- link _documentation/workflow/alerts-notifications/alerts.md -%}#metric-alerts).

### Issue Alerts

Use Issue Alerts to:
- Alert when an individual issue is problematic. Any new bug on the checkout page? Any single issue affecting more than X users?
- Alert on issue-specific concepts. For example, new issues and regressions.
- Combine multiple conditions with the `OR` and `NONE` operators.
- Alert based on [Issue Owner rules]({%- link _documentation/workflow/issue-owners.md -%}).

For more details about Issue Alerts, see the [full documentation on Issue Alerts]({%- link _documentation/workflow/alerts-notifications/alerts.md -%}#issue-alerts).

{% capture __alert_content -%}
Some alert settings apply to all the alerts at the project level. Other alert settings are specific to the alert. You can tweak your [personal alerts settings]({%- link _documentation/workflow/alerts-notifications/alerts.md -%}#alert-subscription) to control which alerts you receive.
{%- endcapture -%}
{%- include components/alert.html
    content=__alert_content
%}

## Non-Alert Notifications

Non-alert notifications are all other types of Sentry notifications such as:

- Workflow notifications - Activity involving user actions and state changes on issues and alerts. This includes things like resolution, assignment, comments, and regressions.
- Deploy notifications - When a release is [deployed]({%- link _documentation/workflow/alerts-notifications/notifications.md -%}#deploy), Sentry automatically sends an email to users who have committed to the release.
- Quota & Usage notifications -  Emails about quota approaching/exceeded and spike protection

For more details, see the [full documentation on Notifications]({%- link _documentation/workflow/alerts-notifications/notifications.md -%}).
