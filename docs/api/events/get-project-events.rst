.. this file is auto generated. do not edit

List a Project's Available Samples
==================================

.. sentry:api-endpoint:: get-project-events

    Return a list of sampled events bound to a project.

    :pparam string organization_slug: the slug of the organization the
                                      groups belong to.
    :pparam string project_slug: the slug of the project the groups
                                 belong to.

    :http-method: GET
    :http-path: /api/0/projects/{organization_slug}/{project_slug}/events/

Example
-------


.. sentry:api-scenario:: ListProjectAvailableSamples
