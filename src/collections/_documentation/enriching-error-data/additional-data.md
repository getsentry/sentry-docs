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

[Predefined data](#predefined-data) is data that Sentry recognizes and uses to enhance the user experience. For example, Sentry's concept of a user lets us show how many unique users are affected by an issue. Sentry automatically captures predefined data where possible, such as information about the browser, HTTP request, and OS in the browser JavaScript SDK.

[Custom data](#custom-data) is arbitrary structured or unstructured extra data you can attach to your event.

## Tags & Context

Whether predefined or custom, additional data can take two forms in Sentry: tags and context.

Tags are key/value string pairs that are indexed and searchable. They power UI features like filters and tag-distribution maps.

[{% asset additional-data/tags.png alt="All tags and their related values." %}]({% asset additional-data/tags.png @path %})

Context includes additional diagnostic information attached to an event. By default, contexts are not searchable, but for convenience Sentry turns information in some predefined contexts into tags, making them searchable.

[{% asset additional-data/predefined_contexts.png alt="Predefined data such as the name and version." %}]({% asset additional-data/predefined_contexts.png @path %})

## Predefined Data

The most common types of predefined data (where applicable) are level, [release](/workflow/releases/), [environment](/enriching-error-data/environments/), logger, [fingerprint](/data-management/event-grouping/), user, request, device, OS, runtime, app, browser, gpu, monitor, and [traces](/performance-monitoring/distributed-tracing/).

To improve searchability, Sentry will turn the data or specific attributes on the data into tags. For example, `level` is available as a tag, and so is a user's email via the `user.email` tag. If Sentry is captures some predefined data but doesn't expose it as a tag, you can always set a [custom tag](#tags) for it.

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

For more details about how to set predefined properties, see the [platform-specific documentation](/platforms/).

## Custom Data

You can attach arbitrary custom data to an event as tags or context.

### Tags

As mentioned, tags are searchable key/value pairs attached to events that are used in several places: filtering issues, quickly accessing related events, seeing the tag distribution for a set of events, etc. Common uses for tags include hostname, platform version, and user language.

Most SDKs support configuring tags by configuring the scope:

{% include components/platform_content.html content_dir='set-tag' %}

Sentry promotes several pieces of predefined data to tags. We strongly recommend you don't set custom tags with these reserved names. But if you do, you can search for them with a [special tag syntax](/workflow/search/).

### Context

Custom contexts allow you to attach arbitrary data (strings, lists, dictionaries) to an event. These are unsearchable, but are viewable on the issue page.

[{% asset additional-data/additional_data.png alt="Custom contexts as viewed on the Additional Data section of an event." width="500"%}]({% asset additional-data/additional_data.png @path %})

{% include components/platform_content.html content_dir='set-extra' %}

In the past, custom context was called "extra" and set via a method like setExtra(), which is deprecated.

Custom data set using `setExtra` appears in the "Additional Data" section of an event. By contrast, each key set using `setContext` gets its own section on the issue page, with the section title being the key name.

For more details about predefined and custom contexts, see the [full documentation on Context Interface](https://develop.sentry.dev/sdk/event-payloads/contexts). 

### Context Size Limits

Maximum payload size: There are times when you may want to send the whole application state as extra data. Sentry doesn't recommend this as the application state can be extensive and easily exceed the 200kB maximum that Sentry has on individual event payloads. When this happens, you’ll get an `HTTP Error 413 Payload Too Large` message as the server response (when `keepalive: true` is set as `fetch` parameter), or the request will stay in the `pending` state forever (for example, in Chrome).

Sentry will try its best to accommodate the data you send, but Sentry will trim large context payloads or truncate the payloads entirely. 

For more details, see the [full documentation on SDK data handling](https://develop.sentry.dev/sdk/data-handling/).

### Unsetting Context

Sentry holds context in the current scope, and thus context clears out at the end of each operation (for example, requests). You can also push and pop your scopes to apply context data to a specific code block or function.

For more details, see the [full documentation on Scopes and Hubs](/enriching-error-data/scopes/).

## Debugging Additional Data

You can view the JSON payload of an event to see how Sentry stores additional data in the event. The shape of the data may not exactly match the description above because our thinking around additional data has evolved faster than the protocol.

[{% asset additional-data/event_JSON.png alt="Red box highlighting where to find the JSON connected to an event." width="400"%}]({% asset additional-data/event_JSON.png @path %})

For more details, see the [full documentation on Event Payload](https://develop.sentry.dev/sdk/event-payloads/).
