Sentry Documentation
====================

Welcome to the documentation of Sentry — the modern error logging and
aggregation platform.  This documentation covers the use of Sentry (The
Sentry Server) as well as all officially supported client integrations
(The Raven Clients).  To keep things easy we cover all different editions
of the sentry server here.

If you are completely new to Sentry give the :doc:`quickstart` a read.

Client Documentation
--------------------

To report to Sentry you need a client integration.  The :doc:`official
integrations <clients/index>` are called “raven clients”.  Clients exist
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

.. toctree::
   :maxdepth: 2
   :titlesonly:

   quickstart
   support
   using/index
   events/index

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

Edition Specifics
-----------------

Depending on the edition of Sentry you are using there will be some
differences.  All the relevant information is available here for you:

.. toctree::
   :maxdepth: 1

   cloud/index
   community/index
