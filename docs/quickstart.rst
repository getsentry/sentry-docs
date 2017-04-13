Getting Started
===============

Sentry is designed to be very simple to get off the ground, yet powerful
to grow into.  If you have never used Sentry before, this tutorial will
help you getting started.

Getting started with Sentry is a three step process:

1.  `Sign up for an account <https://sentry.io/signup/>`_
2.  :ref:`pick-a-client-integration`
3.  :ref:`configure-the-dsn`

.. _pick-a-client-integration:

Configure an SDK
----------------

Sentry captures data by using an SDK within your application's runtime. These
are platform specific, and allow Sentry to have a deep understanding of both
how your application works. In case your environment is very specific, you can
also roll your own SDK using our document :doc:`SDK API <clientdev/index>`.

Popular integrations are:

*   :doc:`Python <clients/python/index>`
*   :doc:`JavaScript <clients/javascript/index>`
*   :doc:`PHP <clients/php/index>`
*   :doc:`Ruby <clients/ruby/index>`
*   :doc:`Java <clients/java/index>`
*   :doc:`Cocoa <clients/cocoa/index>`
*   :doc:`C# <clients/csharp/index>`
*   :doc:`Go <clients/go/index>`
*   :doc:`Elixir <clients/elixir/index>`

For exact configuration for the integration consult the corresponding
documentation.  For all SDKs however, the basics are the same.

.. _configure-the-dsn:

About the DSN
-------------

After you complete setting up a project in Sentry, you'll be given a value
which we call a *DSN*, or *Data Source Name*.  It looks a lot like a
standard URL, but it's actually just a representation of the configuration
required by the Sentry SDKs.  It consists of a few pieces, including the
protocol, public and secret keys, the server address, and the project
identifier.

The DSN can be found in Sentry by navigating to [Project Name] -> Project Settings -> Client Keys (DSN). Its template resembles the following::

    '{PROTOCOL}://{PUBLIC_KEY}:{SECRET_KEY}@{HOST}/{PATH}{PROJECT_ID}'

If you use the Hosted Sentry and you are signed into your account, the
documentation will refer to your actual DSNs and you can select the
correct one, on the top right of this page for adjusting the examples for
easy copy pasting::

    '___DSN___'

It is composed of five important pieces:

* The Protocol used. This can be one of the following: http or https.

* The public and secret keys to authenticate the SDK.

* The destination Sentry server.

* The project ID which the authenticated user is bound to.

You'll have a few options for plugging the DSN into the SDK, depending
on what it supports. At the very least, most SDKs will allow you to set
it up as the ``SENTRY_DSN`` environment variable or by passing it into the
SDK's constructor.

For example for the JavaScript SDK it works roughly like this::

    import raven
    raven.Client('___DSN___')

Note: If you're using Heroku, and you've added Hosted Sentry via the
standard addon hooks, most SDKs will automatically pick up the
``SENTRY_DSN`` environment variable that we've already configured for you.


Next Steps
----------

Now that you've got basic reporting setup, you'll want to explore adding
additional context to your data.

* :doc:`identifying users via context <learn/context>`
* :doc:`tracing issues with breadcrumbs <learn/breadcrumbs>`
* :doc:`capturing user feedback on crashes <learn/user-feedback>`
