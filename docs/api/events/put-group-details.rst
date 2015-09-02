.. this file is auto generated. do not edit

Update an Aggregate
===================

.. sentry:api-endpoint:: put-group-details

    Updates an individual aggregate's attributes.  Only the attributes
    submitted are modified.

    :pparam string group_id: the ID of the group to retrieve.
    :param string status: the new status for the groups.  Valid values
                          are ``"resolved"``, ``"unresolved"`` and
                          ``"muted"``.
    :param int assignedTo: the user ID of the user that should be
                           assigned to this group.
    :param boolean hasSeen: in case this API call is invoked with a user
                            context this allows changing of the flag
                            that indicates if the user has seen the
                            event.
    :param boolean isBookmarked: in case this API call is invoked with a
                                 user context this allows changing of
                                 the bookmark flag.
    :auth: required

    :http-method: PUT
    :http-path: /api/0/groups/{group_id}/

Example
-------


.. sentry:api-scenario:: UpdateAggregate
