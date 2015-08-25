.. this file is auto generated. do not edit

Delete an Organization
======================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/organizations/{organization_slug}/``
Method:
 ``DELETE``

Schedules an organization for deletion.

**Note:** Deletion happens asynchronously and therefor is not
immediate.  However once deletion has begun the state of a project
changes and will be hidden from most public views.
