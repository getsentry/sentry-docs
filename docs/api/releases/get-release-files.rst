.. this file is auto generated. do not edit

List a Release's Files
======================

.. sentry:api-endpoint:: get-release-files

    Retrieve a list of files for a given release.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to list the
                                 release files of.
    :pparam string version: the version identifier of the release.
    :auth: required

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/files/

Example
-------


.. sentry:api-scenario:: ListReleaseFiles
