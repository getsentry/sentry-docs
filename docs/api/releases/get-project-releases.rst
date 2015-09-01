.. this file is auto generated. do not edit

List a Project's Releases
=========================

.. sentry:api-endpoint:: get-project-releases

    Retrieve a list of releases for a given project.

    :pparam string organization_slug: the slug of the organization the
                                      release belongs to.
    :pparam string project_slug: the slug of the project to list the
                                 releases of.
    :qparam string query: this parameter can beu sed to create a
                          "starts with" filter for the version.

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/

Example
-------


.. sentry:api-scenario:: ListReleases
