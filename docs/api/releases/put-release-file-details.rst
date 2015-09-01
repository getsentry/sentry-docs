.. this file is auto generated. do not edit

Update a File
=============

.. sentry:api-endpoint:: put-release-file-details

    Update metadata of an existing file.  Currently only the name of
    the file can be changed.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to update the
                                 file of.
    :pparam string version: the version identifier of the release.
    :pparam string file_id: the ID of the file to update.
    :param string name: the new name of the file.
    :auth: required

    :http-method: PUT
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/{file_id}/

Example
-------


.. sentry:api-scenario:: UpdateReleaseFile
