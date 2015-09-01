.. this file is auto generated. do not edit

List an Organization's Projects
===============================

.. sentry:api-endpoint:: get-organization-projects

    Return a list of projects bound to a organization.

    :pparam string organization_slug: the slug of the organization for
                                      which the projects should be listed.
    :auth: required

    :http-method: GET
    :http-path: /api/0/organizations/{organization_slug}/projects/

Example
-------


.. sentry:api-scenario:: ListOrganizationProjects
