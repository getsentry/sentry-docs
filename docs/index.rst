Sentry Documentation
====================

Welcome to the documentation of the cloud hosted version of Sentry —
the modern error logging and aggregation platform.  This documentation
covers everything from getting started to how to integrate it with
your runtime environment.

Getting Started
---------------

There is a lot in those docs.  To get you started, you might find some of
these links relevant:

* New to Sentry? Have a look at the :doc:`quickstart`.
* No account yet?  You can sign up for one at `sentry.io <https://sentry.io/signup/>`_.
* Stuck? Feel free to contact :doc:`support`.
* Installing the Sentry server yourself? See :doc:`server/installation/index`

Platforms
---------

To report to Sentry you'll need to use a language-specific SDK. The Sentry team builds and
maintains these for most popular languages, but there's also a large ecosystem supported
by the community. If your favorite language isn't listed below, we encourage you to start a
discussion about supporting it on our `community forum <https://forum.sentry.io>`_.

.. include:: clients/table.rst.inc

.. toctree::
    :hidden:
    :includehidden:

    clients/index

.. toctree::
    :maxdepth: 2
    :titlesonly:
    :hidden:

    quickstart
    server/index
    support

    learn/breadcrumbs
    learn/context
    learn/search
    learn/membership
    learn/notifications
    learn/rollups
    learn/quotas
    learn/sensitive-data
    learn/sso
    learn/user-feedback
    learn/cli

    integrations/index

    ip-ranges

.. toctree::
    :maxdepth: 1
    :titlesonly:
    :hidden:

    api/index
    clientdev/index
    serverdev/index
    docdev
    project-resources

    ssl
    history
    license
