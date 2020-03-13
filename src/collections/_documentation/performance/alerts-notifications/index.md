---
title: Alerts & Notifications
sidebar_order: 0
---

[ALERT BOX: Sentry's Application Performance Monitoring (APM) features are currently in beta. For more details about APM access, feel free to reach out at [https://sentry.io/for/apm/](https://sentry.io/for/apm/). ]

Sentry notifications are broadly categorized into alerts and non-alert notifications. Alerts can be sent to many supported [LINK: integrations]. Non-alert notifications only go to email.

## Alerts

Alerts are configured per-project and are of two types: Metric Alerts and Issue Alerts.

### Metric Alerts

Metric alerts allow you to filter and set thresholds across all errors in a project. They can be used for high-level monitoring of patterns, or fine-grained monitoring of individual events. Metric alerts help express lightweight service-level objectives (SLOs) such as users affected by signup-page errors, or volume of database errors. For more details, see the [LINK: full documentation on Metric Alerts].

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
