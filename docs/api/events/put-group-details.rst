.. this file is auto generated. do not edit

Update an Aggregate
===================

.. sentry:api-endpoint:: put-group-details

    Updates an individual aggregate's attributes.  Only the attributes
    submitted are modified.  The following attributes are supported
    for all keys:
    
    - ``status``: ``"resolved"``, ``"unresolved"``, ``"muted"``
    - ``assignedTo``: user id
    
    In case the API call is invoked in a user context, these
    attributes can also be modified:
    
    - ``hasSeen``: `true`, `false`
    - ``isBookmarked``: `true`, `false`

    :http-method: PUT
    :http-path: /api/0/groups/{group_id}/

Example
-------


.. sentry:api-scenario:: UpdateAggregate
