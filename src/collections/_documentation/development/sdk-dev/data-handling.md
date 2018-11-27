---
title: 'Data Handling'
sidebar_order: 5
---

Data handling is the standardized context in how we want SDKs help users filter data.

## Sensitive Data

In older SDKs you might sometimes see elaborate constructs to allow the user to strip away sensitive data. Newer SDKs no longer have this feature as it turned out to be too hard to maintain per-SDK. Instead, only two simple config options are left:

- [_send-default-pii_]({%- link _documentation/error-reporting/configuration/index.md -%}#send-default-pii) is **disabled by default**, meaning that data that is naturally sensitive is not sent by default. That means, for example:

  - When attaching HTTP requests to events, "raw" bodies (bodies which cannot be parsed as JSON or formdata) are removed, and known sensitive headers such as `Authentication` or `Cookies` are removed too.

  - User-specific information (e.g. the current user ID according to the used webframework) is not sent at all.

  - Note that if a user explicitly sets a request on the scope, nothing is stripped from that request. The above rules only apply to integrations that come with the SDK.

- [_before-send_]({%- link _documentation/error-reporting/configuration/index.md -%}#before-send) can be used to register a callback with custom logic to remove sensitive data.

## Variable Size

Most arbitrary values in Sentry have their size restricted. This means any values that are sent as metadata (such as variables in a stacktrace) as well as things like extra data, or tags.

-   Mappings of values (such as HTTP data, extra data, etc) are limited to 50 item pairs.
-   Event IDs are limited to 32 characters.
-   Tag keys are limited to 32 characters.
-   Tag values are limited to 200 characters.
-   Culprits are limited to 200 characters.
-   Most contextual variables are limited to 512 characters.
-   Extra contextual data is limited to 4096 characters.
-   Messages are limited to ~10kb.
-   HTTP data (the body) is limited to 2048 characters.
-   Stacktraces are limited to 50 frames. If more are sent, data will be removed from the middle of the stack.
