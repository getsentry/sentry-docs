.. this file is auto generated. do not edit

Retrieve a Project
==================

.. sentry:api-endpoint:: get-project-details

    Return details on an individual project.

    :pparam string organization_slug: the slug of the organization the
                                      project belongs to.
    :pparam string project_slug: the slug of the project to delete.
    :auth: required

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/

Example
-------


.. sentry:api-scenario:: GetProject
