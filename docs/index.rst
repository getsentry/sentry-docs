.. sentry:edition:: hosted

    Sentry Documentation
    ====================

    Welcome to the documentation of the cloud hosted version of Sentry —
    the modern error logging and aggregation platform.  This documentation
    covers everything from getting started to how to integrate it with
    your runtime environment.

    If you are completely new to Sentry give the :doc:`quickstart` a read.

.. sentry:edition:: enterprise

    Sentry Enterprise
    =================

    Welcome to the documentation of the Enterprise Edition of Sentry — the
    modern error logging and aggregation platform.  This documentation
    covers the use of Sentry (The Sentry Open Source Server) as well as
    all officially supported client integrations (The Raven Clients).  To
    keep things easy we cover all different editions of the sentry server
    here.

    *The documentation of the Enterprise Edition of Sentry is work in
    progress.*

.. sentry:edition:: community

    Sentry Community Edition
    ========================

    Welcome to the documentation of Sentry — the modern error logging and
    aggregation platform.  This documentation covers the use of Sentry
    (The Sentry Open Source Server) as well as all officially supported
    client integrations (The Raven Clients).

Client Documentation
--------------------

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

.. toctree::
   :maxdepth: 2
   :titlesonly:

   quickstart
   support
   using/index
   events/index

.. sentry:edition:: hosted

    Hosted Sentry Specifics
    -----------------------

    The cloud hosted version of Sentry (getsentry.com) has some specifics
    that are good to know.

    .. toctree::
       :maxdepth: 2

       ip-ranges
       status-page

.. sentry:edition:: enterprise

    Sentry Enterprise
    -----------------

    This part of the documentation covers all parts of the Sentry
    Enterprise edition and how to run them.  As the Enterprise Edition is
    based on the Open Source server some parts of this documentation
    overlap with the Community Edition.

    .. toctree::
       :maxdepth: 2

       server/index

.. sentry:edition:: community

    Sentry Community Edition
    ------------------------

    This part of the documentation covers all parts of the Sentry Open
    Source project and how to run it.

    .. toctree::
       :maxdepth: 2

       server/index
       license
       project-resources

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
