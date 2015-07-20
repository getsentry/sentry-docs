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
Integrations <clients/index>` are called “raven clients”.  Clients exist
for all popular programming languages and platforms.

.. include:: clients/table.rst.inc

.. toctree::
   :hidden:
   :includehidden:

   clients/index

Using Sentry
------------

No matter which edition of Sentry you are using, the basics or reporting
and using are exactly the same.  This gives you an introduction to how to
use the UI and how to configure the clients.

.. sentry:edition:: hosted

  .. toctree::
     :maxdepth: 2
     :titlesonly:

     quickstart
     rollups
     tagging
     membership
     quotas
     ssl
     support

.. sentry:edition:: on-premise

  .. toctree::
     :maxdepth: 2
     :titlesonly:

     quickstart
     membership
     rollups
     tagging
     server/index
     license
     project-resources
     support

Development Documentation
-------------------------

If you want to extend Sentry, write your own Raven client or understand
the internals of the system, this is the documentation you need to
reference.  It does not just cover event reporting but also management
APIs.

This covers the protocol, how clients are supposed to work and some
general guidelines.

.. toctree::
   :maxdepth: 2

   clientdev/index
   api/index
