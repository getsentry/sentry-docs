Sentry supports additional context with events. Often this context is shared
among any issue captured in its lifecycle, and includes the following
components:

**Structured Contexts**

: Structured contexts are typically set automatically.

[**User**](#capturing-the-user)

: Information about the current actor.

[**Tags**](#tagging-events)

: Key/value pairs which generate breakdown charts and search filters.

[**Level**](#setting-the-level)

: An event's severity.

[**Fingerprint**](#setting-the-fingerprint)

: A value used for grouping events into issues.

[**Unstructured Extra Data**](#extra-context)

: Arbitrary unstructured data which the Sentry SDK stores with an event sample.

{% capture __alert_content -%}
Sentry will try its best to accommodate the data you send it, but large context
payloads will be trimmed or may be truncated entirely. For more details see the
[data handling SDK documentation](https://develop.sentry.dev/sdk/data-handling/)
{%- endcapture -%}
{%- include components/alert.html
  title="Context Size Limits"
  content=__alert_content
  level="warning"
%}
