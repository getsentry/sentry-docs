Subscriptions & Quotas
======================

A subscription to Sentry primarily entails a resource quota on the amount
of events you can send within a window of time. These windows generally
apply to a 60-second bucket, and your subsription will provide a rate limit
which is the maximum number of events the server will accept during that
period. When this threshold has been reached the server will respond with
a 429 request.

Additionally some plans may also include a daily rate limit. For example, if
you're on the Limited plan, you'll be restricted to a maximum of 250 events
per day.

Increasing Quotas
-----------------

Each tiered plan in Sentry has a predefined rate limit. Generally the more
expensive the plan, the more data you're allowed to send. While the plans
available will generally fit most individual and small business needs, there
often arises a need for more. Fear not, Sentry is designed to handle large
throughput, and if your team needs more we're happy to help. Reach out to
your account manager, or send an email to support@getsentry.com to learn
more about increasing capacity.

Attributes Limits
-----------------

Sentry imposes hard limits on various components within an event. While
the limits may change over time, and vary between attributes most
individual attributes are capped at 512 bytes. Additionally, certain
attributes also limit the maximum number of items.

For example, ``extra`` data is limited to 100 items, and each item is
capped at 512 bytes. Similar restrictions apply to context locals (within
a stacktrace's frame), as well as any similar attributes.

Generic attributes like the event's label also have limits, but are more
flexible depending on their case. For example, the message attribute is
limited to 1024 bytes.

The following limitations will be automatically enforced:

*   Events greater than 100k are immediately dropped.
*   Stacktrace's with large frame counts will be trimmed (the middle
    frames are dropped).
*   Collections exceeding the max items will be trimmed down to the
    maximum size.
*   Individually values exceeding the maximum length will be trimmed down
    to the maximum size.
