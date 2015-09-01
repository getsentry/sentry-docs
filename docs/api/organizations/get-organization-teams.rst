.. this file is auto generated. do not edit

List an Organization's Teams
============================

.. sentry:api-endpoint:: get-organization-teams

    Return a list of teams bound to a organization.

    :pparam string organization_slug: the slug of the organization for
                                      which the teams should be listed.
    :auth: required

    :http-method: GET
    :http-path: /api/0/organizations/{organization_slug}/teams/

Example
-------


.. sentry:api-scenario:: ListOrganizationTeams
