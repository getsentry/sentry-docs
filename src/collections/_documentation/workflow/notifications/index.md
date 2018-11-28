---
title: Notifications
sidebar_order: 2
---

Notifications in Sentry can be routed to many supported [integrations]({%- link _documentation/workflow/integrations/index.md-%}), but by default are aimed at email. Notifications fall into two categories:

[Alerts]({%- link _documentation/workflow/notifications/alerts.md -%})

: Generated based upon a project’s alert rules. By default this is only when a new issue is seen.

[Workflow]({%- link _documentation/workflow/notifications/workflow.md -%})

: All activity related to user actions such as resolution, comments, and automatic regressions.

Each category has its own set of configuration and subscription options. By default you’ll be subscribed to everything, but this can be changed via your [account settings](https://sentry.io/settings/account/notifications/). Read about [notification management]({%- link _documentation/workflow/notifications/notification-management.md -%}) for more information.

## Issue States

Sentry provides a few states for each event, which greatly impact how notifications work:

Unresolved

: The default state when an event is added to the system.

Resolved

: An event is marked as resolved when an individual resolves it or when the project’s _auto resolve_ feature is configured.

Ignored

: An event will not send alerts. Additionally the default filter only shows unresolved events, so ignored events would be hidden. Search for `is:ignored` to find these.
