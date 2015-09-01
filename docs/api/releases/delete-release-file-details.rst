.. this file is auto generated. do not edit

Delete a File
=============

.. sentry:api-endpoint:: delete-release-file-details

    Permanently remove a file from a release.

    This will also remove the physical file from storage.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to delete the
                                 file of.
    :pparam string version: the version identifier of the release.
    :pparam string file_id: the ID of the file to delete.
    :auth: required

    :http-method: DELETE
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/{file_id}/

Example
-------


.. sentry:api-scenario:: DeleteReleaseFile
