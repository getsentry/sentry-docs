---
title: 'Quotas & Filtering'
sidebar_order: 2
---

Each subscription tier in Sentry provides different monthly quotas for your event capacity. The tiers let you pre-pay for reserved event capacity, and you can also specify a spending cap for on-demand capacity if you need additional events. When you consume your reserved and on-demand capacity for the month, the server will respond with a 429 HTTP status code when it receives an event over quota. 

## Increasing Quotas

You can add additional quota at any time during your billing period, either by upgrading to a higer tier or increasing your on-demand capacity. While the available plans will fit most individual and business needs, Sentry is designed to handle large throughput so if your team needs more, we’re happy to help. Reach out to our sales team at [sales@sentry.io](mailto:sales%40sentry.io) to learn more about increasing capacity.

## Rate Limiting Projects {#id1}

Per-key rate limits allow you to set the maximum volume of events a key will accept during a period of time.

For example, you may have a project in production that generates a lot of noise. With a rate limit you could set the maximum amount of data to “500 events per minute”. Additionally, you could create a second key for the same project for your staging environment which is unlimited, ensuring your QA process is still untouched.

To setup rate limits, navigate to the Project you wish to limit, go to **[Project] » Client Keys » Configure**. Select an individual key or create a new one, and you’ll be able to define a rate limit as well as see a breakdown of events received by that key.

{% capture __alert_content -%}
Per-key rate limiting is available only on Business and Enterprise Plans
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Inbound Filters {#inbound-data-filters}

In some cases, the data you’re receiving in Sentry is hard to filter, or you simply don’t have the ability to update the SDK’s configuration to apply the filters. Due to this Sentry provides several ways to filter data server-side, which will also apply before any rate limits are checked.

### Built-in Filters

Various built-in filters are available within Sentry. You can find these by going to **[Project] » Project Settings » Inbound Filters**. Each filter caters to specific situations, such as web crawlers or old browsers, and can be enabled as needed by the specific application.

### IP Blocklist

If you have a rogue client, you may find yourself simply wanting to block that IP from sending data. Sentry supports this by going to **[Project] » Project Settings » Inbound Filters** and adding the IP addresses (or subnets) under the **Filter errors from these IP addresses** section.

### Filter by releases

In the case you have a problematic release that is causing an excessive amount of noise, you can ignore all events from that release. Sentry supports this by going to **[Project] » Project Settings » Inbound Filters** and adding the releases under the **Filter errors from these releases** section.

{% capture __alert_content -%}
Filter by releases is available only on Business and Enterprise Plans
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

### Filter by error message

You can ignore a specific or certain kind of error by going to **[Project] » Project Settings » Inbound Filters** and adding the error message under the **Filter errors by error message** section.

{% capture __alert_content -%}
Filter by error message is available only on Business and Enterprise Plans
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

### Filter by issue

If there is an issue that you are unable to take action on but that continues to occur, you can delete and discard it from the issue details page by clicking “delete and discard future events.” This will delete most data associated with an issue and filter out matching events before they ever reach your stream. Matching events will not count towards your quota.

{% capture __alert_content -%}
Discarding issues is available only on Business and Enterprise Plans
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
%}

## Spike Protection

Spike protection helps prevent huge overages from consuming your event capacity. We use your historical event volume to implement a dynamic rate limit which discards events when you hit its threshold. This dynamic rate limit is designed to protect you from short-term spikes and the threshold will increase if your increased volume persists for many hours.

When spike protection is activated, we limit the number of events accepted in any minute to:

`maximum(20, 6 x average events per minute over the last 24 hours)`

**Note:** The 24 hour window ends at the beginning of the current hour, not at the current minute.

What this means is that if you experience a spike, we will temporarily protect you, but if the increase in volume is sustained, the spike protection limit will gradually increase until Sentry finally accepts all events.

### How does spike protection help? {#how-does-spike-protection-help}

Because Sentry bills on monthly event volume, spikes can consume your Sentry capacity for the rest of the month. If it really is a spike (**large** and **temporary** increase in event volume), spike protection drops events during the spike to try and conserve your capacity. We also send an email notification to the Owner when spike protection is activated.



### Controlling Volume

If your projects have a high volume of events, you can control how many errors Sentry receives in a few ways:

-   [Configure]({%- link _documentation/error-reporting/configuration/index.md -%}#common-options) the SDK to reduce the volume of data you’re sending
-   Turn on [Inbound Filters]({%- link _documentation/accounts/quotas.md -%}#inbound-data-filters) for legacy browsers, browser extensions, localhost, and web crawlers. Any filtered events will not count towards your quota
-   Set a [per-key rate limits]({%- link _documentation/accounts/quotas.md -%}#id1) for each DSN key in a project

## Attributes Limits

Sentry imposes hard limits on various components within an event. While the limits may change over time and vary between attributes most individual attributes are capped at 512 bytes. Additionally, certain attributes also limit the maximum number of items.

For example, `extra` data is limited to 50 items, and each item is capped at 16 KB. Similar restrictions apply to context locals (within a stack trace’s frame), as well as any similar attributes.

Generic attributes like the event’s label also have limits but are more flexible depending on their case. For example, the message attribute is limited to 1024 bytes.

The following limitations will be automatically enforced:

-   Events greater than 200k are immediately dropped.
-   Stack traces with large frame counts will be trimmed (the middle frames are dropped).
-   Collections exceeding the max items will be trimmed down to the maximum size.
-   Individual values exceeding the maximum length will be trimmed down to the maximum size.
