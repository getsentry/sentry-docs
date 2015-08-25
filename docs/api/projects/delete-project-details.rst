.. this file is auto generated. do not edit

Delete a Project
================

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/``
Method:
 ``DELETE``

Schedules a project for deletion.

**Note:** Deletion happens asynchronously and therefor is not
immediate.  However once deletion has begun the state of a project
changes and will be hidden from most public views.
