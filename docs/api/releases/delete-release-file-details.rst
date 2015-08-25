.. this file is auto generated. do not edit

Delete a File
=============

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/{file_id}/``
Method:
 ``DELETE``

Permanently remove a file from a release.

This will also remove the physical file from storage.
