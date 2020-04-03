---
title: Additional Data
sidebar_order: 0
example_tag_name: page_locale
example_tag_value: de-at
example_user_email: 'john.doe@example.com'
example_extra_key: character_name
example_extra_value: 'Mighty Fighter'
---

Additional data attached to an event can be predefined or custom.

[LINK: Predefined data] is data that Sentry recognizes and uses to enhance the user experience. For example, Sentry's concept of a user lets us show how many unique users are affected by an issue. Sentry automatically captures predefined data where possible, such as information about the browser, HTTP request, and OS in the browser Javascript SDK.

[LINK: Custom data] is arbitrary structured or unstructured extra data you can attach to your event.

## Tags & Context

Whether predefined or custom, additional data can take two forms in Sentry: tags and context.

Tags are key/value string pairs that are indexed and searchable. They power UI features like filters and tag-distribution heat maps.

![Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_19.37.28.png](Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_19.37.28.png)

Context includes additional diagnostic information attached to an event. By default, contexts are not searchable, but for convenience Sentry turns information in some predefined contexts into tags, making them searchable.

![Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_19.38.02.png](Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_19.38.02.png)

## Predefined Data

The most common types of predefined data (where applicable) are level, [LINK: [release](https://docs.sentry.io/workflow/releases/)], [LINK: [environment](https://docs.sentry.io/enriching-error-data/environments/)], logger, [LINK: [fingerprint](https://docs.sentry.io/data-management/event-grouping/)], user, request, device, OS, runtime, app, browser, gpu, monitor, and [LINK: [traces](https://docs.sentry.io/performance/distributed-tracing/)].

To improve searchability, Sentry will turn the data or specific attributes on the data into tags. For example, `level` is available as a tag, and so is a user's email via the `user.email` tag. If Sentry is captures some predefined data but doesn't expose it as a tag, you can always set a [custom tag](https://www.notion.so/sentry/Docs-Additional-Data-2ff7bd7298fb4203bcd9f3dc09478517#7164a6944427436b95d657e30f0f490c) for it.

### Capturing the User

Capturing the user unlocks several features, primarily the ability to look at the users being affected by an issue, as well to get a broader sense of the quality of the application.

{% include components/platform_content.html content_dir='set-user' %}

Users are applied to construct a unique identity in Sentry. Each of these is optional, but one **must** be present for Sentry to collect data about the user:

`id`

: Your internal identifier for the user.

`username`

: The username. Generally used as a better label than the internal ID.

`email`

: An alternative (or addition) to a username. Sentry recognizes email addresses and can show things like Gravatars, unlock messaging capabilities, etc.

`ip_address`

: The IP address of the user. If the user is unauthenticated, Sentry uses the IP address as a unique identifier for the user. Sentry will attempt to pull this from HTTP request data, if available.

Additionally, you can provide arbitrary key/value pairs beyond the reserved names, and Sentry will store those with the user, but the arbitrary key/value pairs are unsearchable.

### Setting the Level

You can set the severity of an event to one of five values: `fatal`, `error`, `warning`, `info`, and `debug`. `error` is the default, `fatal` is the most severe, and `debug` is the least severe.

{% include components/platform_content.html content_dir='set-level' %}

For more details about how to set predefined properties, see the [LINK: [platform-specific](https://docs.sentry.io/platforms/)] documentation.

## Custom Data

You can attach arbitrary custom data to an event as tags or context.

### Tags

As mentioned, tags are searchable key/value pairs attached to events that are used in several places: filtering issues, quickly accessing related events, seeing the tag distribution for a set of events, etc. Common uses for tags include hostname, platform version, and user language.

Most SDKs support configuring tags by configuring the scope:

{% include components/platform_content.html content_dir='set-tag' %}

Sentry promotes several pieces of predefined data to tags. We strongly recommend you don't set custom tags with these reserved names. But if you do, you can search for them with a [special tag syntax](https://docs.sentry.io/workflow/search/?platform=javascript#explicit-tag-syntax).

### Context

Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event. These are unsearchable, but are viewable in the "Additional Data" section of an event.

![Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_19.36.34.png](Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_19.36.34.png)

{% include components/platform_content.html content_dir='set-extra' %}

In the past, custom context was called "extra" and set via a method like setExtra(), which is deprecated.

### Context Size Limits (TO REVIEW)

Maximum payload size: There are times when you may want to send the whole application state as extra data. Sentry doesn't recommend this as the application state can be extensive and easily exceed the 200kB maximum that Sentry has on individual event payloads. When this happens, you’ll get an `HTTP Error 413 Payload Too Large` message as the server response (when `keepalive: true` is set as `fetch` parameter), or the request will stay in the `pending` state forever (for example, in Chrome).

Sentry will try its best to accommodate the data you send, but Sentry will trim large context payloads or truncate the payloads entirely. For more details, see the [LINK: [data handling SDK documentation](https://docs.sentry.io/development/sdk-dev/data-handling/)].

### Unsetting Context

Sentry holds context in the current scope, and thus context clears out at the end of each operation (for example, requests). You can also push and pop your scopes to apply context data to a specific code block or function.

For more information, [have a look at the scopes and hub documentation](https://docs.sentry.io/enriching-error-data/scopes/).

## Debugging Additional Data

You can view the JSON payload of an event to see how Sentry stores additional data in JSON form. The shape of the data may not exactly match the description above because our thinking around additional data has evolved faster than the protocol.

![Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_13.35.04.png](Content%20Freeze%20DON%20T%20add%20content%20Docs%20Additional%20D/Screenshot_2020-03-28_13.35.04.png)

For more details about event payload, see the [LINK: [full Event Payload documentation](https://docs.sentry.io/development/sdk-dev/event-payloads/)].
