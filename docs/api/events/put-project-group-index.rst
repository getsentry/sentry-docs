.. this file is auto generated. do not edit

Bulk Mutate a List of Aggregates
================================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/projects/{organization_slug}/{project_slug}/groups/``
Method:
 ``PUT``

Bulk mutate various attributes on aggregates.

- For non-status updates, the 'id' parameter is required.
- For status updates, the 'id' parameter may be omitted for a batch
  "update all" query.
- An optional 'status' parameter may be used to restrict mutations to
  only events with the given status.

Attributes:

- ``status``: resolved, unresolved, muted
- ``hasSeen``: true, false
- ``isBookmarked``: true, false
- ``isPublic``: true, false
- ``merge``: true, false

If any ids are out of scope this operation will succeed without
any data mutation.
