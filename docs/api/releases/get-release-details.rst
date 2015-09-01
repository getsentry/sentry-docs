.. this file is auto generated. do not edit

Retrieve a Release
==================

.. sentry:api-endpoint:: get-release-details

    Return details on an individual release.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to retrieve the
                                 release of.
    :pparam string version: the version identifier of the release.
    :auth: required

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/{version}/

Example
-------


.. sentry:api-scenario:: RetrieveRelease
