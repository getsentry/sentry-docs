---
title: Alerts & Notifications
sidebar_order: 0
---

Sentry categorizes notifications broadly into alerts and non-alert notifications. 

## Alerts

[Alerts](/workflow/alerts-notifications/alerts) notify you about problems in your application and can be sent to many supported integrations. You can set alerts on both errors and performance data.

- **Errors**: Sentry automatically groups individual error events into Issues based on stack trace and other factors. You can then set alerts on changes in those issues (such as new issues or issues affecting many users), or on the raw events (such as frequency of events with a given tag).

- **Performance**: You can alert on performance metrics like latency, apdex, failure rate, and throughput.

For more details, see the [full documentation on Alerts](/workflow/alerts-notifications/alerts).

## Non-Alert Notifications

[Non-alert notifications](/workflow/alerts-notifications/notifications) are all other types of Sentry notifications such as:

- **Workflow notifications**: Activity involving user actions and state changes on issues. This includes things like resolution, assignment, comments, and regressions.

- **Deploy notifications**: When a release is [deployed](/workflow/alerts-notifications/notifications/#deploy), Sentry automatically sends an email to users who have committed to the release.

- **Quota & Usage notifications**: Emails about quota approaching/exceeded and spike protection

For more details, see the [full documentation on Notifications](/workflow/alerts-notifications/notifications).
