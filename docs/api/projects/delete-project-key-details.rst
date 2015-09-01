.. this file is auto generated. do not edit

Delete a Client Key
===================

.. sentry:api-endpoint:: delete-project-key-details

    Delete a client key.

    :pparam string organization_slug: the slug of the organization the
                                      client keys belong to.
    :pparam string project_slug: the slug of the project the client keys
                                 belong to.
    :pparam string key_id: the ID of the key to delete.
    :auth: required

    :http-method: DELETE
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/keys/{key_id}/

Example
-------


.. sentry:api-scenario:: DeleteClientKey
