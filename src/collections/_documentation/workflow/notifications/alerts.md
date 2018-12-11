---
title: 'Alerts'
sidebar_order: 1
---

Alerts are configured per project and are based on the rules defined for that project. To modify the rules visit your **Project Settings** > **Alerts** > **Rules** tab. On this page you’ll see a list of all active rules and can add alert rules or modify existing rules.

### Conditions

Rules provide several conditions that you’re able to configure. These are fairly self-explanatory and range from simple state changes to more complex filters on attributes.

For example, at Sentry we send a notification every single time an error happens and the affected user’s email address ends with `@sentry.io`. 

> [{% asset alert-rules.png %}]({% asset alert-rules.png @path %})

Additional conditions exist for things like [issue state]({%- link _documentation/workflow/notifications/index.md -%}#issue-states) changes and event attributes.

### Actions

Currently there are 3 types of actions you can take:

> [{% asset alert-actions.png %}]({% asset alert-actions.png @path %})

An example use-case might be that you want a specific kind of error to send via Slack, but you want everything to send via Mail.