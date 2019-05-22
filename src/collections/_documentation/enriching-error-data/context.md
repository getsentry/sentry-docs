---
title: Context
sidebar_order: 0
example_tag_name: page_locale
example_tag_value: de-at
example_user_email: 'john.doe@example.com'
example_extra_key: character_name
example_extra_value: 'Mighty Fighter'
---

Sentry supports additional context with events. Often this context is shared amongst any issue captured in its lifecycle, and includes the following components:

**Structured Contexts**

: Specific structured contexts (OS info, runtime information etc.).  This is normally set automatically.

[**User**](#capturing-the-user)

: Information about the current actor

[**Tags**](#tagging-events)

: Key/value pairs which generate breakdowns charts and search filters

[**Level**](#setting-the-level)

: An event's severity 

[**Fingerprint**](#setting-the-fingerprint)

: A value used for grouping events into issues

[**Unstructured Extra Data**](#extra-context)

: Arbitrary unstructured data which is stored with an event sample

{% capture __alert_content -%}
Sentry will try it's best to accommodate the data you send it, but large context payloads will be trimmed or may be truncated entirely. For more details see the [data handling SDK documentation]({%- link _documentation/development/sdk-dev/data-handling.md -%})
{%- endcapture -%}
{%- include components/alert.html
  title="Context Size Limits"
  content=__alert_content
%}

## Capturing the User

Sending users to Sentry will unlock a number of features, primarily the ability to drill down into the number of users affecting an issue, as well to get a broader sense about the quality of the application.

Capturing the user is fairly straight forward:

{% include components/platform_content.html content_dir='set-user' %}

Users consist of a few key pieces of information which are used to construct a unique identity in Sentry. Each of these is optional, but one **must** be present in order for the user to be captured:

`id`

: Your internal identifier for the user.

`username`

: The username. Generally used as a better label than the internal ID.

`email`

: An alternative to a username (or addition). Sentry is aware of email addresses and can show things like Gravatars, unlock messaging capabilities, and more.

`ip_address`

: The IP address of the user. If the user is unauthenticated providing the IP address will suggest that this is unique to that IP. We will attempt to pull this from HTTP request data if available.

Additionally you can provide arbitrary key/value pairs beyond the reserved names and those will be stored with the user.

## Tagging Events

Sentry implements a system it calls tags. Tags are various key/value pairs that get assigned to an event, and can later be used as a breakdown or quick access to finding related events.

Most SDKs generally support configuring tags by configuring the scope:

{% include components/platform_content.html content_dir='set-tag' %}

Several common uses for tags include:

-   The hostname of the server
-   The version of your platform (e.g. iOS 5.0)
-   The user’s language

Once you’ve starting sending tagged data, you’ll see it show up in a few places:

-   The filters within the sidebar on the project stream page.
-   Summarized within an event on the sidebar.
-   The tags page on an aggregated event.

We’ll automatically index all tags for an event, as well as the frequency and the last time a value has been seen. Even more so, we keep track of the number of distinct tags, and can assist in you determining hotspots for various issues.

## Setting the Level

You can set the severity of an event to one of five values: 'fatal', 'error', 'warning', 'info', and 'debug'. ('error' is the default.) 'fatal' is the most severe and 'debug' is the least.

{% include components/platform_content.html content_dir='set-level' %}

## Setting the Fingerprint

Sentry uses one or more "fingerprints" to decide how to group errors into issues. More information can be found [here]({%- link _documentation/data-management/rollups.md -%}#custom-grouping).

## Extra Context

In addition to the structured context that Sentry understands, you can send arbitrary key/value pairs of data which will be stored alongside the event. These are not indexed and are simply used to add additional information about what might be happening:

{% include components/platform_content.html content_dir='set-extra' %}

**Be aware of maximum payload size** - There are times, when you may want to send the whole application state as extra data.
This is not recommended as application state can be very large and easily exceed the 200kB maximum that Sentry has on individual event payloads.
When this happens, you'll get an `HTTP Error 413 Payload Too Large` message as the server response or (when `keepalive: true` is set as `fetch` parameter), the request will stay in the `pending` state forever (eg. in Chrome).


## Unsetting Context

Context is held in the current scope and thus is cleared out at the end of each operation (request etc.). You can also push and pop your own scopes to apply context data to a specific codeblock or function.

For more information [have a look at the scopes and hub documentation]({%- link
_documentation/enriching-error-data/scopes.md -%}).
