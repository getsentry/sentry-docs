---
title: Notifications
sidebar_order: 8
---

Notifications in Sentry can be routed to many supported [_integrations_]({%- link _documentation/integrations/index.md-%}), but by default are aimed at Email. Additionally notifications are categorized into two categories:

Alerts

: Generated based upon a project’s rules. By default this is only when a new issue is seen.

Workflow

: All activity related to user actions, such as resolution, comments, and automatic regressions.

Each category has its own set of configuration and subscription options. By default you’ll be subscribed to everything, but this can be changed via your account settings.

## Issue States

Sentry provides a few states for each event, which greatly impact how notifications work:

Unresolved

: The default state when an event is added to the system.

Resolved

: An event is mark as resolved when an individual resolves it or when the project’s _auto resolve_ feature is configured.

Muted

: An event will not send alerts. Additionally the default filter only shows unresolved events, so muted events would be hidden.

## Alerts

Alerts are configured per-project and are based on the rules defined for that project. To modify the rules visit your **Project Settings**, click **Alerts**, then click the **Rules** tab. On this page you’ll see a list of all active rules.

### Conditions

Rules provide several conditions that you’re able to configure. These are fairly self explanatory and range from simple state changes (such as the defaults) to more complex filters on attributes.

For example, at Sentry we send a notification every single time an error happens and the affected user’s email address ends with `@sentry.io`. To do this we create a new rule, and we add condition:

`An events {attribute} value {match} {value}`

We then enter the attribute `user.email`, select `ends with`, and we enter `@sentry.io` for the value.

Additional conditions exist for things like rate limits and other event attributes.

### Actions

Currently only a couple of actions exist in Sentry:

-   Send a notification via all configured integrations
-   Send a notification to only a specific integration

An example use-case might be that you want a specific kind of error to send via Slack, but you want everything to send via Mail.

## Workflow

Most activity within Sentry will generate a workflow notification. These notifications are sent to anyone participating in a conversation. By default this is all members of a project, but each member may choose their participation state, as well as opt-in or opt-out of specific issues.

Core workflow notifications include:

-   Assignment
-   Comments
-   Regressions – when Sentry changes state of an issue from **resolved** to **unresolved**

