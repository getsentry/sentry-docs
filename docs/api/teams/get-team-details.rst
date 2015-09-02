.. this file is auto generated. do not edit

Retrieve a Team
===============

.. sentry:api-endpoint:: get-team-details

    Return details on an individual team.

    :pparam string organization_slug: the slug of the organization the
                                      team belongs to.
    :pparam string team_slug: the slug of the team to get.
    :auth: required

    :http-method: GET
    :http-path: /api/0/teams/{organization_slug}/{team_slug}/

Example
-------


.. sentry:api-scenario:: GetTeam
