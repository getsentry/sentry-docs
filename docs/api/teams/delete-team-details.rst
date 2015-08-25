.. this file is auto generated. do not edit

Delete a Team
=============

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/teams/{organization_slug}/{team_slug}/``
Method:
 ``DELETE``

Schedules a team for deletion.

**Note:** Deletion happens asynchronously and therefor is not
immediate.  However once deletion has begun the state of a project
changes and will be hidden from most public views.
