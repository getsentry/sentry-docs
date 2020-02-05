---
title: Pricing
sidebar_order: 6
---

{% capture __alert_content -%}
This document aims to clarify concepts and frequently asked questions around pricing. For the breakdown of plans and prices, go to our [pricing page](https://sentry.io/pricing).
{%- endcapture -%}
{%- include components/alert.html
  title="Note"
  content=__alert_content
  level="info"
%}

## Concepts

### Events

An event is a crash report (also known as an exception or error) that’s sent to Sentry’s server for processing. Additional metadata around an event (breadcrumbs, user context, environment, etc) do not count as separate events.

### Capacity

Capacity is the total number of events sent by and billed to your organization. You can purchase capacity in two ways: on-demand and reserved.

#### On-demand Capacity

On-demand capacity is billed at the end of each billing cycle. You are charged per processed event, rounded up to the nearest cent. You have the ability to set on-demand caps so you can stay on budget. See [On-demand spending cap](#on-demand-cap) for more information.

#### Prepaid (Reserved) Capacity

Reserved capacity allows you to prepay for significant discounts. Your prepaid, reserved capacity is always applied before on-demand capacity. Unused reserved capacity expires at the end of each billing month.

Every Sentry account includes a varying amount of reserved capacity. For example, our developer plan includes 5,000 events per month.

### Billing Cycles

Three different kinds of billing periods exist on accounts.

The first is your actual **Billing Period**, which is either monthly or annual. This is when we’ll charge the credit card on file for automatic renewal.

The second is the **On-Demand Period**. The On-Demand Period reflects a one month window in which we calculate On-Demand charges.

Lastly, some plans may contain a **Contract Period** that differs from your Billing Period. For example, some plans have an **Annual Contract**, but are billed monthly. This simply means that you cannot downgrade or cancel your plan until the end of the contract period, but you’ll still be billed month-to-month.

### Billing Controls

#### On-demand spending cap {#on-demand-cap}

You can set a maximum monthly on-demand bill amount by setting an on-demand spending cap. Once you reach the spending cap, you will still be able to access Sentry and prior event data. However, any additional events you send will be rejected.

#### Rate limits

Business and Enterprise plans have the option to configure rate limits for each project that let you specify the number of events and time interval for rate limiting.

## Managing your event volume

If your projects have a high volume of events, you can control how many errors Sentry receives in a few ways:

-   Within the SDK you can reduce the data volume you’re sending by sampling.
-   Turn on [Inbound Filters]({%- link _documentation/accounts/quotas.md -%}#inbound-data-filters) for legacy browsers, browser extensions, localhost, and web crawlers. Any filtered events will not count towards your quota.
-   For JavaScript projects, use _whitelistUrls_ and _ignoreErrors_
-   With the Business and Enterprise plans, you’ll be able to set a per-key rate limit for each DSN key in a project at **[Organization] » [Project] » Project Settings » Client Keys (DSN) » Details**. This rate limit is set as number of events to accept during a specific time window (1 minute, 24 hours, etc).

## FAQ

`What happens when my trial expires?`

You are downgraded to the developer plan, which has limited members and events.

`Who sees my events?`

You control who can see events. We allow you to add your team members, as well as share events with anonymous users should you wish to do so.

`If I downgrade mid-year, when does it apply?`

Downgrades and cancellations are processed as the end of the current contract cycle and cannot be refunded.

`What happens if I continue to send events after my on-demand spending cap is consumed?`

All additional events are rejected.

`If I raise my on-demand spending cap mid-month, when will my organization start accepting events again?`

Your organization will start accepting additional events as soon as your new cap is applied. We guarantee new caps will be applied within 24 hours. However, in most cases your organization will start accepting events within minutes.

`If I lower my on-demand spending cap mid-month below this month’s existing bill, when will the new cap take effect? What will my on-demand bill be?`

We guarantee your new, lowered on-demand spending cap will be applied within 24 hours. In the meantime, the old on-demand spending cap will remain in effect. However, in most cases, the new spending cap will be applied within minutes.

After the new spending cap is in effect, all additional events will be rejected and no additional on-demand capacity will be added. At end of billing month, you will be charged for any on-demand capacity consumed.

`If I want to cancel monthly billing, what happens?`

Your plan will continue until the end of the current billing cycle. After this, you’ll revert to the base developer plan, which includes a limited number of events and team members.

`Where can I find my previous invoices/receipts?`

Users with the role of [Billing or Owner]({%- link _documentation/accounts/membership.md -%}) can find all previous invoices by going to the Organization dropdown (top-left) > Usage & Billing > Usage & Payments > Receipts.

Note: You must have either `Billing` or `Owner` permissions to access and/or make changes to information on this page. If you don't have those permissions, or you are not a member of the organization in Sentry, please reach out to a Billing member or an Owner to obtain invoices.
