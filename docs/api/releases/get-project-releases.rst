.. this file is auto generated. do not edit

List a Project's Releases
=========================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/releases/``
Method:
 ``GET``

Retrieve a list of releases for a given project.

To find releases for a given version the 'query' parameter may be to
create a "version STARTS WITH" filter.
