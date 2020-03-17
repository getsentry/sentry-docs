---
title: Alerts & Notifications
sidebar_order: 0
---

{% capture __alert_content -%}
Sentry's Performance features are currently in beta. For more details about access to these features, feel free to reach out at [https://sentry.io/for/performance/](https://sentry.io/for/performance/).
{%- endcapture -%}
{%- include components/alert.html
    title="Note"
    content=__alert_content
    level="warning"
%}

Sentry notifications are broadly categorized into alerts and non-alert notifications. Alerts can be sent to many supported [LINK: integrations]. Non-alert notifications only go to email.

## Alerts

Sentry provides both Metric Alerts and Issue Alerts. You define either type of alert per project.

### Metric Alerts

Metric alerts allow you to filter and set thresholds on all errors across a project. Use metric alerts for high-level monitoring of patterns or fine-grained monitoring of individual events. Metric alerts help express lightweight service-level objectives (SLOs) such as users affected by signup-page errors or volume of database errors.

### Issue Alerts

Issue alerts fire whenever any issue in the project matches the specified criteria, such as a resolved issue re-appearing or an issue affecting many users.

For more details, see the [LINK: full documentation on Issue Alerts].

[ screenshot of Alerts in-app ]

Some alert settings apply at the project level (for example, to all alerts in the project), while others are specific to the alert. You can also tweak your personal alerts settings to control which alerts you receive.

## Non-Alert Notifications

Non-alert notifications are all other types of Sentry notifications such as:

- Workflow notifications: activity involving user actions and state changes on issues and alerts. This includes things like resolution, assignment, comments, and regressions.
- Deploy notifications: when a release is deployed [LINK: deploy docs], Sentry automatically sends an email to users who have committed to the release.
- Quota & Usage notifications: emails about quota approaching/exceeded and spike protection

For more details, see the [LINK: full documentation on Notifications].

[ screenshot of Notifications in-app ]
