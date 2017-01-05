Pricing
=======

All paying customers receive unlimited members and projects, email support, and access to all of Sentry’s product features. Pricing is based on your data volume and has two options. You may either pay for what you use without long term commitments or prepay for significant discounts (up to 70%).

Concepts
--------

Events
~~~~~~

An event is a crash report (also known as exception or error) that is sent to Sentry’s server to be processes. Additional metadata around an event (breadcrumbs, user context, environment, etc) do not count as separate events.

Capacity
~~~~~~~~

Capacity is the total number of events sent by and billed to your organization. Capacity comes in two types: on-demand and reserved.

On-demand Capacity
``````````````````

On-demand capacity is billed at the end of each billing cycle. You are charged per processed event, rounded up to the nearest cent.


Reserved Capacity
`````````````````

Reserved capacity allows you to prepay annually for significant discounts (up to 70%). Your prepaid, reserved capacity is always applied before on-demand capacity. Unused reserved capacity expires at the end of each billing month.

**Reserved Capacity Price Schedule**

+---------------------------+-----------------+
| Events                    | Price per event |
+===========================+=================+
| 50,001–100,000            | 0.00023         |
+---------------------------+-----------------+
| 100,001–250,000           | 0.00020         |
+---------------------------+-----------------+
| 250,001–500,000           | 0.00018         |
+---------------------------+-----------------+
| 500,001–1,000,000         | 0.00016         |
+---------------------------+-----------------+
| 1,000,001–2,500,000       | 0.00014         |
+---------------------------+-----------------+
| 2,500,001–5,000,000       | 0.00013         |
+---------------------------+-----------------+
| 5,000,001–10,000,000      | 0.00012         |
+---------------------------+-----------------+
| 10,000,001–50,000,000     | 0.00011         |
+---------------------------+-----------------+
| 50,000,001–100,000,000    | 0.00010         |
+---------------------------+-----------------+

Free Capacity
`````````````

All Sentry organizations receive 10,000 events per month of free capacity. You retain your free capacity when switching to a paid plan.

Billing Cycle
~~~~~~~~~~~~~

By default, your account will be billed monthly, starting on the date you switch to a paid plan. If you purchase reserve capacity, which requires annual billing, the annual billing cycle start date will match the current monthly billing start date. Any unused capacity will be discarded at the end of each monthly billing cycle. The minimum charge for any billing month is $1.

Billing Controls
~~~~~~~~~~~~~~~~

On-demand spending cap
``````````````````````

You can set a maximum monthly on-demand bill amount by setting an on-demand spending cap. Once you reach the spending cap, you will still be able to access Sentry and prior event data. However, any additional events you send will be rejected.

Per-minute rate limits
``````````````````````

You can set the maximum number of events per minute that Sentry will accept. This allows you to protect yourself from consuming all of your month’s capacity in the event of sudden spikes.

Plans
-----

Pro
~~~~

The Pro plan includes 50,000 events per month. Additional capacity can be purchased as pay-per-event, on-demand capacity or prepaid, reserved capacity. Reserved capacity can be upgrade mid-month and any capacity used thus far this month will be recalculated based on the new reserved capacity level.

Trial
`````

The Pro plan comes with a 14-day trial of Sentry with unlimited events and team members. Trials have access to all features and email support. Trials have a default rate limit of 500 events/minute. If you need more or an unlimited rate limit during trial, please contact us sales@sentry.io.

Free
~~~~

Sentry’s free tier is for hobbyists pursuing side projects. It includes all of Sentry's product features, unlimited projects, 10,000 events per month, 1 team member, and community support. Email support is not included.

FAQ
---

.. describe:: What happens when my trial expires?

You are downgraded to the free plan, which has limited members and events.

.. describe:: Who sees my events?

You control who can see events. We allow you to add your team members, as well as share events with anonymous users should you wish to do so.

.. describe:: How are reserved capacity discounts applied as my capacity increases?

Reserved capacity discounts are cumulative and graduated. For example, the pricing for a reserved capacity of 150,000 events breaks down as such:

+-------------------+-----------------+--------+
| Events            | Price per event | Price  |
+===================+=================+========+
| 0–50,000          | $0 (included)   | $0.00  |
+-------------------+-----------------+--------+
| 50,001–100,000    | $0.00023        | $10.00 |
+-------------------+-----------------+--------+
| 100,001–150,000   | $0.00020        | $11.50 |
+-------------------+-----------------+--------+

Total price: $10 (base plan) + $11.50 + $10 = $31.50

.. describe:: How am I billed if I expand my reserved capacity mid-annual billing cycle?

When expanding reserved capacity mid-billing year, you are billed the pro-rated amount based on months left in the current billing year, including the current billing month. The current billing month’s accepted events will applied to the new reserved capacity first, before being applied to on-demand.

Your annual billing period remains the same and is not extended beyond the original period to provide our customers maximum flexibility.

.. describe:: If I downgrade my reserved capacity mid-year, when does it apply?

Reserved capacity is purchased for the current billing year and cannot be refunded. Downgrading will reduce your reserved capacity for the following annual billing period.

.. describe:: What happens if I continue to send events after my on-demand spending cap is consumed?

All additional events are rejected.

.. describe:: If I raise my on-demand spending cap mid-month, when will my organization start accepting events again?

Your organization will start accepting events as soon as your new cap is applied. We guarantee new caps will be applied within 24 hours. However, in most cases your organization will start accepting events within minutes.

.. describe:: If I lower my on-demand spending cap mid-month below this month’s existing bill, when will the new cap take effect? What will my on-demand bill be?

We guarantee your new, lowered on-demand spending cap will be applied within 24 hours. In the meantime, the old on-demand spending cap will remain in effect. However, in most cases, the new spending cap will be applied within minutes.

After the new spending cap is in effect, all additional events will be rejected and no additional on-demand capacity will be added. At end of billing month, you will be charged for any on-demand capacity consumed.

.. describe:: If I want to cancel monthly billing, what happens?

Your plan will continue until the end of the current of the current billing cycle. After this, you’ll revert to the base free plan, with includes a limited number of events and team members.
