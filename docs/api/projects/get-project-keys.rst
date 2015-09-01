.. this file is auto generated. do not edit

List a Project's Client Keys
============================

.. sentry:api-endpoint:: get-project-keys

    Return a list of client keys bound to a project.

    :pparam string organization_slug: the slug of the organization the
                                      client keys belong to.
    :pparam string project_slug: the slug of the project the client keys
                                 belong to.

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/keys/

Example
-------


.. sentry:api-scenario:: ListClientKeys
