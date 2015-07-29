.. sentry:edition:: hosted

    Sentry Documentation
    ====================

    Welcome to the documentation of the cloud hosted version of Sentry —
    the modern error logging and aggregation platform.  This documentation
    covers everything from getting started to how to integrate it with
    your runtime environment.

    If you are completely new to Sentry give the :doc:`quickstart` a read.

.. sentry:edition:: on-premise

    Sentry On-Premise
    =================

    Welcome to the documentation of the On-Premise Edition of Sentry — the
    modern error logging and aggregation platform.  This documentation
    covers the use of Sentry (The Sentry Open Source Server) as well as
    all officially supported client integrations (The Raven Clients).  To
    keep things easy we cover all different editions of the sentry server
    here.

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

    Hosted Sentry
    -------------

    This covers the basics for the cloud hosted version of Sentry.

    .. toctree::
       :maxdepth: 2
       :titlesonly:

       quickstart
       quotas
       rollups
       ip-ranges
       support

.. sentry:edition:: on-premise

   Sentry On-Premise
   -----------------

   This covers the basics for the on-premise hosted version of Sentry.

   .. toctree::
      :maxdepth: 2
      :titlesonly:

      quickstart
      server/index
      support

Learning Sentry
---------------

No matter which edition of Sentry you are using, the basics or reporting
and using are the same.

.. sentry:edition:: hosted

  .. toctree::
     :maxdepth: 1
     :titlesonly:

     tagging
     membership
     notifications
     scrubbing-data
     sso

.. sentry:edition:: on-premise

  .. toctree::
     :maxdepth: 1
     :titlesonly:

     membership
     rollups
     tagging
     notifications
     scrubbing-data

Development Documentation
-------------------------

At the heart of Sentry and the Raven Clients there stands an Open Source
product.  If you want to extend Sentry, write your own Raven client or
understand the internals of the system, we have an extensive development
documentation that can help you out with all those parts.

.. toctree::
   :maxdepth: 1
   :titlesonly:

   clientdev/index
   api/index
   docdev
   project-resources


.. these are the files we reference from here.  The will show up in the
   sidebar and the final product.

.. toctree::
   :maxdepth: 2
   :hidden:

   ssl
   history
   license
