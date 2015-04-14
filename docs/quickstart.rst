Getting Started
===============

Sentry is designed to be very simple to get off the ground, yet powerful
to grow into.  If you have never used Sentry before, this tutorial will
help you chose an edition of sentry and guides you through the most
important steps.

Getting started with Sentry is a three step process:

1.  :ref:`pick-a-sentry-edition`
2.  :ref:`pick-a-client-integration`
3.  :ref:`configure-the-dsn`

.. _pick-a-sentry-edition:

Pick a Sentry Edition
---------------------

Sentry comes in different variations tailored towards customer's
individual requirements.  All editions are based on our `Sentry Open
Source Project <http://www.getsentry.org/>`_.

*   **Sentry Cloud**

    If you are new to Sentry and you have not used it before, you can get
    started started by signing up for a `free trial account
    of Sentry Cloud <https://www.getsentry.com/signup/>`_ on getsentry.com.

    Sentry Cloud is the most popular edition of Sentry which is used by hobby
    developers and large corporations alike.  Sentry Cloud is hosted on our
    dedicated cloud infrastructure and automatically scales with your
    requirements and gives you access to your event data from anywhere in the
    world.  We keep it running for you and you can get started working with it
    right away.

*   **Sentry Enterprise Edition**

    For enterprise customers we also provide Sentry Enterprise Edition.  It
    includes all the functionality of Sentry Cloud but runs on your own
    network on your own hardware and can be integrated with the rest of your
    infrastructure.  Sentry Enterprise Edition is a bespoke product that comes
    with a support contract.

    If you are interested in the enterprise edition, `you can learn more about
    out enterprise offering <https://www.getsentry.com/enterprise/>`_.

*   **Sentry Community Edition**

    The Sentry Community Edition is a distribution of the Sentry Open Source
    Project supported by the community.  You can download the community
    edition on `our github page <https://github.com/getsentry/sentry>`_.

    Documentation is available here: :doc:`community/index`.


.. _pick-a-client-integration:

Pick A Client Integration
-------------------------

To report to Sentry you need a client library that supports your platform.
These client libraries (called "raven" clients) are available for all
major programming languages and environments.  In case your environment is
very specific, you can also directly report to the underlying REST API.

The most popular clients are:

*   `raven-python <https://github.com/getsentry/raven-python>`_
*   `raven-ruby <https://github.com/getsentry/raven-ruby>`_
*   `raven-php <https://github.com/getsentry/raven-php>`_
*   `raven-js <https://github.com/getsentry/raven-js>`_
*   `raven-objc <https://github.com/getsentry/raven-objc>`_
*   `raven-java <https://github.com/getsentry/raven-java>`_
*   `raven-csharp <https://github.com/getsentry/raven-csharp>`_


.. _configure-the-dsn:

Configure The DSN
-----------------

After you complete setting up a project in Sentry, you'll be given a value
which we call a *DSN*, or *Data Source Name*.  It looks a lot like a
standard URL, but it's actually just a representation of the configuration
required by the Raven clients.  It consists of a few pieces, including the
protocol, public and secret keys, the server address, and the project
identifier.

You'll have a few options for plugging the DSN into the client, depending
on what it supports. At the very least, most clients will allow you to set
it up as the ``SENTRY_DSN`` environment variable or by passing it into the
client constructor.

Note: If you're using Heroku, and you've added Sentry Cloud via the
standard addon hooks, most clients will automatically pick up the
``SENTRY_DSN`` environment variable that we've already configured for you.
