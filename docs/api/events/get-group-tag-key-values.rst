.. this file is auto generated. do not edit

List a Tag's Values
===================

.. sentry:api-endpoint:: get-group-tag-key-values

    Return a list of values associated with this key.

    :pparam string group_id: the ID of the group to retrieve.
    :pparam string key: the tag key to look the values up for.
    :auth: required

    :http-method: GET
    :http-path: /api/0/groups/{group_id}/tags/{key}/values/
