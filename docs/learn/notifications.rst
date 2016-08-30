Notifications
=============

Notifications in Sentry come in many flavors, but by default are aimed at Email.

By default, Sentry will setup two rules for a project which all configured
integrations will get notified. These rules will notify you when:

- An event is first seen (the first event in a rollup)
- An event changes state from *resolved* to *unresolved*

Understanding States
--------------------

Sentry provides a few states for each event:

Unresolved
    The default state when an event is added to the system.
Resolved
    An event is mark as resolved when an individual resolves it or when the
    project's *auto resolve* feature is configured.
Muted
    An event will not send notifications. Additionally the default filter
    only shows unresolved events, so muted events would be hidden.

Configuration via Rules
-----------------------

As mentioned, two rules exist by default for sending notifications. Within
Sentry however, you're freely able to customize, remove, and add other rules.
To do so visit your **Project Settings** and then click the **Rules** link. On
this page you'll see a list of all active rules.

Conditions
~~~~~~~~~~

Rules provide several conditions that you're able to configure. These are fairly
self explanatory and range from simple state changes (such as the defaults) to
more complex filters on attributes.

For example, at Sentry we send a notification every single time an error happens
and the affected user's email address ends with ``@sentry.io``. To do this
we create a new rule, and we add condition:

``An events {attribute} value {match} {value}``

We then enter the attribute ``user.email``, select ``ends with``, and we enter
``@sentry.io`` for the value.

Additional conditions exist for things like rate limits and other event
attributes.

Actions
~~~~~~~

Currently only a couple actions exist in Sentry:

- Send a notification via all configured integrations
- Send a notification to only a specific integration

An example use-case might be that you want a specific kind of error to send via
Slack, but you want everything to send via Mail.

Integrations
------------

The following third-party notifications are available via Sentry extensions:

- `Campfire <https://github.com/mkhattab/sentry-campfire>`_
- `Flowdock <https://github.com/getsentry/sentry-flowdock>`_
- `Grove.io <https://github.com/mattrobenolt/sentry-groveio>`_
- `Hipchat <https://github.com/linovia/sentry-hipchat>`_
- `IRC <https://github.com/gisce/sentry-irc>`_
- `Pushover <https://github.com/dz0ny/sentry-pushover>`_
- `Whatsapp <https://github.com/ecarreras/sentry-whatsapp>`_
- `XMPP <https://github.com/chroto/sentry-xmpp>`_
- `Slack <https://github.com/getsentry/sentry-slack>`_
- `Zabbix <https://github.com/m0n5t3r/sentry-zabbix>`_
