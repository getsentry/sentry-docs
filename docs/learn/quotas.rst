Quotas & Filtering
==================

A subscription to Sentry primarily entails a resource quota on the number
of events you can send within a window of time. These windows apply to a
60-second bucket for old plans and a one month bucket for new plans.
Your subscription will provide a rate limit which is the maximum number of
events the server will accept during that period on old plans,
and the same can be configured for new plans. The server will respond with
a 429 HTTP status code when this threshold has been reached.

Additionally, some plans may also include a daily rate limit. For example,
you'll be restricted to a maximum of 250 events per day if you're on the Limited plan.

Increasing Quotas
-----------------

Each tiered plan in Sentry has a predefined rate limit. The more
expensive the plan, the more data you're allowed to send. While the plans
available will fit most individual and small business needs, there
often arises a need for more. Fear not, Sentry is designed to handle large
throughput, and if your team needs more, we're happy to help. Reach out to
your account manager, or send an email to support@sentry.io to learn
more about increasing capacity.

Rate Limiting Projects
----------------------

If you're on our Large or Enterprise plan we support per-key rate limits. These allow
you to set the maximum volume of events a key will accept during a period of time.

For example, you may have a project in production that generates a lot of noise. With
a rate limit you could set the maximum amount of data to "500 events per minute".
Additionally, you could create a second key for the same project for your staging
environment which is unlimited, ensuring your QA process is still untouched.

To setup rate limits, navigate to the Project you wish to limit, go to
**[Project] » Client Keys**. Select on an individual key or create a new one, and you'll
be able to define a rate limit as well as see a breakdown of events received by that key.

.. _inbound-data-filters:

Inbound Filters
--------------------

In some cases, the data you're receiving in Sentry is hard to filter, or you simply
don't have the ability to update the SDK's configuration to apply the filters. Due
to this Sentry provides several ways to filter data server-side, which will also
apply before any rate limits are checked.

Built-in Filters
~~~~~~~~~~~~~~~~

Various built-in filters are available within Sentry. You can find these by going to
**[Project] » Project Settings » Inbound Filters**. Each filter caters to specific
situations, such as web crawlers or old browsers, and can be enabled as needed by the
specific application.

IP Blocklist
~~~~~~~~~~~~

If you have a rogue client, you may find yourself simply wanting to block that IP from
sending data. Sentry supports this by going to
**[Project] » Project Settings » Inbound Filters** and adding the
IP addresses (or subnets) under the **Filter errors from these IP addresses** section.

Filter by releases
~~~~~~~~~~~~~~~~~~

In the case you have a problematic release that is causing an excessive amount of noise,
you can ignore all events from that release. Sentry supports this by going to
**[Project] » Project Settings » Inbound Filters** and adding the releases under the
**Filter errors from these releases** section.

.. note:: Filter by releases is available only on Large and Enterprise Plans

Filter by error message
~~~~~~~~~~~~~~~~~~~~~~~

You can ignore a specific or certain kind of error by going to
**[Project] » Project Settings » Inbound Filters** and adding the
error message under the **Filter errors by error message** section.

.. note:: Filter by error message is available only on Large and Enterprise Plans

Filter by issue
~~~~~~~~~~~~~~~

If there is an issue that you are unable to take action on but that continues to occur, you
can delete and discard it from the issue details page by clicking "delete and discard future events."
This will delete most data associated with an issue and filter out matching events before
they ever reach your stream. Matching events will not count towards your quota.

.. note:: Discarding issues is available only on Medium, Large and Enterprise Plans

Spike Protection
----------------

Spike protection helps to mitigate the impact of event spikes on your monthly capacity
and is available on all plans.

When spike protection is activated, we limit the number of events accepted in any minute to:

``maximum(20, 6 x average events per minute over the last 24 hours)``

**Note:** The 24 hour window ends at the beginning of the current hour, not at the current minute.

What this means is that if you experience a spike, we will temporarily protect you, but if the
increase in volume is sustained, the spike protection limit will gradually increase until Sentry
finally accepts all events.

An example
~~~~~~~~~~

Suppose you start with 0 events. Your spike protection limit is 20/min. At 12am, you start
receiving errors at a rate of 4000/hr (or 66/min). From 12am to 1am, Sentry will discard
2800 events and keep only 1200, and send you an email notifying you that spike protection has
been activated. Between 1am and 2am, your spike protection limit will still be 20/min because the
trailing average for the 24 hours ending 1 am (6 * 4000 / (24 * 60) or roughly 16/min) remains
**below** the base spike protection rate of 20/min. Between 2am and 3am, the trailing average
is 6 * 8,000 / (24 * 60) or roughly 33/min, so spike protection keeps only 33 of the 66 events
sent per minute. By 5 am, the spike protection limit reaches 6 * 16000 / (24 * 60) or 66/min,
and all events are accepted.

How does spike protection help?
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Because Sentry bills on monthly event volume, spikes can easily consume your Sentry capacity for
the rest of the month. If it really is a spike (**large** and **temporary** increase in event
volume), spike protection drops the vast majority of events during the spike and conserves your
capacity.

Controlling Volume
~~~~~~~~~~~~~~~~~~

It's important to note that spike protection is not meant to help you **manage your event volume**
because it is a moving target. To control event volume, you should rate limit by projects or use
inbound filters.

Attributes Limits
-----------------

Sentry imposes hard limits on various components within an event. While
the limits may change over time and vary between attributes most
individual attributes are capped at 512 bytes. Additionally, certain
attributes also limit the maximum number of items.

For example, ``extra`` data is limited to 50 items, and each item is
capped at 16 KB. Similar restrictions apply to context locals (within
a stacktrace's frame), as well as any similar attributes.

Generic attributes like the event's label also have limits but are more
flexible depending on their case. For example, the message attribute is
limited to 1024 bytes.

The following limitations will be automatically enforced:

*   Events greater than 100k are immediately dropped.
*   Stacktraces with large frame counts will be trimmed (the middle
    frames are dropped).
*   Collections exceeding the max items will be trimmed down to the
    maximum size.
*   Individual values exceeding the maximum length will be trimmed down
    to the maximum size.
