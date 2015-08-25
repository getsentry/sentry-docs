.. this file is auto generated. do not edit

Update an Aggregate
===================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/groups/{group_id}/``
Method:
 ``PUT``

Updates an individual aggregate's attributes.  Only the attributes
submitted are modified.  The following attributes are supported
for all keys:

- ``status``: ``"resolved"``, ``"unresolved"``, ``"muted"``
- ``assignedTo``: user id

In case the API call is invoked in a user context, these
attributes can also be modified:

- ``hasSeen``: `true`, false`
- ``isBookmarked``: `true`, false`

.. sentry:api-scenario:: UpdateAggregate
