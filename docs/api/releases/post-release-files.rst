.. this file is auto generated. do not edit

Upload a New File
=================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/``
Method:
 ``POST``

Upload a new file for the given release.

Unlike other API requests, files must be uploaded using the
traditional multipart/form-data content-type.

The optional 'name' attribute should reflect the absolute path
that this file will be referenced as. For example, in the case of
JavaScript you might specify the full web URI.
