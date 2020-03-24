---
title: Alerts & Notifications
sidebar_order: 0
---

Sentry notifications are broadly categorized into alerts and non-alert notifications. Alerts can be sent to many supported [integrations]({%- link _documentation/workflow/integrations/index.md -%}#webhook-alerts). Non-alert notifications only go to email.

## Alerts

Sentry provides both Metric Alerts and Issue Alerts. You define either type of alert per project.

### Metric Alerts

{% capture __alert_content -%}
Metric Alerts are currently in beta. For more information about access to Metric Alerts, feel free to reach out at alerting-feedback@sentry.io.
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Metric alerts allow you to filter and set thresholds on all errors across a project. Use metric alerts for high-level monitoring of patterns or fine-grained monitoring of individual events. Metric alerts help express lightweight service-level objectives (SLOs) such as users affected by signup-page errors or volume of database errors.

### Issue Alerts

Issue alerts fire whenever **any issue** in the project matches the specified criteria, such as a resolved issue re-appearing or an issue affecting many users.

For more details, see the [full documentation on Issue Alerts]({%- link _documentation/workflow/alerts-notifications/alerts.md -%}#issue-alerts).

Some alert settings apply at the project level and to all alerts in the project. Other alert settings are specific to the alert. You can tweak your personal alerts settings to control which alerts you receive.

## Non-Alert Notifications

Non-alert notifications are all other types of Sentry notifications such as:

- Workflow notifications - Activity involving user actions and state changes on issues and alerts. This includes things like resolution, assignment, comments, and regressions.
- Deploy notifications - When a release is [deployed]({%- link _documentation/workflow/alerts-notifications/notifications.md -%}#deploy), Sentry automatically sends an email to users who have committed to the release.
- Quota & Usage notifications -  Emails about quota approaching/exceeded and spike protection

For more details, see the [full documentation on Notifications]({%- link _documentation/workflow/alerts-notifications/notifications.md -%}).
