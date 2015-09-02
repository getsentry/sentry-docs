.. this file is auto generated. do not edit

Delete a Release
================

.. sentry:api-endpoint:: delete-release-details

    Permanently remove a release and all of its files.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to delete the
                                 release of.
    :pparam string version: the version identifier of the release.
    :auth: required

    :http-method: DELETE
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/

Example
-------


.. sentry:api-scenario:: DeleteRelease
