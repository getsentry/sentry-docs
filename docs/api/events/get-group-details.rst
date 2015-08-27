.. this file is auto generated. do not edit

Retrieve an Aggregate
=====================

.. sentry:api-endpoint:: get-group-details

    Return details on an individual aggregate.  Aggregates are also
    sometimes referred to as groups.  This returns the basic stats for
    the group (the bar graph), some overall numbers (number of comments,
    user reports) as well as the summarized event data.
    
    :pparam int group_id: the ID of the group to retrieve.

    :http-method: GET
    :http-path: /api/0/groups/{group_id}/

Example
-------


.. sentry:api-scenario:: RetrieveAggregate
