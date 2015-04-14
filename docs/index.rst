Sentry
======

Welcome to the documentation of Sentry — the modern error logging and
aggregation platform.  This documentation covers the use of Sentry as well
as all officially supported client integrations.  To keep things easy we
cover all different editions of the sentry server here.

Introduction
------------

No matter which edition of Sentry you are using, the basics or reporting
and using are exactly the same.  This gives you an introduction to how to
configure the UI and how to configure the clients.

.. toctree::
   :maxdepth: 1

   quickstart
   organizations
   teams
   projects
   quotas
   sampling
   ssl
   support

Event Reporting
---------------

This part of the documentation covers all the important information about
reporting events to Sentry.  This is split into two parts: the low-level
API and how it maps to the Sentry user interface, and the higher-level
part about how the low-level concepts map to client libraries.

.. toctree::
   :maxdepth: 3

   events/index

Platform Specifics
------------------

Depending on the programming language or platform you are using, there
might be some specifics to keep in mind.  These are all covered as part of
this documentation:

.. toctree::
   :maxdepth: 3

   platforms/index

Edition Specifics
-----------------

Depending on the edition of Sentry you are using there will be some
differences.  All the relevant information is available here for you:

.. toctree::
   :maxdepth: 2

   community/index

Internals
---------

If you want to extend Sentry, write your own Raven client or understand
the internals of the system, this is the documentation you need to study:

.. toctree::
   :maxdepth: 2

   internals/index
