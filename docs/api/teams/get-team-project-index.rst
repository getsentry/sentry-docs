.. this file is auto generated. do not edit

List a Team's Projects
======================

.. sentry:api-endpoint:: get-team-project-index

    Return a list of projects bound to a team.

    :pparam string organization_slug: the slug of the organization the
                                      team belongs to.
    :pparam string team_slug: the slug of the team to list the projects of.
    :auth: required

    :http-method: GET
    :http-path: /api/0/teams/{organization_slug}/{team_slug}/projects/

Example
-------


.. sentry:api-scenario:: ListTeamProjects
