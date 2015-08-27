.. this file is auto generated. do not edit

Delete a File
=============

.. sentry:api-endpoint:: delete-release-file-details

    Permanently remove a file from a release.

    This will also remove the physical file from storage.

    :http-method: DELETE
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/{file_id}/
