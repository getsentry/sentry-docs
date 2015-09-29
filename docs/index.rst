.. sentry:edition:: hosted

    Hosted Sentry Documentation
    ===========================

    Welcome to the documentation of the cloud hosted version of Sentry —
    the modern error logging and aggregation platform.  This documentation
    covers everything from getting started to how to integrate it with
    your runtime environment.

.. sentry:edition:: on-premise

    Sentry On-Premise Documentation
    ===============================

    Welcome to the documentation of the On-Premise Edition of Sentry — the
    modern error logging and aggregation platform.  This documentation
    covers the use of Sentry (The Sentry Open Source Server) as well as
    all officially supported client integrations (The Raven Clients).  To
    keep things easy we cover all different editions of the sentry server
    here.

Getting Started
---------------

There is a lot in those docs.  To get you started, you might find some of
these links relevant:

.. sentry:edition:: hosted

   * New to Sentry? Have a look at the :doc:`quickstart`.
   * No account yet?  You can sign up for one at
     `getsentry.com <https://www.getsentry.com/signup/>`_.
   * Stuck? Feel free to contact :doc:`support`.

.. sentry:edition:: on-premise

   * New to Sentry? Have a look at the :doc:`quickstart`.
   * Need help installing Sentry? See :doc:`server/installation`
   * Stuck? Feel free to contact :doc:`support`.

Integrations
------------

To report to Sentry you need a client integration.  The :doc:`Official
Integrations <clients/index>` are called "raven" (:ref:`What is Raven?
<history-naming>`).  Clients exist for all popular programming languages
and platforms.

.. include:: clients/table.rst.inc

.. toctree::
   :hidden:
   :includehidden:

   clients/index




.. sentry:edition:: hosted

   .. toctree::
      :maxdepth: 2
      :titlesonly:
      :hidden:

      quickstart
      learn/quotas
      learn/rollups
      ip-ranges
      support

      learn/context
      learn/search
      learn/membership
      learn/notifications
      learn/sensitive-data
      learn/sso

.. sentry:edition:: on-premise

   .. toctree::
      :maxdepth: 2
      :titlesonly:
      :hidden:

      quickstart
      server/index
      support

      learn/context
      learn/search
      learn/membership
      learn/notifications
      learn/rollups
      learn/sensitive-data

.. toctree::
   :maxdepth: 1
   :titlesonly:
   :hidden:

   clientdev/index
   api/index
   docdev
   project-resources

   ssl
   history
   license
