Getting Started
===============

Sentry is designed to be very simple to get off the ground, yet powerful
to grow into.  If you have never used Sentry before, this tutorial will
help you getting started.

Getting started with Sentry is a three step process:

.. sentry:edition:: hosted

    1.  `Sign up for an account <https://getsentry.com/signup/>`_
    2.  :ref:`pick-a-client-integration`
    3.  :ref:`configure-the-dsn`

.. sentry:edition:: on-premise

    1.  :ref:`install-the-server`
    2.  :ref:`pick-a-client-integration`
    3.  :ref:`configure-the-dsn`

.. sentry:edition:: hosted

    About Hosted Sentry
    -------------------

    If you are new to Sentry and you have not used it before, you can get
    started started by signing up for a `free trial account
    of Hosted Sentry <https://getsentry.com/signup/>`_ on getsentry.com.

    Hosted Sentry is the most popular edition of Sentry which is used by hobby
    developers and large corporations alike.  It is hosted on our
    dedicated cloud infrastructure and automatically scales with your
    requirements and gives you access to your event data from anywhere in
    the world.  We keep it running for you and you can get started working
    with it right away without having to spend time with installation or
    maintenance.

.. sentry:edition:: on-premise

    Sentry On-Premise
    -----------------

    Sentry On-Premise is a distribution of the Sentry Open Source
    Project supported by the community.  It can be installed on-premise
    and integrate into the rest of your infrastructure behind your
    firewall.  As an enterprise customer you are additionally entitled to
    a bespoke support contract.  You can download the community edition on
    `our github page <https://github.com/getsentry/sentry>`_.

    If you are interested in the enterprise edition, `you can learn more
    about out enterprise offering
    <https://getsentry.com/enterprise/>`_.

    .. _install-the-server:

    Installing The Server
    ---------------------

    All editions of Sentry are based on the same :doc:`Open Source Server
    </server/index>`.  For a detailed introduction about the installation
    process see :doc:`/server/installation/index`.

    Generally to run the Sentry Server you need a UNIX based operating
    system, Python 2.7, PostgreSQL and redis as well as an HTTP server of
    your choice.


.. _pick-a-client-integration:

Configure an Integration
------------------------

To report to Sentry you'll need to use an SDK (also referred to as a client)
which supports your platform. In case your environment is very specific,
you can simply use the JSON reporting API.

Popular integrations are:

*   :doc:`Python <clients/python/index>`
*   :doc:`JavaScript <clients/javascript/index>`
*   :doc:`PHP <clients/php/index>`
*   :doc:`Ruby <clients/ruby/index>`
*   :doc:`Objective-C <clients/objc/index>`
*   :doc:`Java <clients/java/index>`
*   :doc:`C# <clients/csharp/index>`
*   :doc:`Go <clients/go/index>`

For exact configuration for the integration consult the corresponding
documentation.  For all clients however, the basics are the same.

.. _configure-the-dsn:

Configure The DSN
-----------------

After you complete setting up a project in Sentry, you'll be given a value
which we call a *DSN*, or *Data Source Name*.  It looks a lot like a
standard URL, but it's actually just a representation of the configuration
required by the Raven clients.  It consists of a few pieces, including the
protocol, public and secret keys, the server address, and the project
identifier.

The DSN can be found in Sentry by navigation to Account -> Projects ->
[Project Name] -> [Member Name]. Its template resembles the following::

    '{PROTOCOL}://{PUBLIC_KEY}:{SECRET_KEY}@{HOST}/{PATH}{PROJECT_ID}'

If you use the Hosted Sentry and you are signed into your account, the
documentation will refer to your actual DSNs and you can select the
correct one, on the top right of this page for adjusting the examples for
easy copy pasting::

    '___DSN___'

.. sentry:edition:: hosted

    It is composed of five important pieces:

    * The protocol used. This should be ``https``.

    * The public and secret keys to authenticate the client.

    * The hostname of the Sentry server.

    * The project ID which the authenticated user is bound to.

.. sentry:edition:: on-premise

    It is composed of six important pieces:

    * The Protocol used. This can be one of the following: http or https.

    * The public and secret keys to authenticate the client.

    * The hostname of the Sentry server.

    * An optional path if Sentry is not located at the webserver root.

    * The project ID which the authenticated user is bound to.

You'll have a few options for plugging the DSN into the client, depending
on what it supports. At the very least, most clients will allow you to set
it up as the ``SENTRY_DSN`` environment variable or by passing it into the
client constructor.

For example for the Python client it works roughly like this::

    from raven import Client
    client = Client('___DSN___')

Note: If you're using Heroku, and you've added Hosted Sentry via the
standard addon hooks, most clients will automatically pick up the
``SENTRY_DSN`` environment variable that we've already configured for you.
