.. this file is auto generated. do not edit

Retrieve an Aggregate
=====================

.. note::
  This new API documentation is currently work in progress. Consider using `the old documentation <https://beta.getsentry.com/api/>`__ for the time being.

Path:
 ``/api/0/groups/{group_id}/``
Method:
 ``GET``

Return details on an individual aggregate.  Aggregates are also
sometimes referred to as groups.  This returns the basic stats for
the group (the bar graph), some overall numbers (number of comments,
user reports) as well as the summarized event data.

.. sentry:api-scenario:: RetrieveAggregate
