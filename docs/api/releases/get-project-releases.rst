.. this file is auto generated. do not edit

List a Project's Releases
=========================

.. sentry:api-endpoint:: get-project-releases

    Retrieve a list of releases for a given project.

    To find releases for a given version the 'query' parameter may be to
    create a "version STARTS WITH" filter.

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/releases/
