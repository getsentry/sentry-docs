---
title: 'Quotas & Events'
sidebar_order: 0
---

Events and quotas are interconnected in Sentry. At the most basic, when you [subscribe to Sentry](https://sentry.io/pricing/), you pay for the number of events - errors, attachments, and transactions - to be tracked. Each of these type of events has a quota. When Sentry accepts an event, it counts toward your quota for that type of event.

Sentry’s flexibility means you can exercise fine-grained control over which events count toward your quota.

## Key Terms

Let’s clarify a few terms to start:

-   Event - an event is one instance of you sending Sentry data. Generally, this data is an error. Every event has a set of characteristics, called its fingerprint.
-   Issue - an issue is a grouping of similar events, which all share the same fingerprint. For example, Sentry groups events together when they are triggered by the same part of your code. For more information, see [Grouping & Fingerprinting](https://docs.sentry.io/data-management/event-grouping/).
-   Attachment - Attachments are files uploaded in the same request, such as log files. Unless the option to store crash reports is enabled, Sentry will use the files only to create the event, and then drop the files. 
-   Transaction - A transaction represents a single instance of a service being called to support an operation you want to measure or track, like a page load.
-   Quota - your quota is the monthly number of events - errors, attachments, and transactions - you pay Sentry to track.

## What Counts Toward My Quota, an Overview

Sentry completes a thorough evaluation of each event to determine if it counts toward your quota, as outlined in this overview. Detailed documentation for each evaluation is linked throughout. Before completing any of these evaluations, Sentry confirms that each event includes a valid DSN and project as well as whether the event can be parsed. In addition, for error events, Sentry validates that the event contains valid fingerprint information. If any of these items are missing or incorrect, the event is rejected.

1. **SDK configuration**

      The SDK configuration either allows the event or filters the event out. For more information, see [Outbound Filters in our guide to Manage Your Event Stream](/accounts/quotas/manage-event-stream-guide/#outbound-filters) or [Filtering Events](/error-reporting/configuration/filtering/).

2. **SDK sample rate**

      If a sample rate is defined for the SDK, the SDK evaluates whether this event should be sent as a representative fraction of events. Setting a sample rate is documented for each SDK. The SDK sample rate is not dynamic; changing it requires re-deployment. In addition, setting an SDK sample rate limits visibility into the source of events. Setting a rate limit for your project may better suit your needs.

3. **Quota availability**

      Events that exceed your quota are not sent. To add to your quota or review what happens when you exceed it, see [Increasing Quotas](/accounts/quotas/#increasing-quotas).

4. **Event repetition**
  -   If you have intervened to Delete and Discard an issue, then _future_ events with the same fingerprint do not count toward your quota.
  -   If the previous event was resolved, this event counts toward your quota because it may represent a regression in your code.
  -   If you have intervened to ignore alerts about events with the same fingerprint, this event counts toward your quota because the event is still occurring. For more information, see [Inbound Filters](/accounts/quotas/#inbound-data-filters).

5. **Spike protection**

      Sentry’s spike protection prevents huge overages from consuming your event capacity; spike protection is not currently available for transactions. For more information, see [Spike Protection](/accounts/quotas/#spike-protection).

In addition, depending on your project’s configuration and the plan you subscribe to, Sentry may also check:

6. **Rate limit for the project**

      If the error event rate limit for the project has been exceeded, and your subscription allows, the event will not be counted. For more information, see [Rate Limiting in our guide to Manage Your Event Stream](/accounts/quotas/manage-event-stream-guide/#4-rate-limiting) or  [Rate Limiting Projects](/accounts/quotas/#id1).

7. **Inbound filters**

      If any inbound filter is set for this type of error event, and your subscription allows, the event will not be counted. For more information, see [Inbound Filters in our guide to Manage Your Event Stream](/accounts/quotas/manage-event-stream-guide/#inbound-data-filters) or [Inbound Data Filter](/accounts/quotas/#inbound-data-filters).

After these checks are processed, the event counts toward your quota. It is accepted into Sentry, where it persists and is stored.

{% include components/alert.html
    title="Note"
    content="If the event exceeds 200KB compressed or 1MB decompressed for events and 20MB compressed or 50 MB decompressed for minidump uploads (all files combined), the event will be rejected."
    level="warning"
%}

## What Counts Toward my Quota, Table View

<table>
  <tbody>
    <tr>
    <td>
      <strong>  </strong>
    </td>
      <td>
        <strong>Yes, this event counts</strong>
      </td>
      <td>
        <strong>No, this event does not count</strong>
      </td>
    </tr>
    <tr>
      <td>SDK configuration</td>
      <td>Not set</td>
      <td>Set to filter this event</td>
    </tr>
    <tr>
      <td>SDK sample rate</td>
      <td>Not set</td>
      <td>Set</td>
    </tr>
    <tr>
      <td>Quota</td>
      <td>Not reached</td>
      <td>Exceeded</td>
    </tr>
    <tr>
      <td>Are <i>future</i> error events that repeat set to Delete & Discard?</td>
      <td>No</td>
      <td> </td>
    </tr>
    <tr>
      <td>Is this repeated event resolved?</td>
      <td>Yes, this may be a regression in your code</td>
      <td> </td>
    </tr>
    <tr>
      <td>Is this repeated event set to Ignore Alert?</td>
      <td>Yes, it is still occurring</td>
      <td> </td>
    </tr>
    <tr>
      <td>Has spike protection been triggered?</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>Rate limit for error events for the project</td>
      <td>Not set <i>or</i> not reached</td>
      <td>Set <i>and</i> exceeded</td>
    </tr>
    <tr>
      <td>Inbound Filters</td>
      <td>Not set</td>
      <td>Set for this error event</td>
    </tr>
  </tbody>
</table>

{% include components/alert.html
    title="Note"
    content="Delete and discard and per-project rate limits are available only for Team and Business plans"
    level="warning"
%}

## Increasing Quotas

Add to your quota at any time during your billing period, either by upgrading to a higher tier or by increasing your on-demand capacity. While the available plans fit most individual and business needs, Sentry is designed to handle large throughput. If your team needs more, we’re happy to help. Reach out to our sales team at [sales@sentry.io](mailto:sales%40sentry.io) to learn more about increasing capacity.

If you’ve exceeded your quota threshold, the server will respond with a 429 HTTP status code. However, if this is your first time exceeding quota, you'll be entered into a one-time grace period. For more information, see this [Help article](https://help.sentry.io/hc/en-us/articles/115000154554-What-happens-when-I-run-out-of-event-capacity-and-a-grace-period-is-triggered-). In addition, you can specify a spending cap for on-demand capacity if you need additional events; for example, if you’re rolling out a new version and anticipate more events this month. For more information, see [On-Demand Spending Cap](/accounts/pricing/#on-demand-cap).

## Limiting Events

### Error Event Limits {#id1}

Per-key rate limits allow you to set the maximum volume of error events a key will accept during a period of time.

For example, you may have a project in production that generates a lot of noise. A rate limit allows you to set the maximum amount of data to “500 events per minute”. Additionally, you can create a second key for the same project for your staging environment, which is unlimited, ensuring your QA process is still untouched.

To set up rate limits, navigate to **[Project] » Client Keys » Configure**. Select an individual key or create a new one, then you’ll be able to define a rate limit as well as view a breakdown of events received by that key. For additional information and examples, see [Rate Limiting in our guide to Manage Your Event Stream](/accounts/quotas/manage-event-stream-guide/#4-rate-limiting).

{% include components/alert.html
    title="Note"
    content="Per-key rate limiting is available only for Team and Business plans"
    level="warning"
%}

### Attachment Limits

If you have enabled the storage of crash reports, you may set limits for the maximum number of crash reports that will be stored per issue. To set up these limits, use the slider in the "Store Native Crash Reports" option for your organization's **Security and Privacy Settings**.

## Inbound Filters {#inbound-data-filters}

In some cases, the data you’re receiving in Sentry is hard to filter, or you don’t have the ability to update the SDK’s configuration to apply the filters. Sentry provides several methods to filter data server-side, which apply before checking for potential rate limits. Inbound filters include:

-     Common browser extension errors
-     Events coming from localhost
-     Known legacy browsers errors
-     Known web crawlers
-     By their error message
-     From specific release versions of your code
-     From certain IP addresses.

Explore these by navigating to **[Project] » Project Settings » Inbound Filters**. Commonly-set filters are discussed here for your quick reference. For additional information and examples, see [Inbound Data Filters in our guide to Manage Your Event Stream](/accounts/quotas/manage-event-stream-guide/#inbound-data-filters). Commonly-set filters include:

*IP Filters.* If you have a rogue client, Sentry supports blocking an IP from sending data. Navigate to **[Project] » Project Settings » Inbound Filters** to add the IP addresses (or subnets) to **Filter errors from these IP addresses**.

*Filter by Release.* If you discover a problematic release causing excessive noise, Sentry supports ignoring all events from that release. Navigate to **[Project] » Project Settings » Inbound Filters**, then add the releases to **Filter errors from these releases**.

{% include components/alert.html
    title="Note"
    content="Filter by release is available only for Team and Business plans"
    level="warning"
%}

*Filter by Error Message.* Sentry supports filtering out a specific or certain kind of error as well. Navigate to **[Project] » Project Settings » Inbound Filters**, then add the error message to **Filter errors by error message**.

{% include components/alert.html
    title="Note"
    content="Filter by error message is available only for Team and Business plans"
    level="warning"
%}

*Filter by Issue.* When you are unable to take immediate action on an issue, but it continues to occur, Sentry supports deleting and discarding that issue from the issue details page. Navigate to **[Project] » Project Settings » Inbound Filters**, then click “delete and discard future events.” This setting deletes most data associated with the issue and filters out matching events before they count against your quota.

{% include components/alert.html
    title="Note"
    content="Deleting and discarding issues is available only for Team and Business plans"
    level="warning"
%}

## Spike Protection

A spike is both a **large** and **temporary** increase in event volume. Sentry's spike protection prevents huge overages from consuming your event capacity. We use your historical event volume to implement a dynamic rate limit which discards events when you hit its threshold. This dynamic rate limit is designed to protect you from short-term spikes. The threshold will increase if your increased volume persists for many hours.

When spike protection is activated, we limit the number of events accepted in any minute to:

`maximum(20, 6 x average events per minute over the last 24 hours)`

_The 24 hour window ends at the beginning of the current hour, not at the current minute._

What this means is that if you experience a spike, we will temporarily protect you, but if the increase in volume is sustained, the spike protection limit will gradually increase until Sentry finally accepts all events.

### How Does Spike Protection Help? {#how-does-spike-protection-help}

Because Sentry bills on monthly event volume, spikes can consume your Sentry capacity for the rest of the month. If it really is a spike, spike protection drops events during the spike to try and conserve your capacity. We also send an email notification to the Owner when spike protection is activated.

## Attribute Limits

Sentry imposes hard limits on various components within an event. While the limits may change over time and vary among attributes, most individual attributes are capped at 512 characters. Additionally, certain attributes also limit the maximum number of items. Commonly-trimmed values might include, for example:

-     Stack frame details. Stack traces with large frame counts will be trimmed (the middle frames are dropped). We limit to a maximum of 250 frames. Only 50 are retained unaltered, with the remaining 200 removing `vars`, `pre_context` and `post_context`.
-     `extra` data is limited to approximately 256k characters, and each item is capped at approximately 16k characters.
-     Breadcrumbs and their values
-     Error messages and message parameters are limited to 1024 characters.
