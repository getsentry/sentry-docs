Sentry API
==========

The Sentry API is used for submitting events to the Sentry collector as
well as exporting and managing data.  The reporting and web APIs are
individually versioned.  This document refers to the web APIs only.
For information about the reporting API see :doc:`../clientdev/index`.

Versioning
----------

The current version of the web API is known as **v0** and is considered
to be in a draft phase. While we don't expect public endpoints to
change greatly, keep in mind that the API is still under development.


Reference
---------

.. toctree::
   :maxdepth: 1

   requests
   auth
   pagination

Endpoints
---------

A full list of the currently supported API endpoints:

.. include:: sections.rst.inc
