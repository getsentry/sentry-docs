.. this file is auto generated. do not edit

Bulk Remove a List of Aggregates
================================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/groups/``
Method:
 ``DELETE``

Permanently remove the given aggregates.

Only queries by 'id' are accepted.

If any ids are out of scope this operation will succeed without
any data mutation.
