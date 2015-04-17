Sentry Documentation
====================

Welcome to the documentation of Sentry — the modern error logging and
aggregation platform.  This documentation covers the use of Sentry (The
Sentry Server) as well as all officially supported client integrations
(The Raven Clients).  To keep things easy we cover all different editions
of the sentry server here.

Using Sentry
------------

No matter which edition of Sentry you are using, the basics or reporting
and using are exactly the same.  This gives you an introduction to how to
use the UI and how to configure the clients.

.. toctree::
   :maxdepth: 2
   :titlesonly:

   quickstart
   support
   using/index

Client Libraries
----------------

To report to Sentry you need a client integration.  The official
integrations are called “raven clients”.  Clients exist for all popular
programming languages and platforms.

.. toctree::
   :maxdepth: 2

   clients/index

Event Reporting
---------------

This part of the documentation covers all the important information about
reporting events to Sentry.  This is split into two parts: the low-level
API and how it maps to the Sentry user interface, and the higher-level
part about how the low-level concepts map to client libraries.

.. toctree::
   :maxdepth: 3

   events/index

Edition Specifics
-----------------

Depending on the edition of Sentry you are using there will be some
differences.  All the relevant information is available here for you:

.. toctree::
   :maxdepth: 2

   cloud/index
   community/index

Internals
---------

If you want to extend Sentry, write your own Raven client or understand
the internals of the system, this is the documentation you need to study:

.. toctree::
   :maxdepth: 2

   internals/index
