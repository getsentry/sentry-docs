.. this file is auto generated. do not edit

List Tag Details
================

.. sentry:api-endpoint:: get-group-tag-key-details

    Returns a list of details about the given tag key.

    :pparam int group_id: the ID of the group to retrieve.
    :pparam string key: the tag key to look the values up for.
    :auth: required

    :http-method: GET
    :http-path: /api/0/groups/{group_id}/tags/{key}/
