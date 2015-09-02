.. this file is auto generated. do not edit

Update a Client Key
===================

.. sentry:api-endpoint:: put-project-key-details

    Update a client key.  This can be used to rename a key.

    :pparam string organization_slug: the slug of the organization the
                                      client keys belong to.
    :pparam string project_slug: the slug of the project the client keys
                                 belong to.
    :pparam string key_id: the ID of the key to update.
    :param string name: the new name for the client key.
    :auth: required

    :http-method: PUT
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/keys/{key_id}/

Example
-------


.. sentry:api-scenario:: UpdateClientKey
